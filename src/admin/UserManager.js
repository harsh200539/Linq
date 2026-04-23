"use client";
import React, { useState, useEffect } from 'react';
import { fetchAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '../lib/api';
import { UserPlus, Trash2, Edit2, Shield, CheckCircle2, XCircle } from 'lucide-react';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: '', password: '', is_superadmin: false, permissions: [] });
  const [showModal, setShowModal] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [toast, setToast] = useState(null);

  const modules = [
    { id: 'gallery', label: 'Gallery' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'jobs', label: 'Jobs/Careers' },
    { id: 'growth', label: 'Career Growth' },
    { id: 'vision', label: 'Vision/Story' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'team', label: 'Team Members' },
    { id: 'users', label: 'User Management' },
  ];

  useEffect(() => {
    loadUsers();
    
    // Permission check
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCanEdit(user.is_superadmin || user.permissions?.includes('users_edit'));
      } catch (e) {
        setCanEdit(false);
      }
    }
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    const data = await fetchAdminUsers();
    setUsers(data || []);
    setIsLoading(false);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTogglePermission = (modId, accessType) => {
    const permKey = `${modId}_${accessType}`;
    const perms = [...currentUser.permissions];
    if (perms.includes(permKey)) {
      setCurrentUser({ ...currentUser, permissions: perms.filter(p => p !== permKey) });
    } else {
      // If adding 'edit', ensure 'view' is also added
      if (accessType === 'edit' && !perms.includes(`${modId}_view`)) {
        setCurrentUser({ ...currentUser, permissions: [...perms, `${modId}_view`, permKey] });
      } else {
        setCurrentUser({ ...currentUser, permissions: [...perms, permKey] });
      }
    }
  };

  const hasPermission = (modId, accessType) => {
    return currentUser.permissions.includes(`${modId}_${accessType}`);
  };

  const getModulePermissionLabel = (user, modId) => {
    const hasView = user.permissions.includes(`${modId}_view`);
    const hasEdit = user.permissions.includes(`${modId}_edit`);
    if (hasEdit) return { text: 'Edit Access', type: 'edit' };
    if (hasView) return { text: 'View Only', type: 'view' };
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      showToast('You do not have permission to modify users', 'error');
      return;
    }
    try {
      if (isEditing) {
        const updateData = { ...currentUser };
        if (!updateData.password) delete updateData.password;

        console.log("[DEBUG] Sending update payload:", {
          id: currentUser.id,
          username: currentUser.username,
          permissions: currentUser.permissions,
          is_superadmin: currentUser.is_superadmin
        });

        const result = await updateAdminUser(currentUser.id, updateData);
        if (result) {
          showToast('User updated successfully on live server');
          setShowModal(false);
          loadUsers();
        } else {
          showToast('Failed to update user on production server', 'error');
        }
      } else {
        if (!currentUser.password) {
          showToast('Password is required for new users', 'error');
          return;
        }
        const result = await createAdminUser(currentUser);
        if (result) {
          showToast('New user created successfully on live server');
          setShowModal(false);
          loadUsers();
        } else {
          showToast('Failed to create user on production server', 'error');
        }
      }
    } catch (err) {
      showToast('Critical connection error with production backend', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!canEdit) {
      showToast('You do not have permission to delete users', 'error');
      return;
    }
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteAdminUser(id);
      showToast('User deleted');
      loadUsers();
    }
  };

  const openAddModal = () => {
    if (!canEdit) {
      showToast('You do not have permission to add users', 'error');
      return;
    }
    setIsEditing(false);
    setCurrentUser({ username: '', password: '', is_superadmin: false, permissions: [] });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    if (!canEdit) {
      showToast('You do not have permission to edit users', 'error');
      return;
    }
    setIsEditing(true);
    setCurrentUser({ ...user, password: '', permissions: user.permissions || [] });
    setShowModal(true);
  };

  return (
    <div className="admin-manager-container">
      <div className="manager-header">
        <div className="d-flex align-items-center gap-4">
          <div>
            <h2>User Management</h2>
            <p className="text-muted">Create and manage admin users and their permissions</p>
          </div>
          {/* <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{ background: '#ecfdf5', border: '1px solid #10b981', height: 'fit-content' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857', letterSpacing: '0.5px' }}>● LIVE BACKEND</span>
          </div> */}
        </div>
        {canEdit && (
          <button className="btn-primary" onClick={openAddModal}>
            <UserPlus size={18} /> Add New User
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="loading-spinner">Loading users...</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Module Permissions</th>
                <th>Created At</th>
                {canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.username}</strong></td>
                  <td>
                    {user.is_superadmin ? (
                      <span className="badge badge-primary">Super Admin</span>
                    ) : (
                      <span className="badge badge-info">Admin</span>
                    )}
                  </td>
                  <td>
                    <div className="permissions-pills">
                      {user.is_superadmin ? (
                        <span className="text-muted">Full Access</span>
                      ) : (
                        modules.map(mod => {
                          const result = getModulePermissionLabel(user, mod.id);
                          if (!result) return null;
                          return (
                            <span key={mod.id} className={`perm-pill ${result.type}`}>
                              {mod.label}: <strong>{result.text}</strong>
                            </span>
                          );
                        })
                      )}
                    </div>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  {canEdit && (
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" onClick={() => openEditModal(user)} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDelete(user.id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-wrapper" style={{ maxWidth: '650px' }}>
            <div className="admin-modal-header">
              <h4>{isEditing ? 'Edit Existing User' : 'Create New User'}</h4>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="admin-modal-body">
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Username</label>
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={currentUser.username}
                      onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
                      required
                      disabled={isEditing}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>{isEditing ? 'New Password' : 'Password'}</label>
                    <input
                      type="password"
                      placeholder={isEditing ? "(leave blank to keep)" : "Enter password"}
                      value={currentUser.password}
                      onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                      required={!isEditing}
                    />
                  </div>
                </div>

                <div className="form-group mb-4" style={{ marginTop: '5px' }}>
                  <label className="checkbox-label" style={{ backgroundColor: currentUser.is_superadmin ? '#ebf0f7' : '#f8f9fa' }}>
                    <input
                      type="checkbox"
                      checked={currentUser.is_superadmin}
                      onChange={(e) => setCurrentUser({ ...currentUser, is_superadmin: e.target.checked })}
                    />
                    Super Admin Access
                  </label>
                  <p className="text-muted" style={{ fontSize: '12px', marginTop: '8px', marginLeft: '5px' }}>
                    * Super admins have full access to all sections and can manage permissions of other users.
                  </p>
                </div>

                {!currentUser.is_superadmin && (
                  <div className="permissions-selector">
                    <div className="permissions-header-row">
                      <div className="mod-name-col">Module Name</div>
                      <div className="mod-perm-col">View Access</div>
                      <div className="mod-perm-col">Edit Access</div>
                    </div>
                    <div className="modules-list">
                      {modules.map(mod => (
                        <div key={mod.id} className="module-perm-row">
                          <div className="mod-name-col">{mod.label}</div>
                          <div className="mod-perm-col">
                            <input
                              type="checkbox"
                              checked={hasPermission(mod.id, 'view')}
                              onChange={() => handleTogglePermission(mod.id, 'view')}
                            />
                          </div>
                          <div className="mod-perm-col">
                            <input
                              type="checkbox"
                              checked={hasPermission(mod.id, 'edit')}
                              onChange={() => handleTogglePermission(mod.id, 'edit')}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} style={{ padding: '10px 25px' }}>Cancel</button>
                  {canEdit && (
                    <button type="submit" className="btn-primary" style={{ padding: '10px 30px' }}>
                      <Shield size={18} /> {isEditing ? 'Update User Permissions' : 'Create Admin User'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default UserManager;
