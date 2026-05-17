import React, { useState } from 'react';
import axios from 'axios';
import UploadSection from './UploadSection';
import ResultDisplay from './ResultDisplay';

const Dashboard = ({ user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [modelType, setModelType] = useState('brain'); // 'brain' or 'chest'
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setResult(null);

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
      setError(err.response?.data?.error || 'Analysis failed. Please make sure the AI service is running and models are trained.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="flex-col gap-4">
        <div className="glass-panel">
          <h2>Diagnosis Configuration</h2>
          <div className="form-group mt-8">
            <label className="form-label">Select Medical Scan Type</label>
            <select 
              className="form-select" 
              value={modelType} 
              onChange={(e) => setModelType(e.target.value)}
            >
              <option value="brain">Brain MRI (Tumor Detection)</option>
              <option value="chest">Chest X-ray (Pneumonia Detection)</option>
            </select>
          </div>
        </div>

        <div className="glass-panel py-8">
          <h2>Upload Image</h2>
          <UploadSection onFileSelect={handleFileSelect} />
          
          <button 
            className="btn btn-primary w-full" 
            style={{ marginTop: '1.5rem' }}
            disabled={!selectedFile || loading}
            onClick={handleAnalyze}
          >
            {loading ? 'Analyzing Scan...' : 'Analyze Scan'}
          </button>
        </div>
      </div>

      <div className="glass-panel">
        <h2>Analysis Result</h2>
        <ResultDisplay 
          previewUrl={previewUrl} 
          result={result} 
          loading={loading} 
          error={error} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
