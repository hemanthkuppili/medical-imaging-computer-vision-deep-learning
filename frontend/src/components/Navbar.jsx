import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, LogOut, User, Clock, Home } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  if (!user) return null;

  return (
    <nav style={{ padding: '1rem 2rem', background: 'var(--panel-bg)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Activity color="var(--accent-color)" size={28} />
        <h2 style={{ margin: 0, fontSize: '1.5rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NeuroScan AI</h2>
      </div>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ color: location.pathname === '/dashboard' ? 'var(--accent-color)' : 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, transition: 'color 0.3s' }}>
          <Home size={18} /> Dashboard
        </Link>
        <Link to="/history" style={{ color: location.pathname === '/history' ? 'var(--accent-color)' : 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, transition: 'color 0.3s' }}>
          <Clock size={18} /> History
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <User size={18} /> {user.username}
        </div>
        <button onClick={onLogout} className="btn btn-outline" style={{ padding: '8px 12px' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
