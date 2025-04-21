import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";

const Home = () => {
  const navigate = useNavigate(); // Initialize navigation

  const [formData, setFormData] = useState({
    year: "",
    subject: "",
    paperType: "objective",
    branch: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/create-paper"); // Navigate to Create Paper page
  };

  return (
    <div className="home-container">
      <div className="form-box">
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="year">Year:</label>
            <select id="year" name="year" value={formData.year} onChange={handleChange}>
              <option value="">Select Year</option>
              <option value="First Year">First Year</option>
              <option value="Second Year">Second Year</option>
              <option value="Third Year">Third Year</option>
              <option value="Fourth Year">Fourth Year</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="subject">Subject Name:</label>
            <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Enter subject name" />
          </div>
          <div className="form-field">
            <label htmlFor="branch">Branch:</label>
            <select id="branch" name="branch" value={formData.branch} onChange={handleChange}>
              <option value="">Select Branch</option>
              <option value="CSE">Computer Science Engineering</option>
              <option value="ETE">Electronics & Telecommunication Engineering</option>
              <option value="IT">Information Technology</option>
              <option value="AIDS">Artificial Intelligence and Data Science</option>
              <option value="ECE">Electronics and Computer Engineering</option>
            </select>
          </div>
          <button type="submit">Create Paper</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
