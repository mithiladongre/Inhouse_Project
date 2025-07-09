import React, { useEffect } from "react";
import { usePaper } from "../../context/PaperContext";
import { useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import "../../App.css";

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
      // Create a new jsPDF instance with better default settings
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      // Add institute header
      doc.setFontSize(16);
      doc.text('PUNE INSTITUTE OF COMPUTER TECHNOLOGY, PUNE - 411043', 105, 20, { align: 'center' });
      doc.setFontSize(14);
      doc.text('Department of Electronics & Telecommunication Engineering', 105, 30, { align: 'center' });
      
      // Add roll number box
      doc.rect(150, 40, 40, 20);
      doc.setFontSize(12);
      doc.text('Roll No.', 155, 45);
      if (settings?.paperDetails?.rollNoPrefix) {
        doc.text(settings.paperDetails.rollNoPrefix, 160, 55);
      }

      // Add paper details
      doc.setFontSize(14);
      doc.text(`Class: TE (${settings?.defaultBranch?.toUpperCase() || ''})`, 20, 70);
      doc.text(`UNIT TEST - II`, 105, 70, { align: 'center' });
      
      // Add subject and other details
      doc.text(`Subject: ${settings?.paperDetails?.subject || ''}`, 20, 85);
      
      // Format and add date
      let formattedDate = '';
      if (settings?.paperDetails?.date) {
        try {
          formattedDate = new Date(settings.paperDetails.date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).split('/').join('-');
        } catch (error) {
          console.error('Date formatting error:', error);
        }
      }
      
      doc.text(`Date: ${formattedDate}`, 20, 95);
      doc.text(`Day: ${settings?.paperDetails?.day || ''}`, 90, 95);
      doc.text(`Time: ${settings?.paperDetails?.time || ''}`, 20, 105);
      doc.text(`Max. Marks: ${settings?.paperDetails?.totalMarks || ''}`, 90, 105);

      // Add instructions
      doc.setFontSize(12);
      doc.text('Instructions:', 20, 115);
      doc.text('1. All questions are compulsory.', 20, 122);
      doc.text('2. Neat diagrams must be drawn wherever necessary.', 20, 129);
      doc.text('3. Figures to the right indicate full marks.', 20, 136);
      doc.text('4. Assume suitable data if necessary.', 20, 143);

      let yPosition = 155;

      // Add Course Outcomes table
      if (settings?.paperDetails?.courseOutcomes?.length > 0) {
        doc.setFontSize(12);
        
        // Draw table header
        doc.rect(20, yPosition, 30, 10); // COs column
        doc.rect(50, yPosition, 140, 10); // Course Outcomes column
        doc.text('COs', 35, yPosition + 7, { align: 'center' });
        doc.text('Course Outcomes', 120, yPosition + 7, { align: 'center' });
        
        // Draw table rows
        settings.paperDetails.courseOutcomes.forEach((co, index) => {
          if (co.text.trim()) { // Only add if there's content
            yPosition += 10;
            const lines = doc.splitTextToSize(co.text, 130); // Split text into lines if too long
            const rowHeight = Math.max(lines.length * 7, 10); // Calculate required height
            
            // Draw row cells
            doc.rect(20, yPosition, 30, rowHeight);
            doc.rect(50, yPosition, 140, rowHeight);
            
            // Add content
            doc.text(`CO${index + 1}`, 35, yPosition + 7, { align: 'center' });
            doc.text(lines, 55, yPosition + 7);
            
            yPosition += rowHeight;
          }
        });
        yPosition += 20; // Add space after the table
      }

      // Add questions based on paper type
      if (paperData.type === 'subjective' || paperData.type === 'both') {
        const questions = paperData.type === 'both' ? paperData.subjective : paperData.questions;
        if (questions && questions.length > 0) {
          // Check if we need a new page
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(14);
          doc.text('Subjective Questions:', 20, yPosition);
          yPosition += 10;

          questions.forEach((q, index) => {
            // Check if we need a new page
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }

            doc.setFontSize(12);
            const questionText = `Q${index + 1}. ${q.question} ${q.marks ? `[${q.marks} Marks]` : ''}`;
            const lines = doc.splitTextToSize(questionText, 170);
            doc.text(lines, 20, yPosition);
            yPosition += (lines.length * 7) + 10;
          });
        }
      }

      if (paperData.type === 'objective' || paperData.type === 'both') {
        const questions = paperData.type === 'both' ? paperData.objective : paperData.questions;
        if (questions && questions.length > 0) {
          // Add page break if needed
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }

          if (paperData.type === 'both') {
            yPosition += 10;
          }
          
          doc.setFontSize(14);
          doc.text('Objective Questions:', 20, yPosition);
          yPosition += 10;

          questions.forEach((q, index) => {
            // Check if we need a new page
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }

            doc.setFontSize(12);
            const questionText = `Q${index + 1}. ${q.question}`;
            const lines = doc.splitTextToSize(questionText, 170);
            doc.text(lines, 20, yPosition);
            yPosition += (lines.length * 7) + 5;

            // Add options
            if (q.options && q.options.length > 0) {
              q.options.forEach((option, optIndex) => {
                if (yPosition > 280) {
                  doc.addPage();
                  yPosition = 20;
                }
                const optionText = `${String.fromCharCode(97 + optIndex)}. ${option}`;
                const optionLines = doc.splitTextToSize(optionText, 160);
                doc.text(optionLines, 30, yPosition);
                yPosition += (optionLines.length * 7) + 3;
              });
              yPosition += 5;
            }
          });
        }
      }

      // Add page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      }

      // Save the PDF with a formatted name
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `question_paper_${timestamp}.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate PDF. Please try again. Error: ' + error.message);
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
