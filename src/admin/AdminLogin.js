"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './css/Admin.css';
import logo from "../images/Logo/logo-light.webp";
import { loginAdmin } from '../lib/api';
import { User, Lock, LogIn, Loader2, CheckCircle2, XCircle } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await loginAdmin(username, password);
      
      if (res && res.status === 'success') {
        const userData = res.user;
        localStorage.setItem('adminUser', JSON.stringify(userData));
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminAuthTimestamp', new Date().getTime().toString());
        
        onLogin(true);
        router.push('/admin');
      } else {
        showToast(res?.error || 'Invalid credentials', 'error');
      }
    } catch (err) {
      console.error('Login error:', err);
      showToast('Connection error to backend', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      {/* Premium Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          padding: '16px 24px',
          borderRadius: '12px',
          backgroundColor: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: 'white',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          zIndex: 10000,
          animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontWeight: '600',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {toast.type === 'error' ? <XCircle size={20} /> : <CheckCircle2 size={20} />} 
          <span>{toast.message}</span>
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%) scale(0.9); opacity: 0; }
              to { transform: translateX(0) scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      <div className="admin-login-card">
        <div className="mb-4">
          <img src={logo.src || logo} alt="LINQ" className="admin-login-logo" />
        </div>
        
        <h4 className="mb-2">Welcome Back</h4>
        <p>Enter your credentials to access the management console.</p>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#94a3b8' 
              }} />
              <input
                type="text"
                placeholder="Admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#94a3b8' 
              }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="admin-login-btn d-flex align-items-center justify-content-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="spinner-border-sm animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
          
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </form>

        <div style={{ 
          marginTop: '32px', 
          fontSize: '12px', 
          color: '#94a3b8',
          borderTop: '1px solid #f1f5f9',
          paddingTop: '20px',
          fontWeight: '500'
        }}>
          &copy; {new Date().getFullYear()} LINQ Corporate. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
