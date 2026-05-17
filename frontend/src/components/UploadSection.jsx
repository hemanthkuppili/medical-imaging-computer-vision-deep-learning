import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';

const UploadSection = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`upload-area ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload').click()}
    >
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <UploadCloud size={48} color={dragActive ? 'var(--accent-color)' : 'var(--text-secondary)'} style={{ margin: '0 auto 1rem' }} />
      <h3 style={{ color: dragActive ? 'var(--accent-color)' : 'var(--text-primary)' }}>
        Drag and drop your scan here
      </h3>
      <p>or click to browse files</p>
      <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>Supports JPG, PNG, JPEG</p>
    </div>
  );
};

export default UploadSection;
