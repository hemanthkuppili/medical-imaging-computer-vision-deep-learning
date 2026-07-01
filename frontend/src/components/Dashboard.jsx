import React, { useState } from 'react';
import axios from 'axios';
import UploadSection from './UploadSection';
import ResultDisplay from './ResultDisplay';
import { Brain, Scan, Zap } from 'lucide-react';

const SCAN_TYPES = [
  {
    id: 'brain',
    icon: '🧠',
    name: 'Brain MRI',
    desc: 'Tumor Detection',
  },
  {
    id: 'chest',
    icon: '🫁',
    name: 'Chest X-ray',
    desc: 'Pneumonia Detection',
  },
];

const Dashboard = ({ user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [modelType, setModelType] = useState('brain');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null); setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true); setError(null); setResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('userId', user.userId);
    formData.append('modelType', modelType);

    try {
      const res = await axios.post('http://localhost:5000/api/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please make sure the AI service is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '1.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <Zap size={18} color="var(--cyan)" />
          <span style={{ fontSize: '0.82rem', color: 'var(--cyan)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI Diagnosis</span>
        </div>
        <h2 style={{ fontSize: '1.7rem', fontFamily: 'Space Grotesk', margin: 0, color: 'var(--text-primary)' }}>
          Medical Scan Analysis
        </h2>
        <p style={{ marginTop: '4px', marginBottom: 0 }}>Upload a scan and let AI detect abnormalities in seconds</p>
      </div>

      <div className="grid grid-cols-2" style={{ alignItems: 'start' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

          {/* Scan Type Selector */}
          <div className="glass-panel">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Scan size={18} color="var(--cyan)" />
              Select Scan Type
            </h2>
            <div className="scan-type-grid">
              {SCAN_TYPES.map(type => (
                <div
                  key={type.id}
                  className={`scan-type-card ${modelType === type.id ? 'selected' : ''}`}
                  onClick={() => setModelType(type.id)}
                >
                  <div className="scan-icon">{type.icon}</div>
                  <div className="scan-name">{type.name}</div>
                  <div className="scan-desc">{type.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload */}
          <div className="glass-panel">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Brain size={18} color="var(--cyan)" />
              Upload Image
            </h2>
            <UploadSection onFileSelect={handleFileSelect} />

            <button
              className="btn btn-primary w-full"
              style={{ marginTop: '1.2rem', padding: '14px', fontSize: '1rem' }}
              disabled={!selectedFile || loading}
              onClick={handleAnalyze}
            >
              {loading ? (
                <>
                  <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Analyzing Scan...
                </>
              ) : (
                <>
                  <Zap size={17} />
                  Analyze Scan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column — Results */}
        <div className="glass-panel" style={{ minHeight: '480px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.2rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: result ? 'var(--green)' : loading ? 'var(--cyan)' : 'var(--text-muted)', display: 'inline-block', boxShadow: result ? '0 0 8px var(--green)' : loading ? '0 0 8px var(--cyan)' : 'none' }} />
            Analysis Result
          </h2>
          <ResultDisplay previewUrl={previewUrl} result={result} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
