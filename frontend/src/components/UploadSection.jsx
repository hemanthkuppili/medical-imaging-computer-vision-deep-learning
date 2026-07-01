import React, { useCallback, useState } from 'react';
import { UploadCloud, CheckCircle, Image } from 'lucide-react';

const UploadSection = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div
      className={`upload-area ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag} onDragLeave={handleDrag}
      onDragOver={handleDrag} onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload').click()}
    >
      <input id="file-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleChange} />

      <div className="upload-icon-wrap">
        {fileName
          ? <CheckCircle size={32} color="var(--green)" />
          : <UploadCloud size={32} color={dragActive ? 'var(--cyan)' : 'var(--text-muted)'} />
        }
      </div>

      {fileName ? (
        <>
          <h3 style={{ color: 'var(--green)', marginBottom: '6px' }}>File Ready</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(16,212,138,0.08)', border: '1px solid rgba(16,212,138,0.2)', borderRadius: '50px', maxWidth: '280px', margin: '0 auto' }}>
            <Image size={13} color="var(--green)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--green)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</span>
          </div>
          <p style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 0 }}>Click to change file</p>
        </>
      ) : (
        <>
          <h3 style={{ color: dragActive ? 'var(--cyan)' : 'var(--text-primary)', marginBottom: '6px' }}>
            {dragActive ? 'Drop it here!' : 'Drag & drop your scan'}
          </h3>
          <p style={{ marginBottom: '6px' }}>or <span style={{ color: 'var(--cyan)', fontWeight: 500 }}>click to browse</span></p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 0 }}>Supports JPG, PNG, JPEG</p>
        </>
      )}
    </div>
  );
};

export default UploadSection;
