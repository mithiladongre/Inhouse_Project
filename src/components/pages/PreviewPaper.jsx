import React, { useEffect } from "react";
import { usePaper } from "../../context/PaperContext";
import { useNavigate, useLocation } from "react-router-dom";

const PreviewPaper = () => {
  const { paperData, setPaperData, settings } = usePaper();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If paper data is passed through navigation state, use it
    if (location.state?.paper) {
      setPaperData(location.state.paper);
    }
  }, [location.state, setPaperData]);

  if (!paperData) {
    return <div className="paper-form-container">No paper data available.</div>;
  }

  const handleBack = () => {
    if (paperData.type === "subjective") navigate("/subjective");
    else if (paperData.type === "objective") navigate("/objective");
    else if (paperData.type === "both") navigate("/both");
  };

  const handleSave = () => {
    // Get existing saved papers from localStorage
    const savedPapers = JSON.parse(localStorage.getItem('savedPapers') || '[]');
    
    // Add current paper with timestamp
    const paperToSave = {
      ...paperData,
      savedAt: new Date().toISOString(),
      id: Date.now() // Unique ID for each saved paper
    };
    
    // Save to localStorage
    localStorage.setItem('savedPapers', JSON.stringify([...savedPapers, paperToSave]));
    
    // Show success message
    alert('Paper saved successfully!');
  };

  const handleDownload = async () => {
    try {
      // If the paper is not yet saved, save it first
      if (!paperData.id) {
        const savedPapers = JSON.parse(localStorage.getItem('savedPapers') || '[]');
        const paperToSave = {
          ...paperData,
          savedAt: new Date().toISOString(),
          id: Date.now()
        };
        localStorage.setItem('savedPapers', JSON.stringify([...savedPapers, paperToSave]));
        paperData.id = paperToSave.id;
      }

      const response = await fetch(`/api/papers/${paperData.id}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download paper');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${paperData.type}_paper_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading paper:', error);
      alert('Failed to download paper. Please try again.');
    }
  };

  return (
    <div className="paper-form-container">
      <div className="preview-header">
        <h2>Preview Paper</h2>
        <div className="preview-actions">
          <button onClick={handleBack} className="back-btn">← Back to Edit</button>
          <button onClick={handleSave} className="save-btn">💾 Save Paper</button>
          <button onClick={handleDownload} className="download-btn">📥 Download PDF</button>
        </div>
      </div>

      {paperData.type === "subjective" && (
        <div className="preview-section">
          <h3>Subjective Questions</h3>
          {paperData.questions.map((q, index) => (
            <div key={index} className="preview-question">
              <h4>Q{index + 1}. {q.question} {settings.showMarks && `(${q.marks} marks)`}</h4>
            </div>
          ))}
        </div>
      )}

      {paperData.type === "objective" && (
        <div className="preview-section">
          <h3>Objective Questions</h3>
          {paperData.questions.map((q, index) => (
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

      {paperData.type === "both" && (
        <div className="preview-section">
          <h3>Subjective Questions</h3>
          {paperData.subjective.map((q, index) => (
            <div key={index} className="preview-question">
              <h4>Q{index + 1}. {q.question} {settings.showMarks && `(${q.marks} marks)`}</h4>
            </div>
          ))}
          <h3>Objective Questions</h3>
          {paperData.objective.map((q, index) => (
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
    </div>
  );
};

export default PreviewPaper;
