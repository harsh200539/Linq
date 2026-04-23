"use client";
import { useState, useEffect } from 'react';
import { fetchTeamMembers as fetchTeamMembersApi, deleteResource, REMOTE_BASE_URL } from '../lib/api';

const TeamManager = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('adminUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setCanEdit(user.is_superadmin || user.permissions?.includes('team_edit'));
            } catch (e) {
                setCanEdit(false);
            }
        }
    }, []);

    // Drag and Drop State
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverItem, setDragOverItem] = useState(null);

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const fetchTeamMembers = () => {
        setLoading(true);
        fetchTeamMembersApi()
            .then(data => {
                setTeamMembers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (imageFile) {
            formData.append('image', imageFile);
        } else if (editingItem && editingItem.id) {
            formData.delete('image');
        }

        // Add automated order
        const nextOrder = editingItem?.id ? editingItem.order : (teamMembers.length > 0 ? Math.max(...teamMembers.map(m => m.order || 0)) + 1 : 1);
        formData.append('order', nextOrder);

        const method = editingItem?.id ? 'PATCH' : 'POST';
        const url = editingItem?.id ? `${REMOTE_BASE_URL}/team-members/${editingItem.id}/` : `${REMOTE_BASE_URL}/team-members/`;

        fetch(url, {
            method: method,
            body: formData,
        })
            .then(async res => {
                if (res.ok) {
                    showToast(`Team member ${editingItem?.id ? 'updated' : 'created'} successfully!`);
                    setEditingItem(null);
                    setIsAdding(false);
                    setImageFile(null);
                    e.target.reset();
                    fetchTeamMembers();
                } else {
                    const errText = await res.text();
                    try {
                        const errData = JSON.parse(errText);
                        showToast('Operation failed: ' + (errData.detail || 'Check form data'), 'error');
                    } catch (e) {
                        showToast('Operation failed: ' + errText, 'error');
                    }
                }
            })
            .catch(err => {
                console.error(err);
                showToast('Network error', 'error');
            });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this team member?')) return;
        try {
            const res = await deleteResource('team-members', id);
            if (res) {
                fetchTeamMembers();
                showToast('Team member deleted successfully!');
            } else {
                showToast('Failed to delete team member', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Error deleting team member', 'error');
        }
    };

    const handleDragStart = (e, index) => {
        if (!canEdit) {
            e.preventDefault();
            return;
        }
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = 'move';
        // Make the dragged row semi-transparent
        setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
    };

    const handleDragEnter = (e, index) => {
        e.preventDefault();
        setDragOverItem(index);
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedItem(null);
        setDragOverItem(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (draggedItem === null || dragOverItem === null || draggedItem === dragOverItem) {
            handleDragEnd(e);
            return;
        }

        const draggedData = teamMembers[draggedItem];

        // Reorder the local array
        const newList = [...teamMembers];
        newList.splice(draggedItem, 1);
        newList.splice(dragOverItem, 0, draggedData);

        // Update local state instantly
        setTeamMembers(newList);

        const orderedIds = newList.map(item => item.id);

        const storedUser = localStorage.getItem('adminUser');
        const user = storedUser ? JSON.parse(storedUser) : null;

        fetch(`${REMOTE_BASE_URL}/team-members/reorder/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ordered_ids: orderedIds,
                user_id: user?.id
            })
        })
            .then(res => res.json())
            .then(() => fetchTeamMembers())
            .catch(err => console.error(err))
            .finally(() => handleDragEnd(e));
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'relative' }}>
            {/* Custom Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    backgroundColor: toast.type === 'error' ? '#ff4d4f' : '#10b981',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 10000,
                    animation: 'slideIn 0.3s ease-out',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: '500'
                }}>
                    {toast.type === 'error' ? '✕' : '✓'} {toast.message}
                    <style>{`
                        @keyframes slideIn {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                    `}</style>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0 }}>Team Management</h4>
                {canEdit && !isAdding && !editingItem && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="admin-login-btn"
                        style={{ width: 'auto', padding: '8px 20px' }}
                    >
                        + Add New Team
                    </button>
                )}
            </div>

            {(isAdding || editingItem) && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-wrapper">
                        <div className="admin-modal-header">
                            <h4>{editingItem?.id ? 'Edit Team Member' : 'Add New Team Member'}</h4>
                            <button className="admin-modal-close" onClick={() => { setEditingItem(null); setIsAdding(false); setImageFile(null); }}>×</button>
                        </div>
                        <form key={editingItem?.id || 'new'} onSubmit={handleSave}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="admin-form-group">
                                    <label>Team Name (e.g. "Sales Team")</label>
                                    <input name="title" defaultValue={editingItem?.title} required style={{ width: '100%' }} />
                                </div>
                                <div className="admin-form-group">
                                    <label>Display Order (Auto-generated)</label>
                                    <input
                                        name="order"
                                        type="number"
                                        value={editingItem?.id ? editingItem.order : (teamMembers.length > 0 ? Math.max(...teamMembers.map(m => m.order || 0)) + 1 : 1)}
                                        disabled
                                        style={{ width: '100%', backgroundColor: '#f0f0f0' }}
                                    />
                                </div>
                            </div>
                            <div className="admin-form-group">
                                <label>Description</label>
                                <textarea name="desc" defaultValue={editingItem?.desc} required style={{ width: '100%', minHeight: '80px', padding: '10px' }} />
                            </div>
                            <div className="admin-form-group">
                                <label>Team Image</label>
                                {editingItem && editingItem.image && (
                                    <div style={{ marginBottom: '10px' }}>
                                        <img src={editingItem.image} alt="current" style={{ width: '100px', borderRadius: '4px' }} />
                                    </div>
                                )}
                                <input type="file" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" required={!editingItem} />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" className="admin-login-btn" style={{ width: 'auto', padding: '10px 30px' }}>
                                    {editingItem ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setEditingItem(null); setIsAdding(false); setImageFile(null); }}
                                    style={{ background: '#eee', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="admin-card" style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 20px' }}>Existing Team Members</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '10px' }}>Image</th>
                            <th style={{ padding: '10px' }}>Title</th>
                            <th style={{ padding: '10px' }}>Order</th>
                            {canEdit && <th style={{ padding: '10px' }}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {teamMembers.map((item, index) => (
                            <tr
                                key={item.id}
                                style={{
                                    borderBottom: '1px solid #f9f9f9',
                                    cursor: canEdit ? 'grab' : 'default',
                                    backgroundColor: dragOverItem === index ? '#f0f8ff' : 'transparent',
                                    transition: 'background-color 0.2s ease'
                                }}
                                draggable={canEdit}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                            >
                                <td style={{ padding: '10px' }}>
                                    <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                </td>
                                <td style={{ padding: '10px' }}>{item.title}</td>
                                <td style={{ padding: '10px' }}>{item.order}</td>
                                {canEdit && (
                                    <td style={{ padding: '10px' }}>
                                        <button
                                            onClick={() => { setEditingItem(item); setIsAdding(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            style={{ background: '#0e224e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', marginRight: '5px', cursor: 'pointer' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeamManager;
