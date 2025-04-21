import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css"; // Ensure styles are imported

const CreatePaper = () => {
  const [paperType, setPaperType] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleSelection = (type) => {
    setPaperType(type);
    if (type === "subjective") navigate("/subjective");
    else if (type === "objective") navigate("/objective");
    else if (type === "both") navigate("/both");
  };

  return (
    <div className="create-paper-container">
      <div className="form-box">
        <form>
          <label>
            <input
              type="radio"
              name="paperType"
              value="subjective"
              checked={paperType === "subjective"}
              onChange={() => handleSelection("subjective")}
            />
            Subjective
          </label>

          <label>
            <input
              type="radio"
              name="paperType"
              value="objective"
              checked={paperType === "objective"}
              onChange={() => handleSelection("objective")}
            />
            Objective
          </label>

          <label>
            <input
              type="radio"
              name="paperType"
              value="both"
              checked={paperType === "both"}
              onChange={() => handleSelection("both")}
            />
            Both
          </label>
        </form>
        <p>Selected Paper Type: <strong>{paperType || "None"}</strong></p>
      </div>
    </div>
  );
};

export default CreatePaper;
