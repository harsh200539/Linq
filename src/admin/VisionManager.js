"use client";
import { useState, useEffect } from 'react';
import { fetchVisionList, fetchVisionImages, deleteResource, REMOTE_BASE_URL } from '../lib/api';

const VisionManager = () => {
  const [vision, setVision] = useState(null);
  const [sliderImages, setSliderImages] = useState([]);
  const [isAddingImage, setIsAddingImage] = useState(null); // 'MAIN' or 'BOTTOM'
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
        setCanEdit(user.is_superadmin || user.permissions?.includes('vision_edit'));
      } catch (e) {
        setCanEdit(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [visionData, imagesData] = await Promise.all([
        fetchVisionList(),
        fetchVisionImages()
      ]);

      if (visionData && visionData.length > 0) setVision(visionData[0]);
      setSliderImages(imagesData || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleUpdateText = (e) => {
    e.preventDefault();
    if (!canEdit) {
      showToast('You do not have permission to update text', 'error');
      return;
    }
    const formData = new FormData(e.target);
    const method = vision ? 'PATCH' : 'POST';
    const url = vision ? `${REMOTE_BASE_URL}/vision/${vision.id}/` : `${REMOTE_BASE_URL}/vision/`;

    if (vision && !e.target.image.files[0]) {
      formData.delete('image');
    }

    fetch(url, {
      method: method,
      body: formData,
    })
      .then(async res => {
        if (res.ok) {
          showToast('Vision text updated!');
          fetchData();
        } else {
          const errText = await res.text();
          try {
            const errData = JSON.parse(errText);
            showToast('Update failed: ' + (errData.detail || 'Check form'), 'error');
          } catch (e) {
            showToast('Update failed: ' + errText, 'error');
          }
        }
      })
      .catch(err => {
        console.error(err);
        showToast('Network error', 'error');
      });
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      showToast('You do not have permission to upload images', 'error');
      return;
    }
    const file = e.target.image.files[0];
    if (!file || !isAddingImage) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', isAddingImage);

    // Add automated order
    const nextOrder = sliderImages.filter(img => img.category === isAddingImage).length + 1;
    formData.append('order', nextOrder);

    try {
      const res = await fetch(`${REMOTE_BASE_URL}/vision-images/`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        showToast('Image uploaded successfully!');
        setIsAddingImage(null);
        fetchData();
      } else {
        const errData = await res.json();
        showToast('Upload failed: ' + (errData.detail || 'Check image'), 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error', 'error');
    }
  };

  const handleDeleteImage = async (id) => {
    if (!canEdit) {
      showToast('You do not have permission to delete images', 'error');
      return;
    }
    if (!window.confirm('Delete this image?')) return;
    try {
      const res = await deleteResource('vision-images', id);
      if (res) {
        showToast('Image deleted successfully!');
        fetchData();
      } else {
        showToast('Failed to delete image', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting image', 'error');
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;

  const mainImages = sliderImages.filter(img => img.category === 'MAIN');
  const bottomImages = sliderImages.filter(img => img.category === 'BOTTOM');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', position: 'relative' }}>
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

      {/* TEXT CONTENT SECTION */}
      <div className="admin-card" style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 20px' }}>Vision Text Content</h4>
        <form key={vision?.id || 'new'} onSubmit={handleUpdateText}>
          <div className="admin-form-group">
            <label>Title</label>
            <input name="title" defaultValue={vision?.title} required style={{ width: '100%' }} disabled={!canEdit} />
          </div>
          <div className="admin-form-group">
            <label>Subtitle</label>
            <input name="subtitle" defaultValue={vision?.subtitle} required style={{ width: '100%' }} disabled={!canEdit} />
          </div>
          <div className="admin-form-group">
            <label>Main Description</label>
            <textarea name="description" defaultValue={vision?.description} required style={{ width: '100%', minHeight: '80px', padding: '10px' }} disabled={!canEdit} />
          </div>
          <div className="admin-form-group">
            <label>Extended Description</label>
            <textarea name="description_extended" defaultValue={vision?.description_extended} style={{ width: '100%', minHeight: '80px', padding: '10px' }} disabled={!canEdit} />
          </div>
          {canEdit && (
            <button type="submit" className="admin-login-btn" style={{ width: 'auto', padding: '10px 30px' }}>Update Text</button>
          )}
        </form>
      </div>

      {/* MAIN SLIDER IMAGES */}
      <div className="admin-card" style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4 style={{ margin: 0 }}>Main Slider Images (Top)</h4>
          {canEdit && (
            <button
              onClick={() => setIsAddingImage('MAIN')}
              className="admin-login-btn"
              style={{ width: 'auto', padding: '8px 20px' }}
            >
              + Add Main Image
            </button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
          {mainImages.length > 0 ? mainImages.map(img => (
            <div key={img.id} style={{ position: 'relative', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={img.image} alt="Main" style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
              {canEdit && (
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
                >
                  ×
                </button>
              )}
            </div>
          )) : <div style={{ color: '#888', gridColumn: '1/-1', textAlign: 'center', padding: '20px' }}>No main slider images found</div>}
        </div>
      </div>

      {/* BOTTOM SLIDER IMAGES */}
      <div className="admin-card" style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4 style={{ margin: 0 }}>Bottom Slider Images</h4>
          {canEdit && (
            <button
              onClick={() => setIsAddingImage('BOTTOM')}
              className="admin-login-btn"
              style={{ width: 'auto', padding: '8px 20px' }}
            >
              + Add Bottom Image
            </button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
          {bottomImages.length > 0 ? bottomImages.map(img => (
            <div key={img.id} style={{ position: 'relative', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={img.image} alt="Bottom" style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
              {canEdit && (
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
                >
                  ×
                </button>
              )}
            </div>
          )) : <div style={{ color: '#888', gridColumn: '1/-1', textAlign: 'center', padding: '20px' }}>No bottom slider images found</div>}
        </div>
      </div>

      {/* MODAL FOR IMAGE UPLOAD */}
      {isAddingImage && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-wrapper">
            <div className="admin-modal-header">
              <h4>Add {isAddingImage === 'MAIN' ? 'Main' : 'Bottom'} Image</h4>
              <button className="admin-modal-close" onClick={() => setIsAddingImage(null)}>×</button>
            </div>
            <form onSubmit={handleUploadImage}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="admin-form-group">
                  <label>Select Image File</label>
                  <input name="image" type="file" required accept="image/*" style={{ width: '100%' }} />
                </div>
                <div className="admin-form-group">
                  <label>Display Order (Auto)</label>
                  <input
                    name="order"
                    type="number"
                    value={sliderImages.filter(img => img.category === isAddingImage).length + 1}
                    disabled
                    style={{ width: '100%', backgroundColor: '#f0f0f0' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                <button type="submit" className="admin-login-btn" style={{ width: 'auto', padding: '10px 40px' }}>Upload</button>
                <button
                  type="button"
                  onClick={() => setIsAddingImage(null)}
                  style={{ background: '#eee', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionManager;
