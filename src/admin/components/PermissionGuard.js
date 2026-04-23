"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Higher-order component to protect admin routes based on permissions.
 * @param {string} moduleId - The module ID to check permission for (e.g. 'gallery', 'jobs').
 * @param {boolean} superOnly - If true, only superadmins can access.
 */
const PermissionGuard = ({ children, moduleId, superOnly = false }) => {
  const [status, setStatus] = useState('loading'); // 'loading', 'authorized', 'denied'
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (!storedUser) {
      router.push('/admin/login');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      
      if (user.is_superadmin) {
        setStatus('authorized');
        return;
      }

      if (superOnly) {
        setStatus('denied');
        return;
      }

      // Route access usually just requires 'view' permission (or edit, which implies view)
      const hasView = user.permissions?.includes(`${moduleId}_view`);
      const hasEdit = user.permissions?.includes(`${moduleId}_edit`);

      if (moduleId && (hasView || hasEdit)) {
        setStatus('authorized');
      } else {
        setStatus('denied');
      }
    } catch (e) {
      router.push('/admin/login');
    }
  }, [moduleId, superOnly, router]);

  if (status === 'loading') {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
        <div className="text-muted">Verifying permissions...</div>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="admin-page-content">
        <div className="card shadow-sm border-0 p-5 text-center">
          <div className="text-danger mb-3" style={{ fontSize: '48px' }}>⚠️</div>
          <h3>Access Denied</h3>
          <p className="text-muted">You do not have permission to access the {moduleId} module.</p>
          <button 
            className="btn btn-primary mt-3" 
            onClick={() => router.push('/admin')}
            style={{ maxWidth: '200px', margin: '0 auto' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default PermissionGuard;
