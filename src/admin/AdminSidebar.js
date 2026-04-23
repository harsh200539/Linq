"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  History, 
  Briefcase, 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  Users, 
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import logo from '../images/Logo/logo-light.webp';

const AdminSidebar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse adminUser", e);
      }
    }
  }, []);

  const isActive = (path) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname === path || pathname.startsWith(path + '/');
  };

  const allMenuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, id: 'dashboard' },
    { label: 'Content Management', isHeader: true },
    { label: 'Gallery', path: '/admin/gallery', icon: ImageIcon, id: 'gallery' },
    { label: 'Timeline', path: '/admin/timeline', icon: History, id: 'timeline' },
    { label: 'Jobs', path: '/admin/career', icon: Briefcase, id: 'jobs' },
    { label: 'Career Growth', path: '/admin/career-growth', icon: TrendingUp, id: 'growth' },
    { label: 'Vision', path: '/admin/vision', icon: Eye, id: 'vision' },
    { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare, id: 'testimonials' },
    { label: 'Team', path: '/admin/team', icon: Users, id: 'team' },
    { label: 'Administration', isHeader: true },
    { label: 'Users', path: '/admin/users', icon: ShieldCheck, id: 'users' },
  ];

  const menuItems = allMenuItems.filter((item, index) => {
    const isVisible = (subItem) => {
      if (!user) return subItem.id === 'dashboard';
      if (user.is_superadmin) return true;
      if (subItem.id === 'dashboard') return true;
      const hasView = user.permissions?.includes(`${subItem.id}_view`);
      const hasEdit = user.permissions?.includes(`${subItem.id}_edit`);
      return hasView || hasEdit;
    };

    if (!item.isHeader) {
      return isVisible(item);
    }
    
    // Header check
    if (item.superOnly && !user?.is_superadmin) return false;
    
    // Check if there are any visible items following this header until the next header
    const nextItems = allMenuItems.slice(index + 1);
    const nextHeaderIndex = nextItems.findIndex(i => i.isHeader);
    const sectionItems = nextHeaderIndex === -1 ? nextItems : nextItems.slice(0, nextHeaderIndex);
    
    return sectionItems.some(subItem => isVisible(subItem));
  });

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <Link href="/admin">
          <img src={logo.src || logo} alt="LINQ" />
        </Link>
      </div>

      <div className="admin-sidebar-menu mt-3">
        {menuItems.map((item, idx) => (
          item.isHeader ? (
            <div key={idx} style={{ 
              padding: '24px 24px 10px', 
              fontSize: '11px', 
              color: 'rgba(255,255,255,0.4)', 
              textTransform: 'uppercase',
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}>
              {item.label}
            </div>
          ) : (
            <Link 
              key={idx} 
              href={item.path} 
              className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {isActive(item.path) && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
            </Link>
          )
        ))}
      </div>

      <div style={{ marginTop: 'auto', padding: '24px' }}>
        <button
          onClick={() => { localStorage.removeItem('adminAuth'); window.location.reload(); }}
          className="admin-login-btn d-flex align-items-center justify-content-center gap-2"
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            color: 'white', 
            width: '100%', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
