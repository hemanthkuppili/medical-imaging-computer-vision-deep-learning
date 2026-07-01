import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, ShieldCheck, ShieldAlert, Brain, Activity, Calendar } from 'lucide-react';

const HistoryDashboard = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/history/${user.userId}`);
        setHistory(res.data);
      } catch (err) {
        console.error('Error fetching history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user.userId]);

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '1.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <Clock size={18} color="var(--cyan)" />
          <span style={{ fontSize: '0.82rem', color: 'var(--cyan)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Records</span>
        </div>
        <h2 style={{ fontSize: '1.7rem', fontFamily: 'Space Grotesk', margin: 0, color: 'var(--text-primary)' }}>
          Diagnosis History
        </h2>
        <p style={{ marginTop: '4px', marginBottom: 0 }}>Past AI scan analyses for your account</p>
      </div>

      <div className="glass-panel">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ position: 'relative', width: '52px', height: '52px', margin: '0 auto 1rem' }}>
              <div className="spinner" />
              <Activity size={18} color="var(--cyan)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state" style={{ minHeight: '300px' }}>
            <div className="empty-state-icon">
              <Clock size={28} color="var(--text-muted)" />
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>No history found</p>
            <p style={{ margin: 0, fontSize: '0.83rem', color: 'var(--text-muted)' }}>Run an analysis from the Dashboard to see records here</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            {/* Summary Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
              <div className="stat-card">
                <div className="stat-label">Total Scans</div>
                <div className="stat-value">{history.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Normal Results</div>
                <div className="stat-value" style={{ color: 'var(--green)' }}>
                  {history.filter(r => r.prediction.includes('Normal') || r.prediction.includes('No')).length}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Abnormal Results</div>
                <div className="stat-value" style={{ color: 'var(--red)' }}>
                  {history.filter(r => !r.prediction.includes('Normal') && !r.prediction.includes('No')).length}
                </div>
              </div>
            </div>

            <div className="divider" />

            <table className="history-table">
              <thead>
                <tr>
                  <th><Calendar size={13} style={{ verticalAlign: 'middle', marginRight: '6px' }} />Date & Time</th>
                  <th>Scan Type</th>
                  <th>AI Finding</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, idx) => {
                  const isPositive = record.prediction.includes('Normal') || record.prediction.includes('No');
                  return (
                    <tr key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <div>{new Date(record.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{new Date(record.date).toLocaleTimeString()}</div>
                      </td>
                      <td>
                        <span className="result-badge badge-info">
                          {record.modelType.includes('Brain') ? '🧠' : '🫁'} {record.modelType}
                        </span>
                      </td>
                      <td>
                        <span className={`result-badge ${isPositive ? 'badge-success' : 'badge-danger'}`}>
                          {isPositive ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                          {record.prediction}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px', overflow: 'hidden', minWidth: '60px' }}>
                            <div style={{ height: '100%', width: `${record.confidence}%`, background: isPositive ? 'var(--green)' : 'var(--red)', borderRadius: '3px' }} />
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', minWidth: '42px' }}>{record.confidence}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryDashboard;
