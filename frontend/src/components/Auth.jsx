import React, { useState } from 'react';
import axios from 'axios';
import { Activity } from 'lucide-react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/login' : '/api/signup';
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      
      if (res.data.userId) {
        if (isLogin) {
          onLogin({ userId: res.data.userId, username: res.data.username });
        } else {
          setIsLogin(true);
          setError('Signup successful! Please login.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center" style={{ minHeight: '80vh' }}>
      <div className="glass-panel w-full" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-8">
          <Activity color="var(--accent-color)" size={48} style={{ margin: '0 auto 1rem' }} />
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>Medical Imaging Diagnosis Platform</p>
        </div>

        {error && (
          <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', border: '1px solid var(--danger-color)', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              required 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-8" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="text-center mt-8">
          <button 
            className="btn btn-outline w-full" 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
