import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SavedPapers = () => {
  const [savedPapers, setSavedPapers] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const papers = JSON.parse(localStorage.getItem('savedPapers') || '[]');
    setSavedPapers(papers);
  }, []);

  const handleDelete = (id) => {
    const updatedPapers = savedPapers.filter(paper => paper.id !== id);
    localStorage.setItem('savedPapers', JSON.stringify(updatedPapers));
    setSavedPapers(updatedPapers);
  };

  const handleView = (paper) => {
    navigate('/Preview-paper', { state: { paper } });
  };

  const handlePreview = async (paper) => {
    try {
      // Create a new window for the preview
      const previewWindow = window.open('', '_blank');
      
      // Set up the preview window with proper HTML structure
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>PDF Preview</title>
            <style>
              body, html {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
              }
              #loading {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-family: Arial, sans-serif;
                font-size: 16px;
                color: #333;
              }
              #pdfViewer {
                width: 100%;
                height: 100vh;
                display: none;
              }
            </style>
          </head>
          <body>
            <div id="loading">Loading PDF preview...</div>
            <embed id="pdfViewer" type="application/pdf" width="100%" height="100%">
          </body>
        </html>
      `);
      
      // Fetch the PDF
      const response = await fetch(`/api/papers/${paper.id}/preview`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch PDF preview');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Update the embed element with the PDF URL
      const pdfViewer = previewWindow.document.getElementById('pdfViewer');
      pdfViewer.src = url;
      pdfViewer.style.display = 'block';
      
      // Hide loading message
      const loading = previewWindow.document.getElementById('loading');
      loading.style.display = 'none';
      
      // Clean up the URL when the window is closed
      previewWindow.onbeforeunload = () => {
        window.URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error('Error previewing paper:', error);
      alert('Failed to preview paper. Please try again.');
    }
  };

  const handleDownload = async (paper) => {
    try {
      const response = await fetch(`/api/papers/${paper.id}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download paper');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const a = document.createElement('a');
      a.href = url;
      a.download = `${paper.type}_paper_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Append to body, click, and remove
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading paper:', error);
      alert('Failed to download paper. Please try again.');
    }
  };

  return (
    <div className="paper-form-container">
      <h2>Saved Papers</h2>
      {savedPapers.length === 0 ? (
        <div className="no-papers">No saved papers found.</div>
      ) : (
        <div className="saved-papers-list">
          {savedPapers.map((paper) => (
            <div key={paper.id} className="saved-paper-card">
              <div className="paper-info">
                <h3>{paper.type === 'both' ? 'Mixed Paper' : `${paper.type.charAt(0).toUpperCase() + paper.type.slice(1)} Paper`}</h3>
                <p>Saved on: {new Date(paper.savedAt).toLocaleString()}</p>
                <p>Total Questions: {
                  paper.type === 'both' 
                    ? paper.subjective.length + paper.objective.length 
                    : paper.questions.length
                }</p>
              </div>
              <div className="paper-actions">
                <button onClick={() => handleView(paper)} className="view-btn">👁️ View</button>
                <button onClick={() => handlePreview(paper)} className="preview-btn">🔍 Preview PDF</button>
                <button onClick={() => handleDownload(paper)} className="download-btn">📥 Download</button>
                <button onClick={() => handleDelete(paper.id)} className="delete-btn">🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPapers;
