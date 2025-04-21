import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePaper } from "../../context/PaperContext";
import "../../App.css"; // Ensure styles are imported

const BothPaper = () => {
  const [subjectiveQuestions, setSubjectiveQuestions] = useState([{ question: "", marks: "" }]);
  const [objectiveQuestions, setObjectiveQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);
  const navigate = useNavigate();
  const { setPaperData } = usePaper();

  // Subjective handlers
  const handleSubjectiveChange = (index, field, value) => {
    const updated = [...subjectiveQuestions];
    updated[index][field] = value;
    setSubjectiveQuestions(updated);
  };

  const addSubjective = () => {
    setSubjectiveQuestions([...subjectiveQuestions, { question: "", marks: "" }]);
  };

  const removeSubjective = (index) => {
    setSubjectiveQuestions(subjectiveQuestions.filter((_, i) => i !== index));
  };

  // Objective handlers
  const handleObjectiveChange = (index, field, value) => {
    const updated = [...objectiveQuestions];
    updated[index][field] = value;
    setObjectiveQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...objectiveQuestions];
    updated[qIndex].options[optIndex] = value;
    setObjectiveQuestions(updated);
  };

  const addObjective = () => {
    setObjectiveQuestions([
      ...objectiveQuestions,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const removeObjective = (index) => {
    setObjectiveQuestions(objectiveQuestions.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setPaperData({ 
      type: "both", 
      subjective: subjectiveQuestions,
      objective: objectiveQuestions 
    });
    navigate("/Preview-paper");
  };

  return (
    <div className="paper-form-container">
      <form className="paper-form" onSubmit={handleSubmit}>

        <h2>📝 Subjective Questions</h2>
        {subjectiveQuestions.map((q, index) => (
          <div key={index} className="question-field">
            <label>Question {index + 1}:</label>
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleSubjectiveChange(index, "question", e.target.value)}
              placeholder="Enter subjective question"
              required
            />
            <label>Marks:</label>
            <input
              type="number"
              value={q.marks}
              onChange={(e) => handleSubjectiveChange(index, "marks", e.target.value)}
              placeholder="Enter marks"
              required
            />
            <button type="button" onClick={() => removeSubjective(index)} className="remove-btn">❌</button>
          </div>
        ))}
        <button type="button" onClick={addSubjective} className="add-btn">➕ Add Subjective Question</button>

        <hr />

        <h2>✅ Objective Questions</h2>
        {objectiveQuestions.map((q, index) => (
          <div key={index} className="question-field">
            <label>Question {index + 1}:</label>
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleObjectiveChange(index, "question", e.target.value)}
              placeholder="Enter objective question"
              required
            />

            {q.options.map((opt, optIndex) => (
              <input
                key={optIndex}
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                placeholder={`Option ${optIndex + 1}`}
                required
              />
            ))}

            <label>Correct Answer:</label>
            <input
              type="text"
              value={q.correctAnswer}
              onChange={(e) => handleObjectiveChange(index, "correctAnswer", e.target.value)}
              placeholder="Correct option"
              required
            />

            <button type="button" onClick={() => removeObjective(index)} className="remove-btn">❌</button>
          </div>
        ))}
        <button type="button" onClick={addObjective} className="add-btn">➕ Add Objective Question</button>

        <button type="submit" className="submit-btn">📄 Generate Both Papers</button>
      </form>
    </div>
  );
};

export default BothPaper;
