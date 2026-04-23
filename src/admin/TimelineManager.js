"use client";
import { useState, useEffect } from 'react';
import { fetchTimeline, deleteResource, REMOTE_BASE_URL } from '../lib/api';

const TimelineManager = () => {
  const [items, setItems] = useState([]);
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
        setCanEdit(user.is_superadmin || user.permissions?.includes('timeline_edit'));
      } catch (e) {
        setCanEdit(false);
      }
    }
  }, []);

  // Drag and Drop State
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    setLoading(true);
    fetchTimeline()
      .then(data => {
        setItems(data);
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

    const url = editingItem?.id ? `${REMOTE_BASE_URL}/timeline/${editingItem.id}/` : `${REMOTE_BASE_URL}/timeline/`;
    const method = editingItem?.id ? 'PATCH' : 'POST';

    if (editingItem?.id && !e.target.thumbnail.files[0]) {
      formData.delete('thumbnail');
    }

    // Add automated order
    const nextOrder = editingItem?.id ? editingItem.order : (items.length > 0 ? Math.max(...items.map(i => i.order || 0)) + 1 : 1);
    formData.append('order', nextOrder);

    fetch(url, {
      method: method,
      body: formData,
    })
      .then(async res => {
        if (res.ok) {
          fetchItems();
          setEditingItem(null);
          setIsAdding(false);
          showToast(`Timeline item ${editingItem?.id ? 'updated' : 'created'} successfully!`);
        } else {
          const errText = await res.text();
          try {
            const errData = JSON.parse(errText);
            showToast('Error: ' + (errData.detail || 'Check form'), 'error');
          } catch (e) {
            showToast('Error: ' + errText, 'error');
          }
        }
      })
      .catch(err => {
        console.error(err);
        showToast('Network error', 'error');
      });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this timeline item?')) return;
    try {
      const res = await deleteResource('timeline', id);
      if (res) {
        fetchItems();
        showToast('Timeline item deleted successfully!');
      } else {
        showToast('Failed to delete item', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting item', 'error');
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

    const draggedData = items[draggedItem];

    // Reorder the local array
    const newList = [...items];
    newList.splice(draggedItem, 1);
    newList.splice(dragOverItem, 0, draggedData);

    // Update local state instantly
    setItems(newList);

    const orderedIds = newList.map(item => item.id);

    const storedUser = localStorage.getItem('adminUser');
    const user = storedUser ? JSON.parse(storedUser) : null;

    fetch(`${REMOTE_BASE_URL}/timeline/reorder/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ordered_ids: orderedIds,
        user_id: user?.id
      })
    })
      .then(res => res.json())
      .then(() => fetchItems())
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
        <h4 style={{ margin: 0 }}>Timeline Events</h4>
        {canEdit && !isAdding && !editingItem && (
          <button
            onClick={() => setIsAdding(true)}
            className="admin-login-btn"
            style={{ width: 'auto', padding: '8px 20px' }}
          >
            + Add New Event
          </button>
        )}
      </div>

      {(isAdding || editingItem) && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-wrapper">
            <div className="admin-modal-header">
              <h4>{editingItem?.id ? 'Edit Event' : 'New Event'}</h4>
              <button className="admin-modal-close" onClick={() => { setEditingItem(null); setIsAdding(false); }}>×</button>
            </div>
            <form key={editingItem?.id || 'new'} onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="admin-form-group">
                  <label>Year</label>
                  <input
                    name="year"
                    type="number"
                    defaultValue={editingItem?.year || ''}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Display Order (Auto-generated)</label>
                  <input
                    name="order"
                    type="number"
                    value={editingItem?.id ? editingItem.order : (items.length > 0 ? Math.max(...items.map(i => i.order || 0)) + 1 : 1)}
                    disabled
                    style={{ width: '100%', backgroundColor: '#f0f0f0' }}
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Title</label>
                <input name="title" defaultValue={editingItem?.title} required style={{ width: '100%' }} />
              </div>
              <div className="admin-form-group">
                <label>Headline (Supports &lt;highlight&gt; tag)</label>
                <input name="headline" defaultValue={editingItem?.headline} required style={{ width: '100%' }} />
              </div>
              <div className="admin-form-group">
                <label>Short Description</label>
                <textarea name="description" defaultValue={editingItem?.description} style={{ width: '100%', minHeight: '80px', padding: '10px' }} />
              </div>
              <div className="admin-form-group">
                <label>Thumbnail</label>
                <input name="thumbnail" type="file" required={!editingItem} style={{ width: '100%' }} />
                {editingItem?.thumbnail && <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>Current: {editingItem.thumbnail}</div>}
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

      <div className="admin-card" style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 20px' }}>Existing Timeline</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '10px' }}>Year</th>
              <th style={{ padding: '10px' }}>Title</th>
              <th style={{ padding: '10px' }}>Order</th>
              {canEdit && <th style={{ padding: '10px' }}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
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
                <td style={{ padding: '10px' }}>{item.year}</td>
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
                    <button onClick={() => handleDelete(item.id)} style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Delete</button>
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

export default TimelineManager;
