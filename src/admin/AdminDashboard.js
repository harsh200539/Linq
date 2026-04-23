"use client";
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Image as ImageIcon, History, Eye, ArrowUpRight } from 'lucide-react';
import { useGlobalData } from '../context/GlobalDataContext';

const AdminDashboard = () => {
  const { gallery, timeline, team, jobs, vision } = useGlobalData();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }
  }, []);

  const stats = {
    gallery: gallery?.length || 0,
    timeline: timeline?.length || 0,
    team: team?.length || 0,
    jobs: jobs?.length || 0,
    vision: vision ? 'Active' : 'Inactive'
  };

  const canView = (modId) => {
    if (!user) return false;
    if (user.is_superadmin) return true;
    return user.permissions?.includes(`${modId}_view`) || user.permissions?.includes(`${modId}_edit`);
  };

  const hasEditPermission = (modId) => {
    if (!user) return false;
    if (user.is_superadmin) return true;
    return user.permissions?.includes(`${modId}_edit`);
  };

  const statCards = [
    { id: 'gallery', title: 'Gallery Images', value: stats.gallery, icon: ImageIcon, color: '#405189', trend: 'Live' },
    { id: 'timeline', title: 'Timeline Events', value: stats.timeline, icon: History, color: '#0ab39c', trend: 'Updated' },
    { id: 'vision', title: 'Vision Strategy', value: stats.vision, icon: Eye, color: '#f7b84b', trend: 'Live' },
    { id: 'team', title: 'Team Members', value: stats.team, icon: Users, color: '#299cdb', trend: 'Live' },
  ].filter(card => canView(card.id));

  return (
    <div className="container-fluid p-0">
      <div className="row mb-4">
        <div className="col-12">
          <div className="admin-card p-4" style={{ 
            background: 'linear-gradient(to right, #405189, #0ab39c)', 
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 className="fw-bold mb-2">Welcome Back, {user?.username || 'Administrator'}!</h2>
              <p className="mb-0 opacity-75">
                {user?.is_superadmin 
                  ? "You have full control over the LINQ website content." 
                  : "Welcome to your personalized workspace. Access control is active based on your assigned roles."}
              </p>
            </div>
            <div style={{ 
              position: 'absolute', 
              right: '-20px', 
              bottom: '-20px', 
              opacity: 0.1, 
              transform: 'rotate(-15deg)' 
            }}>
              <LayoutDashboard size={200} />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {statCards.map((card, idx) => (
          <div key={idx} className="col-xl-3 col-md-6 mb-4">
            <div className="admin-card h-100 m-0">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div style={{ 
                    width: '45px', 
                    height: '45px', 
                    borderRadius: '8px', 
                    background: `${card.color}15`, 
                    color: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <card.icon size={22} />
                  </div>
                  <div className="text-success d-flex align-items-center gap-1" style={{ fontSize: '13px', fontWeight: 600 }}>
                    {card.trend} <ArrowUpRight size={14} />
                  </div>
                </div>
                <div>
                  <p className="text-muted mb-2 text-uppercase fw-bold" style={{ fontSize: '12px', letterSpacing: '0.5px' }}>{card.title}</p>
                  <h3 className="mb-0 fw-bold" style={{ color: '#495057' }}>{card.value}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="admin-card p-4">
            <h5 className="mb-4 fw-bold" style={{ color: '#495057' }}>Quick Actions</h5>
            <div className="d-flex flex-wrap gap-2">
               {hasEditPermission('gallery') && <button className="btn btn-primary" style={{ background: '#405189', border: 'none', padding: '10px 20px' }}>Upload Gallery Image</button>}
               {hasEditPermission('jobs') && <button className="btn btn-success" style={{ background: '#0ab39c', border: 'none', padding: '10px 20px' }}>New Job Posting</button>}
               {hasEditPermission('vision') && <button className="btn btn-warning" style={{ background: '#f7b84b', border: 'none', padding: '10px 20px', color: 'white' }}>Update Vision</button>}
               {hasEditPermission('team') && <button className="btn btn-info" style={{ background: '#299cdb', border: 'none', padding: '10px 20px', color: 'white' }}>Manage Team</button>}
               {!user?.is_superadmin && <p className="text-muted font-italic" style={{ fontSize: '14px' }}>* Some actions are restricted based on your permissions.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
