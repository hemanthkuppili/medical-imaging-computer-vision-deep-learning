import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock } from 'lucide-react';

const HistoryDashboard = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/history/${user.userId}`);
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user.userId]);

  if (loading) {
    return <div className="text-center py-8">Loading history...</div>;
  }

  return (
    <div className="glass-panel" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
        <Clock color="var(--accent-color)" size={32} />
        <h2 style={{ margin: 0 }}>Diagnosis History</h2>
      </div>

      {history.length === 0 ? (
        <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
          No diagnosis history found. Analyze scans from the dashboard to see them here.
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="history-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Scan Type</th>
                <th>AI Finding</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record, idx) => (
                <tr key={idx}>
                  <td>
                    {new Date(record.date).toLocaleDateString()} at {new Date(record.date).toLocaleTimeString()}
                  </td>
                  <td>
                    <span className="result-badge" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-color)' }}>
                      {record.modelType}
                    </span>
                  </td>
                  <td>
                    <span className={`result-badge ${record.prediction.includes('Normal') || record.prediction.includes('No') ? 'badge-success' : 'badge-danger'}`}>
                      {record.prediction}
                    </span>
                  </td>
                  <td>{record.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryDashboard;
