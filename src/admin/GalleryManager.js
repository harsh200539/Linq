"use client";
import { useState, useEffect } from 'react';
import { fetchGallery, deleteResource, REMOTE_BASE_URL } from '../lib/api';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [imageType, setImageType] = useState('c');
  const [altText, setAltText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCanEdit(user.is_superadmin || user.permissions?.includes('gallery_edit'));
      } catch (e) {
        setCanEdit(false);
      }
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    setLoading(true);
    fetchGallery().then(data => {
      setImages(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      showToast('Failed to load gallery', 'error');
    });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!newImage) return;

    const formData = new FormData();
    formData.append('image', newImage);
    formData.append('image_type', imageType);
    formData.append('alt_text', altText);

    fetch(`${REMOTE_BASE_URL}/gallery/`, {
      method: 'POST',
      body: formData,
    })
      .then(async res => {
        if (res.ok) {
          fetchImages();
          setNewImage(null);
          setAltText('');
          setIsAdding(false);
          showToast('Image uploaded successfully!');
        } else {
          const errData = await res.json();
          showToast('Upload failed: ' + (errData.detail || 'Check image'), 'error');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('Network error', 'error');
      });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      const res = await deleteResource('gallery', id);
      if (res) {
        fetchImages();
        showToast('Image deleted successfully!');
      } else {
        showToast('Failed to delete image', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting image', 'error');
    }
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
        <h4 style={{ margin: 0 }}>Gallery Management</h4>
        {canEdit && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="admin-login-btn"
            style={{ width: 'auto', padding: '8px 20px' }}
          >
            + Add New Image
          </button>
        )}
      </div>

      {isAdding && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-wrapper">
            <div className="admin-modal-header">
              <h4>Upload New Image</h4>
              <button className="admin-modal-close" onClick={() => { setIsAdding(false); setNewImage(null); setAltText(''); }}>×</button>
            </div>
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="admin-form-group">
                <label>Image File</label>
                <input type="file" onChange={(e) => setNewImage(e.target.files[0])} required style={{ width: '100%' }} />
              </div>
              <div className="admin-form-group">
                <label>Type</label>
                <select value={imageType} onChange={(e) => setImageType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                  <option value="a">Type A (Portrait - Spans 2 rows)</option>
                  <option value="b">Type B (Landscape - Spans 2 cols)</option>
                  <option value="c">Type C (Square - Standard)</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Alt Text</label>
                <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Optional" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="admin-login-btn" style={{ width: 'auto', padding: '10px 30px' }}>Upload</button>
                <button
                  type="button"
                  onClick={() => { setIsAdding(false); setNewImage(null); setAltText(''); }}
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
        <h4 style={{ margin: '0 0 20px' }}>Current Gallery</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
          {images.map(img => (
            <div key={img.id} style={{ border: '1px solid #eee', borderRadius: '4px', padding: '10px', textAlign: 'center' }}>
              <img src={img.image} alt={img.alt_text} loading="lazy" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', willChange: 'transform' }} />
              <div style={{ fontSize: '12px', margin: '10px 0' }}>Type: {img.image_type.toUpperCase()}</div>
              {canEdit && (
                <button
                  onClick={() => handleDelete(img.id)}
                  style={{ background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '3px', padding: '5px 10px', cursor: 'pointer', fontSize: '11px' }}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryManager;
