"use client";
import { useState, useEffect } from 'react';
import { fetchTestimonials as fetchTestimonialsApi, deleteResource, REMOTE_BASE_URL } from '../lib/api';

const TestimonialManager = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
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
                setCanEdit(user.is_superadmin || user.permissions?.includes('testimonials_edit'));
            } catch (e) {
                setCanEdit(false);
            }
        }
    }, []);

    // Drag and Drop State
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverItem, setDragOverItem] = useState(null);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = () => {
        setLoading(true);
        fetchTestimonialsApi()
            .then(data => {
                setTestimonials(data);
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

        // Handle checkbox logic
        formData.set('is_avatar_only', formData.get('is_avatar_only') === 'on' ? 'true' : 'false');

        const method = editingItem?.id ? 'PATCH' : 'POST';
        const url = editingItem?.id ? `${REMOTE_BASE_URL}/testimonials/${editingItem.id}/` : `${REMOTE_BASE_URL}/testimonials/`;

        if (editingItem?.id) {
            const imageFile = formData.get('image');
            if (imageFile && !imageFile.name) {
                formData.delete('image');
            }
        }

        // Add automated order
        const cat = formData.get('category') || 'MIDDLE';
        const nextOrder = editingItem?.id ? editingItem.order : (testimonials.filter(t => t.category === cat).length + 1);
        formData.append('order', nextOrder);

        fetch(url, {
            method: method,
            body: formData,
        })
            .then(async res => {
                if (res.ok) {
                    showToast(`Testimonial ${editingItem?.id ? 'updated' : 'created'} successfully!`);
                    setEditingItem(null);
                    setIsAdding(false);
                    e.target.reset();
                    fetchTestimonials();
                } else {
                    const errText = await res.text();
                    try {
                        const errData = JSON.parse(errText);
                        showToast('Operation failed: ' + (errData.detail || 'Check form'), 'error');
                    } catch (err) {
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
        if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
        try {
            const res = await deleteResource('testimonials', id);
            if (res) {
                fetchTestimonials();
                showToast('Testimonial deleted successfully!');
            } else {
                showToast('Failed to delete testimonial', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Error deleting testimonial', 'error');
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

    const handleDrop = (e, category) => {
        e.preventDefault();
        if (draggedItem === null || dragOverItem === null || draggedItem === dragOverItem) {
            handleDragEnd(e);
            return;
        }

        const list = testimonials.filter(t => t.category === category);
        const draggedData = list[draggedItem];

        // Reorder the local array
        const newList = [...list];
        newList.splice(draggedItem, 1);
        newList.splice(dragOverItem, 0, draggedData);

        // Update the main testimonials state locally right away for smooth UI
        const otherCategories = testimonials.filter(t => t.category !== category);
        setTestimonials([...otherCategories, ...newList]);

        const orderedIds = newList.map(item => item.id);

        const storedUser = localStorage.getItem('adminUser');
        const user = storedUser ? JSON.parse(storedUser) : null;

        fetch(`${REMOTE_BASE_URL}/testimonials/reorder/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                category,
                ordered_ids: orderedIds,
                user_id: user?.id
            })
        })
            .then(res => res.json())
            .then(() => fetchTestimonials())
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
                <h4 style={{ margin: 0 }}>Testimonial Management</h4>
                {canEdit && !isAdding && !editingItem && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="admin-login-btn"
                        style={{ width: 'auto', padding: '8px 20px' }}
                    >
                        + Add New Testimonial
                    </button>
                )}
            </div>

            {(isAdding || editingItem) && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-wrapper">
                        <div className="admin-modal-header">
                            <h4>{editingItem?.id ? 'Edit Testimonial' : 'Add New Testimonial'}</h4>
                            <button className="admin-modal-close" onClick={() => { setEditingItem(null); setIsAdding(false); }}>×</button>
                        </div>
                        <form key={editingItem?.id || 'new'} onSubmit={handleSave}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="admin-form-group">
                                    <label>Column Position</label>
                                    <select
                                        name="category"
                                        defaultValue={editingItem?.category || 'MIDDLE'}
                                        required
                                        style={{ width: '100%', padding: '10px' }}
                                        onChange={(e) => {
                                            if (!editingItem) {
                                                // Trigger re-render to update auto-order
                                                const cat = e.target.value;
                                                const count = testimonials.filter(t => t.category === cat).length;
                                                const nextOrder = count + 1;
                                                document.getElementById('auto-order-input').value = nextOrder;
                                            }
                                        }}
                                    >
                                        <option value="MIDDLE">Middle Column</option>
                                        <option value="RIGHT">Right Column</option>
                                    </select>
                                </div>
                                <div className="admin-form-group">
                                    <label>Display Order (Auto)</label>
                                    <input
                                        id="auto-order-input"
                                        name="order"
                                        type="number"
                                        value={editingItem?.id ? editingItem.order : (testimonials.filter(t => t.category === (editingItem?.category || 'MIDDLE')).length + 1)}
                                        disabled
                                        style={{ width: '100%', backgroundColor: '#f0f0f0' }}
                                    />
                                </div>
                            </div>
                            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', marginBottom: '15px' }}>
                                <input type="checkbox" name="is_avatar_only" defaultChecked={editingItem?.is_avatar_only} id="isAvatarOnly" style={{ width: '18px', height: '18px' }} />
                                <label htmlFor="isAvatarOnly" style={{ margin: 0 }}>Avatar Only (Variant: No text, right column style)</label>
                            </div>
                            <div className="admin-form-group">
                                <label>Author Name</label>
                                <input name="name" defaultValue={editingItem?.name} required style={{ width: '100%' }} />
                            </div>
                            <div className="admin-form-group">
                                <label>Author Title / Role</label>
                                <input name="role" defaultValue={editingItem?.role} required style={{ width: '100%' }} />
                            </div>
                            <div className="admin-form-group">
                                <label>Quote Text (Leave blank if Avatar Only)</label>
                                <textarea name="quote" defaultValue={editingItem?.quote} style={{ width: '100%', minHeight: '100px', padding: '10px' }} />
                            </div>
                            <div className="admin-form-group">
                                <label>Author Photo</label>
                                <input name="image" type="file" required={!editingItem} style={{ width: '100%', padding: '8px' }} />
                                {editingItem?.image && <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>Current: {editingItem.image}</div>}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" className="admin-login-btn" style={{ width: 'auto', padding: '10px 30px' }}>
                                    {editingItem ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setEditingItem(null); setIsAdding(false); }}
                                    style={{ background: '#eee', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="admin-card" style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 20px' }}>Middle Column Testimonials</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '10px' }}>Name</th>
                                <th style={{ padding: '10px' }}>Order</th>
                                {canEdit && <th style={{ padding: '10px' }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {testimonials.filter(t => t.category === 'MIDDLE').map((item, index) => (
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
                                    onDrop={(e) => handleDrop(e, 'MIDDLE')}
                                >
                                    <td style={{ padding: '10px' }}>{item.name}</td>
                                    <td style={{ padding: '10px' }}>{item.order}</td>
                                    {canEdit && (
                                        <td style={{ padding: '10px', display: 'flex', gap: '5px' }}>
                                            <button
                                                onClick={() => { setEditingItem(item); setIsAdding(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                style={{ background: '#0e224e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
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

                <div className="admin-card" style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 20px' }}>Right Column Testimonials</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '10px' }}>Name</th>
                                <th style={{ padding: '10px' }}>Order</th>
                                {canEdit && <th style={{ padding: '10px' }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {testimonials.filter(t => t.category === 'RIGHT').map((item, index) => (
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
                                    onDrop={(e) => handleDrop(e, 'RIGHT')}
                                >
                                    <td style={{ padding: '10px' }}>{item.name}</td>
                                    <td style={{ padding: '10px' }}>{item.order}</td>
                                    {canEdit && (
                                        <td style={{ padding: '10px', display: 'flex', gap: '5px' }}>
                                            <button
                                                onClick={() => { setEditingItem(item); setIsAdding(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                style={{ background: '#0e224e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
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
        </div>
    );
};

export default TestimonialManager;
