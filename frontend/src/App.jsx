import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import HistoryDashboard from './components/HistoryDashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="container animate-fade-in">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />} />
            <Route path="/auth" element={!user ? <Auth onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/auth" />} />
            <Route path="/history" element={user ? <HistoryDashboard user={user} /> : <Navigate to="/auth" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
