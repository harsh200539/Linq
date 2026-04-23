"use client";

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../src/admin/AdminSidebar';
import AdminLogin from '../../src/admin/AdminLogin';
import { REMOTE_BASE_URL } from '../../src/lib/api';
import '../../src/admin/css/Admin.css';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) { }
    }

    const checkAuth = async () => {
      const isAuth = localStorage.getItem('adminAuth') === 'true';
      if (!isAuth) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const authTimestamp = localStorage.getItem('adminAuthTimestamp');
      const now = new Date().getTime();

      if (authTimestamp) {
        const timeElapsed = now - parseInt(authTimestamp, 10);
        if (timeElapsed > 7200000) {
          localStorage.removeItem('adminAuth');
          localStorage.removeItem('adminAuthTimestamp');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
      } else {
        localStorage.setItem('adminAuthTimestamp', now.toString());
      }

      // SILENT REFRESH: Sync local session with latest DB data
      if (storedUser) {
        try {
          const localUser = JSON.parse(storedUser);
          if (localUser.id) {
            // Use absolute URL to prevent any relative path confusion
            const url = `${REMOTE_BASE_URL}/admin-users/${localUser.id}/`;
            const data = await fetch(url).then(r => r.ok ? r.json() : null);
            if (data) {
              const latestUser = JSON.stringify(data);
              if (latestUser !== storedUser) {
                console.log("Permissions sync: Session updated from live backend.");
                localStorage.setItem('adminUser', latestUser);
                setUser(data);
              }
            }
          }
        } catch (e) {
          console.error("Silent refresh failed", e);
        }
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div className="admin-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'white' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={setIsAuthenticated} />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main-content">
        <header className="admin-header">
          <div className="d-flex align-items-center gap-3">
            <h3 className="mb-0">Management Console</h3>
            {/* <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{ background: '#ecfdf5', border: '1px solid #10b981' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }}></div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#047857' }}>LIVE CLOUD SYNC</span>
              <style>{`
                @keyframes pulse {
                  0% { transform: scale(0.95); opacity: 0.7; }
                  70% { transform: scale(1.1); opacity: 1; }
                  100% { transform: scale(0.95); opacity: 0.7; }
                }
              `}</style>
            </div> */}
          </div>
          <div className="admin-header-right d-flex align-items-center gap-3">
            <div className="admin-user-profile d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f3f3f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-primary)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase' }}>
                {user?.username?.substring(0, 2) || 'AD'}
              </div>
              <div className="d-none d-md-block" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#495057', lineHeight: 1.2 }}>{user?.username || 'Administrator'}</div>
                <div style={{ fontSize: '11px', color: '#878a99', marginTop: '2px' }}>{user?.is_superadmin ? 'Super Admin' : 'Admin Staff'}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-page-content">
          <div className="admin-breadcrumb d-flex align-items-center justify-content-between">
            <h4 className="mb-0" style={{ fontSize: '15px', fontWeight: 700, color: '#495057', textTransform: 'uppercase' }}>
              Dashboard
            </h4>
            <div style={{ fontSize: '13px', color: '#878a99' }}>
              LINQ <span style={{ margin: '0 5px' }}>/</span> Admin <span style={{ margin: '0 5px' }}>/</span> Dashboards
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
