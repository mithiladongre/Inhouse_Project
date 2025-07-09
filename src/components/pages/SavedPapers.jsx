import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaper } from '../../context/PaperContext';
import '../../App.css';

const SavedPapers = () => {
  const [savedPapers, setSavedPapers] = useState([]);
  const [previewPaper, setPreviewPaper] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const navigate = useNavigate();
  const { setPaperData } = usePaper();

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
    setPaperData(paper);
    navigate('/preview-paper');
  };

  const handlePreview = (paper) => {
    setPreviewPaper(paper);
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewPaper(null);
  };

  const renderPreviewContent = () => {
    if (!previewPaper) return null;

    return (
      <div className="preview-modal-content">
        <div className="preview-header">
          <h2>Paper Preview</h2>
          <button onClick={closePreviewModal} className="close-btn">✕</button>
        </div>
        
        <div className="preview-section">
          <h3>{previewPaper.type === 'both' ? 'Mixed Paper' : `${previewPaper.type.charAt(0).toUpperCase() + previewPaper.type.slice(1)} Paper`}</h3>
          
          {previewPaper.type === "subjective" && (
            <div>
              <h4>Subjective Questions</h4>
              {previewPaper.questions.map((q, index) => (
                <div key={index} className="preview-question">
                  <h4>Q{index + 1}. {q.question} {q.marks && `(${q.marks} marks)`}</h4>
                </div>
              ))}
            </div>
          )}

          {previewPaper.type === "objective" && (
            <div>
              <h4>Objective Questions</h4>
              {previewPaper.questions.map((q, index) => (
                <div key={index} className="preview-question">
                  <h4>Q{index + 1}. {q.question}</h4>
                  <ul className="options-list">
                    {q.options.map((opt, i) => (
                      <li key={i}>{`Option ${i + 1}: ${opt}`}</li>
                    ))}
                  </ul>
                  <p className="correct-answer"><strong>Correct Answer:</strong> {q.correctAnswer}</p>
                </div>
              ))}
            </div>
          )}

          {previewPaper.type === "both" && (
            <>
              <div>
                <h4>Subjective Questions</h4>
                {previewPaper.subjective.map((q, index) => (
                  <div key={index} className="preview-question">
                    <h4>Q{index + 1}. {q.question} {q.marks && `(${q.marks} marks)`}</h4>
                  </div>
                ))}
              </div>
              
              <div>
                <h4>Objective Questions</h4>
                {previewPaper.objective.map((q, index) => (
                  <div key={index} className="preview-question">
                    <h4>Q{index + 1}. {q.question}</h4>
                    <ul className="options-list">
                      {q.options.map((opt, i) => (
                        <li key={i}>{`Option ${i + 1}: ${opt}`}</li>
                      ))}
                    </ul>
                    <p className="correct-answer"><strong>Correct Answer:</strong> {q.correctAnswer}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
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
                <button onClick={() => handlePreview(paper)} className="preview-btn">🔍 Preview</button>
                <button onClick={() => handleDelete(paper.id)} className="delete-btn">🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isPreviewModalOpen && (
        <div className="preview-modal-overlay">
          <div className="preview-modal">
            {renderPreviewContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPapers;
