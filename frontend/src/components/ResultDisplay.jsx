import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, ImageOff, Activity } from 'lucide-react';

const ResultDisplay = ({ previewUrl, result, loading, error }) => {
  const isPositive = result && (result.prediction.includes('Normal') || result.prediction.includes('No'));

  if (!previewUrl && !loading && !result && !error) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <ImageOff size={28} color="var(--text-muted)" />
        </div>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>No scan uploaded yet</p>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Upload a scan image and click Analyze</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

      {/* Preview Image */}
      {previewUrl && (
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--panel-border)', background: '#000', position: 'relative' }}>
          <img src={previewUrl} alt="Scan preview" style={{ width: '100%', maxHeight: '260px', objectFit: 'contain', display: 'block' }} />
          <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Preview
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ position: 'relative', width: '60px', height: '60px', margin: '0 auto 1.2rem' }}>
            <div className="spinner" />
            <Activity size={20} color="var(--cyan)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          </div>
          <p style={{ margin: 0, color: 'var(--cyan)', fontWeight: 500 }}>AI Model is analyzing the scan...</p>
          <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>This may take a few seconds</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-error">
          <AlertTriangle color="var(--red)" size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--red)', marginBottom: '2px' }}>Analysis Error</div>
            <div style={{ fontSize: '0.85rem' }}>{error}</div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="stat-card">
              <div className="stat-label">Model Used</div>
              <div style={{ marginTop: '2px' }}>
                <span className="result-badge badge-info">{result.model}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Confidence</div>
              <div className="stat-value">{result.confidence}%</div>
              <div className="confidence-bar-track">
                <div className="confidence-bar-fill" style={{ width: `${result.confidence}%` }} />
              </div>
            </div>
          </div>

          {/* Finding */}
          <div className="stat-card" style={{ padding: '0' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--panel-border)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
              AI Finding
            </div>
            <div className={`result-finding ${isPositive ? 'positive' : 'negative'}`} style={{ margin: '12px', borderRadius: '10px' }}>
              <div className={`result-icon ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive
                  ? <ShieldCheck size={24} color="var(--green)" />
                  : <ShieldAlert size={24} color="var(--red)" />
                }
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: isPositive ? 'var(--green)' : 'var(--red)' }}>
                  {result.prediction}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {isPositive ? 'No abnormalities detected' : 'Abnormality detected — consult a doctor'}
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '8px', fontSize: '0.76rem', color: 'rgba(245,158,11,0.8)', lineHeight: 1.5 }}>
            ⚠️ <strong>Disclaimer:</strong> This AI analysis is for educational purposes only. Always consult a qualified medical professional.
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
