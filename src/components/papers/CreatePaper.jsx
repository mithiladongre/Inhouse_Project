import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePaper } from "../../context/PaperContext";
import "../../App.css"; // Ensure styles are imported

const CreatePaper = () => {
  const [paperType, setPaperType] = useState("");
  const navigate = useNavigate(); // Hook for navigation
  const { setPaperData } = usePaper();

  const handleSelection = (type) => {
    setPaperType(type);
    setPaperData({ type }); // Set initial paper data
    if (type === "subjective") navigate("/subjective");
    else if (type === "objective") navigate("/objective");
    else if (type === "both") navigate("/both");
  };

  return (
    <div className="create-paper-container">
      <div className="create-paper-box">
        <h2>Select Paper Type</h2>
        <form>
          <div className="paper-type-option">
            <input
              type="radio"
              name="paperType"
              value="subjective"
              id="subjective"
              checked={paperType === "subjective"}
              onChange={() => handleSelection("subjective")}
            />
            <label htmlFor="subjective">
              <span className="icon">📝</span>
              <span className="title">Subjective</span>
              <span className="description">Create descriptive questions with detailed answers</span>
            </label>
          </div>

          <div className="paper-type-option">
            <input
              type="radio"
              name="paperType"
              value="objective"
              id="objective"
              checked={paperType === "objective"}
              onChange={() => handleSelection("objective")}
            />
            <label htmlFor="objective">
              <span className="icon">✍️</span>
              <span className="title">Objective</span>
              <span className="description">Generate multiple choice and short answer questions</span>
            </label>
          </div>

          <div className="paper-type-option">
            <input
              type="radio"
              name="paperType"
              value="both"
              id="both"
              checked={paperType === "both"}
              onChange={() => handleSelection("both")}
            />
            <label htmlFor="both">
              <span className="icon">📊</span>
              <span className="title">Both</span>
              <span className="description">Mix subjective and objective questions in one paper</span>
            </label>
          </div>
        </form>
        <p>Selected Paper Type: <strong>{paperType || "None"}</strong></p>
      </div>
    </div>
  );
};

export default CreatePaper;
