import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePaper } from "../../context/PaperContext";
import "../../App.css"; // Ensure styles are imported

const ObjectivePaper = () => {
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" }
  ]);
  const navigate = useNavigate();
  const { setPaperData } = usePaper();

  // Handle change in input fields
  const handleChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  // Handle option change
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  // Add a new question input
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: "" }
    ]);
  };

  // Remove a question input
  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setPaperData({ type: "objective", questions });
    navigate("/preview-paper");
  };

  return (
    <div className="paper-form-container">
      <form className="paper-form" onSubmit={handleSubmit}>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-field">
            <label>Question {qIndex + 1}:</label>
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleChange(qIndex, "question", e.target.value)}
              required
            />
            <label>Options:</label>
            {q.options.map((option, oIndex) => (
              <input
                key={oIndex}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                placeholder={`Option ${oIndex + 1}`}
                required
              />
            ))}
            <label>Correct Answer:</label>
            <input
              type="text"
              value={q.correctAnswer}
              onChange={(e) => handleChange(qIndex, "correctAnswer", e.target.value)}
              required
            />
            <button type="button" onClick={() => removeQuestion(qIndex)} className="remove-btn">❌</button>
          </div>
        ))}
        <button type="button" onClick={addQuestion} className="add-btn">➕ Add Question</button>
        <button type="submit" className="submit-btn">📄 Generate Paper</button>
      </form>
    </div>
  );
};

export default ObjectivePaper;
