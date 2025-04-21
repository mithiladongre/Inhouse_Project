import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePaper } from "../../context/PaperContext";
import "../../App.css";

const SubjectivePaperForm = () => {
  const [questions, setQuestions] = useState([{ question: "", marks: "" }]);
  const navigate = useNavigate();
  const { setPaperData } = usePaper();

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addQuestion = () => setQuestions([...questions, { question: "", marks: "" }]);

  const removeQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPaperData({ type: "subjective", questions });
    navigate("/Preview-paper");
  };

  return (
    <div className="paper-form-container">
      <form className="paper-form" onSubmit={handleSubmit}>
        {questions.map((q, i) => (
          <div key={i} className="question-field">
            <label>Question {i + 1}:</label>
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleChange(i, "question", e.target.value)}
              required
            />
            <label>Marks:</label>
            <input
              type="number"
              value={q.marks}
              onChange={(e) => handleChange(i, "marks", e.target.value)}
              required
            />
            <button type="button" onClick={() => removeQuestion(i)} className="remove-btn">❌</button>
          </div>
        ))}
        <button type="button" onClick={addQuestion} className="add-btn">➕ Add Question</button>
        <button type="submit" className="submit-btn">📄 Generate Paper</button>
      </form>
    </div>
  );
};

export default SubjectivePaperForm;
