import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, LogOut, LayoutDashboard, Clock } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  if (!user) return null;

  const initials = user.username?.slice(0, 2).toUpperCase() || 'U';

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="logo-icon">
          <Activity color="#fff" size={20} strokeWidth={2.5} />
        </div>
        <span className="logo-text">NeuroScan AI</span>
      </div>

      <div className="navbar-links">
        <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <LayoutDashboard size={16} />
          Dashboard
        </Link>
        <Link to="/history" className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}>
          <Clock size={16} />
          History
        </Link>
      </div>

      <div className="navbar-user">
        <div className="user-chip">
          <div className="user-avatar">{initials}</div>
          {user.username}
        </div>
        <button onClick={onLogout} className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: '0.83rem' }}>
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
