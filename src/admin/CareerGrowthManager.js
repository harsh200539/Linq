"use client";
import { useState, useEffect } from 'react';
import { fetchMembers as fetchMembersAPI, REMOTE_BASE_URL } from '../lib/api';

const CareerGrowthManager = () => {
    const [members, setMembers] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [experiences, setExperiences] = useState([]);
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
                setCanEdit(user.is_superadmin || user.permissions?.includes('growth_edit'));
            } catch (e) {
                setCanEdit(false);
            }
        }
    }, []);

    useEffect(() => {
        loadMembers();
    }, []);

    useEffect(() => {
        if (editingItem) {
            setExperiences(editingItem.experiences || []);
        } else if (isAdding) {
            setExperiences([]);
        }
    }, [editingItem, isAdding]);

    const loadMembers = () => {
        setLoading(true);
        fetchMembersAPI()
            .then(data => {
                setMembers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleAddExperience = () => {
        const nextOrder = experiences.length > 0
            ? Math.max(...experiences.map(e => e.order || 0)) + 1
            : 1;
        setExperiences([...experiences, { title: '', year: '', duration: '', description: '', exp_type: 'hollow', order: nextOrder }]);
    };

    const handleRemoveExperience = (index) => {
        setExperiences(experiences.filter((_, i) => i !== index));
    };

    const handleExperienceChange = (index, field, value) => {
        const newExps = [...experiences];
        newExps[index][field] = value;
        setExperiences(newExps);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Prepare the basic data
        const nextMemberOrder = isAdding
            ? (members.length > 0 ? Math.max(...members.map(m => m.order || 0)) + 1 : 1)
            : (editingItem?.order || 1);

        const memberData = {
            name: formData.get('name'),
            role: formData.get('role'),
            description: formData.get('description'),
            detailed_description: formData.get('detailed_description'),
            member_bg_class: formData.get('member_bg_class'),
            order: nextMemberOrder,
            experiences: experiences
        };

        const method = editingItem?.id ? 'PATCH' : 'POST';
        const url = editingItem?.id ? `${REMOTE_BASE_URL}/career-growth-members/${editingItem.id}/` : `${REMOTE_BASE_URL}/career-growth-members/`;

        try {
            // First save the member data (without image to handle nested exps easily in JSON if we use JSON, 
            // but since we need image upload, we must use FormData or two steps)

            // Actually, my updated serializer handles nested writes. 
            // But FormData doesn't support nested objects easily.
            // I'll send it as JSON and then handle image separately, or use a trick.

            // Trick: Send everything as JSON, and if there's an image, send a second PATCH with FormData.

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberData)
            });

            if (response.ok) {
                const savedMember = await response.json();

                // If there's an image file, upload it now
                if (imageFile) {
                    const imgFormData = new FormData();
                    imgFormData.append('image', imageFile);
                    await fetch(`${REMOTE_BASE_URL}/career-growth-members/${savedMember.id}/`, {
                        method: 'PATCH',
                        body: imgFormData
                    });
                }

                showToast(`Member ${editingItem?.id ? 'updated' : 'created'} successfully!`);
                setEditingItem(null);
                setIsAdding(false);
                setImageFile(null);
                loadMembers();
            } else {
                const errData = await response.json();
                showToast('Error: ' + (errData.detail || 'Failed to save'), 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Network error', 'error');
        }
    };

    const handleDelete = (id) => {
        if (!window.confirm('Are you sure you want to delete this member?')) return;
        fetch(`${REMOTE_BASE_URL}/career-growth-members/${id}/`, { method: 'DELETE' })
            .then(res => {
                if (res.ok) {
                    loadMembers();
                    showToast('Member deleted successfully!');
                }
            })
            .catch(err => {
                console.error(err);
                showToast('Error deleting member', 'error');
            });
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
                <h4 style={{ margin: 0 }}>Career Growth Management</h4>
                {canEdit && !isAdding && !editingItem && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="admin-login-btn"
                        style={{ width: 'auto', padding: '8px 20px' }}
                    >
                        + Add New Member
                    </button>
                )}
            </div>

            {(isAdding || editingItem) && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-wrapper" style={{ maxWidth: '800px' }}>
                        <div className="admin-modal-header">
                            <h4>{editingItem?.id ? 'Edit Member' : 'Add New Member'}</h4>
                            <button className="admin-modal-close" onClick={() => { setEditingItem(null); setIsAdding(false); setImageFile(null); }}>×</button>
                        </div>
                        <form onSubmit={handleSave} style={{ maxHeight: '80vh', overflowY: 'auto', padding: '10px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="admin-form-group">
                                    <label>Name</label>
                                    <input name="name" defaultValue={editingItem?.name} required style={{ width: '100%' }} />
                                </div>
                                <div className="admin-form-group">
                                    <label>Role</label>
                                    <input name="role" defaultValue={editingItem?.role} required style={{ width: '100%' }} />
                                </div>
                            </div>

                            <div className="admin-form-group" style={{ marginTop: '10px' }}>
                                <label>Short Description (Card)</label>
                                <textarea name="description" defaultValue={editingItem?.description} required style={{ width: '100%', minHeight: '60px' }} />
                            </div>

                            <div className="admin-form-group" style={{ marginTop: '10px' }}>
                                <label>Detailed Description (Detail Page)</label>
                                <textarea name="detailed_description" defaultValue={editingItem?.detailed_description} required style={{ width: '100%', minHeight: '100px' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                                <div className="admin-form-group">
                                    <label>BG Class (member-bg-primary, etc.)</label>
                                    <input name="member_bg_class" defaultValue={editingItem?.member_bg_class || 'member-bg-primary'} style={{ width: '100%' }} />
                                </div>
                                <div className="admin-form-group">
                                    <label>Display Order (Auto-generated)</label>
                                    <input
                                        name="order"
                                        type="number"
                                        value={editingItem?.order || (members.length > 0 ? Math.max(...members.map(m => m.order || 0)) + 1 : 1)}
                                        disabled
                                        style={{ width: '100%', backgroundColor: '#f0f0f0', color: '#666' }}
                                    />
                                </div>
                            </div>

                            <div className="admin-form-group" style={{ marginTop: '10px' }}>
                                <label>Profile Image</label>
                                {editingItem?.image && (
                                    <div style={{ marginBottom: '10px' }}>
                                        <img src={editingItem.image} alt="current" style={{ width: '80px', borderRadius: '4px' }} />
                                    </div>
                                )}
                                <input type="file" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" />
                            </div>

                            <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h5 style={{ margin: 0 }}>Experience Timeline</h5>
                                    <button type="button" onClick={handleAddExperience} style={{ background: '#0e224e', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>+ Add Experience</button>
                                </div>

                                {experiences.map((exp, index) => (
                                    <div key={index} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '15px', position: 'relative' }}>
                                        <button type="button" onClick={() => handleRemoveExperience(index)} style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff4d4f', color: 'white', border: 'none', width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer' }}>×</button>

                                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px' }}>
                                            <div>
                                                <label style={{ fontSize: '12px' }}>Title</label>
                                                <input value={exp.title} onChange={(e) => handleExperienceChange(index, 'title', e.target.value)} required style={{ width: '100%', padding: '5px' }} />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '12px' }}>Year</label>
                                                <input value={exp.year} onChange={(e) => handleExperienceChange(index, 'year', e.target.value)} required style={{ width: '100%', padding: '5px' }} />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '12px' }}>Duration</label>
                                                <input value={exp.duration} onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)} required style={{ width: '100%', padding: '5px' }} />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '12px' }}>Order (Auto)</label>
                                                <input value={exp.order} disabled style={{ width: '100%', padding: '5px', backgroundColor: '#f0f0f0' }} />
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '10px' }}>
                                            <div>
                                                <label style={{ fontSize: '12px' }}>Description</label>
                                                <textarea value={exp.description} onChange={(e) => handleExperienceChange(index, 'description', e.target.value)} required style={{ width: '100%', minHeight: '40px', padding: '5px' }} />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '12px' }}>Marker Type</label>
                                                <select value={exp.exp_type} onChange={(e) => handleExperienceChange(index, 'exp_type', e.target.value)} style={{ width: '100%', padding: '5px' }}>
                                                    <option value="hollow">Hollow (Past)</option>
                                                    <option value="filled">Filled (Current)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" className="admin-login-btn" style={{ width: 'auto', padding: '10px 30px' }}>
                                    {editingItem ? 'Update Member' : 'Create Member'}
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
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '10px' }}>Image</th>
                            <th style={{ padding: '10px' }}>Name</th>
                            <th style={{ padding: '10px' }}>Role</th>
                            <th style={{ padding: '10px' }}>Experiences</th>
                            {canEdit && <th style={{ padding: '10px' }}>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(member => (
                            <tr key={member.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                <td style={{ padding: '10px' }}>
                                    <img src={member.image} alt={member.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                </td>
                                <td style={{ padding: '10px' }}>{member.name}</td>
                                <td style={{ padding: '10px' }}>{member.role}</td>
                                <td style={{ padding: '10px' }}>{member.experiences?.length || 0} items</td>
                                {canEdit && (
                                    <td style={{ padding: '10px' }}>
                                        <button onClick={() => setEditingItem(member)} style={{ background: '#0e224e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', marginRight: '5px', cursor: 'pointer' }}>Edit</button>
                                        <button onClick={() => handleDelete(member.id)} style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Delete</button>
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

export default CareerGrowthManager;
