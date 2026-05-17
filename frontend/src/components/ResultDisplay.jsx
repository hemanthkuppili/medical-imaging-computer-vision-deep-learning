import React from 'react';
import { ShieldAlert, ShieldCheck, Loader, AlertTriangle } from 'lucide-react';

const ResultDisplay = ({ previewUrl, result, loading, error }) => {
  if (!previewUrl && !loading && !result && !error) {
    return (
      <div className="flex justify-center items-center h-full" style={{ minHeight: '300px', color: 'var(--text-secondary)' }}>
        <p>Please upload an image and click analyze to see results.</p>
      </div>
    );
  }

  return (
    <div className="flex-col gap-4">
      {previewUrl && (
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--panel-border)', marginBottom: '2rem' }}>
          <img src={previewUrl} alt="Scan preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      )}

      {loading && (
        <div className="flex-col items-center justify-center py-8">
          <Loader size={48} color="var(--accent-color)" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <p className="mt-8">AI Model is analyzing the scan...</p>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {error && (
        <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger-color)', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <AlertTriangle color="var(--danger-color)" size={24} style={{ flexShrink: 0 }} />
          <div>
            <h3 style={{ color: 'var(--danger-color)', margin: '0 0 8px 0' }}>Analysis Error</h3>
            <p style={{ margin: 0, color: '#fca5a5' }}>{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="animate-fade-in" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
          <h3 style={{ borderBottom: '1px solid var(--panel-border)', paddingBottom: '12px', marginBottom: '16px' }}>Diagnostic Report</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem' }}>Model Used</p>
              <div className="result-badge" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-color)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                {result.model}
              </div>
            </div>
            
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem' }}>Confidence Level</p>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {result.confidence}%
              </div>
            </div>
          </div>

          <div>
             <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem' }}>AI Finding</p>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '8px', background: result.prediction.includes('Normal') || result.prediction.includes('No') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${result.prediction.includes('Normal') || result.prediction.includes('No') ? 'var(--success-color)' : 'var(--danger-color)'}` }}>
                {result.prediction.includes('Normal') || result.prediction.includes('No') ? 
                  <ShieldCheck color="var(--success-color)" size={32} /> : 
                  <ShieldAlert color="var(--danger-color)" size={32} />
                }
                <span style={{ fontSize: '1.25rem', fontWeight: 600, color: result.prediction.includes('Normal') || result.prediction.includes('No') ? 'var(--success-color)' : '#fca5a5' }}>
                  {result.prediction}
                </span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
