import React, { useState } from 'react';
import axios from 'axios';
import { Activity, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/login' : '/api/signup';
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      if (res.data.userId) {
        if (isLogin) {
          onLogin({ userId: res.data.userId, username: res.data.username });
        } else {
          setSuccess('Account created! Please login.');
          setIsLogin(true);
          setFormData({ username: formData.username, password: '' });
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in">
        <div className="glass-panel">
          {/* Hero */}
          <div className="auth-hero">
            <div className="auth-logo pulse-glow">
              <Activity color="var(--cyan)" size={32} strokeWidth={2} />
            </div>
            <h1 style={{ fontSize: '1.9rem', marginBottom: '6px' }}>
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h1>
            <p className="auth-subtitle">
              {isLogin
                ? 'Sign in to your NeuroScan AI account'
                : 'Create your NeuroScan AI account'}
            </p>
          </div>

          <div className="divider" />

          {/* Alerts */}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '1rem' }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="alert alert-success" style={{ marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '1rem' }}>✅</span>
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  placeholder="Enter your username"
                  required
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '0.5rem', padding: '14px' }} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Processing...
                </span>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="divider" />

          {/* Toggle */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, textDecoration: 'underline', textDecorationColor: 'rgba(0,200,255,0.4)' }}
              onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          {/* Footer hint */}
          <div style={{ marginTop: '1.5rem', padding: '12px', background: 'rgba(0,200,255,0.04)', border: '1px solid rgba(0,200,255,0.1)', borderRadius: '10px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <Sparkles size={14} color="var(--cyan)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Powered by deep learning models for Brain MRI & Chest X-ray diagnosis
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
