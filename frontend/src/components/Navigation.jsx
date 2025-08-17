// src/components/Navigation.jsx

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="rezi-navbar">
      <div className="rezi-navbar-container">
        <div className="rezi-navbar-brand">
          <Link to="/resumes" className="rezi-logo">
            <span className="rezi-logo-icon">📄</span>
            <span className="rezi-logo-text">ResumeBuilder</span>
          </Link>
        </div>
        <div className="rezi-navbar-menu">
          {/* Uncomment/expand links as needed */}
          {/* <Link to="/resumes" className={`rezi-nav-link ${isActive('/resumes') ? 'active' : ''}`}>My Resumes</Link> */}
          {/* <Link to="/templates" className={`rezi-nav-link ${isActive('/templates') ? 'active' : ''}`}>Templates</Link> */}
        </div>
        <div className="rezi-navbar-user">
          <div className="rezi-user-menu">
            {/* Avatar circle with initials */}
            <div className="rezi-user-avatar">
              {user?.name
                ? user.name
                    .split(' ')
                    .map((s) => s[0])
                    .join('')
                    .toUpperCase()
                : 'U'}
            </div>
            <span className="rezi-user-name">{user?.name || 'User'}</span>
            <button onClick={handleLogout} className="rezi-signout-btn">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
