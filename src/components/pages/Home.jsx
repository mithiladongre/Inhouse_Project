import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePaper } from '../../context/PaperContext';
import './Home.css';

const Home = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [message, setMessage] = useState('');
  const [paperDetails, setPaperDetails] = useState({
    subject: '',
    date: '',
    day: '',
    time: '',
    totalMarks: '',
    rollNoPrefix: '',
    courseOutcomes: [
      { text: '' },
      { text: '' }
    ]
  });
  const { updateSettings } = usePaper();

  const years = [
    { id: '1', name: 'First Year' },
    { id: '2', name: 'Second Year' },
    { id: '3', name: 'Third Year' },
    { id: '4', name: 'Fourth Year' }
  ];

  const branches = [
    { id: 'it', name: 'Information Technology' },
    { id: 'entc', name: 'Electronics and Telecommunication Engineering' },
    { id: 'aids', name: 'Artificial Intelligence and Data Science' },
    { id: 'cs', name: 'Computer Science Engineering' },
    { id: 'ece', name: 'Electronics and Computer Engineering' }
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setMessage('');
    updateSettings({ defaultYear: e.target.value });
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
    setMessage('');
    updateSettings({ defaultBranch: e.target.value });
  };

  const handlePaperDetailsChange = (field, value) => {
    setPaperDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCOChange = (index, value) => {
    setPaperDetails(prev => ({
      ...prev,
      courseOutcomes: prev.courseOutcomes.map((co, i) => 
        i === index ? { text: value } : co
      )
    }));
  };

  const handleGetStarted = (e) => {
    if (!selectedYear || !selectedBranch || !paperDetails.subject || !paperDetails.date || 
        !paperDetails.day || !paperDetails.time || !paperDetails.totalMarks) {
      e.preventDefault();
      setMessage('Please fill in all required fields');
      return;
    }
    setMessage('');
    updateSettings({ 
      defaultYear: selectedYear,
      defaultBranch: selectedBranch,
      paperDetails: paperDetails
    });
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <h1>University Question Paper Generator</h1>
          <p className="subtitle">
            Create professional and standardized question papers for university examinations with ease.
            Streamline your paper creation process with our comprehensive tool.
          </p>
        </div>

        <div className="paper-details-form">
          <div className="form-section-title">Paper Details</div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">Academic Year</label>
              <select 
                id="year" 
                value={selectedYear} 
                onChange={handleYearChange}
                className="form-select"
              >
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year.id} value={year.id}>{year.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="branch">Engineering Branch</label>
              <select 
                id="branch" 
                value={selectedBranch} 
                onChange={handleBranchChange}
                className="form-select"
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="subject">Subject Name</label>
              <input
                type="text"
                id="subject"
                value={paperDetails.subject}
                onChange={(e) => handlePaperDetailsChange('subject', e.target.value)}
                className="form-input"
                placeholder="Enter subject name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Examination Date</label>
              <input
                type="date"
                id="date"
                value={paperDetails.date}
                onChange={(e) => handlePaperDetailsChange('date', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="day">Examination Day</label>
              <select
                id="day"
                value={paperDetails.day}
                onChange={(e) => handlePaperDetailsChange('day', e.target.value)}
                className="form-select"
              >
                <option value="">Select Day</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="time">Examination Time</label>
              <input
                type="text"
                id="time"
                value={paperDetails.time}
                onChange={(e) => handlePaperDetailsChange('time', e.target.value)}
                className="form-input"
                placeholder="e.g., 10:30am-1:30pm"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="totalMarks">Total Marks</label>
              <input
                type="number"
                id="totalMarks"
                value={paperDetails.totalMarks}
                onChange={(e) => handlePaperDetailsChange('totalMarks', e.target.value)}
                className="form-input"
                placeholder="Enter total marks"
              />
            </div>

            <div className="form-group">
              <label htmlFor="rollNoPrefix">Roll Number Prefix</label>
              <input
                type="text"
                id="rollNoPrefix"
                value={paperDetails.rollNoPrefix}
                onChange={(e) => handlePaperDetailsChange('rollNoPrefix', e.target.value)}
                className="form-input"
                placeholder="e.g., ABC"
              />
            </div>
          </div>

          <div className="form-section-title">Course Outcomes</div>
          <div className="course-outcomes">
            {paperDetails.courseOutcomes.map((co, index) => (
              <div key={index} className="form-group">
                <label htmlFor={`co${index + 1}`}>Course Outcome {index + 1}</label>
                <textarea
                  id={`co${index + 1}`}
                  value={co.text}
                  onChange={(e) => handleCOChange(index, e.target.value)}
                  className="form-textarea"
                  placeholder={`Describe Course Outcome ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {message && <div className="message">{message}</div>}

        <div className="features">
          <div className="feature">
            <span className="feature-icon">📝</span>
            <span className="feature-text">Create both subjective and objective questions with proper formatting</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <span className="feature-text">Align questions with course outcomes for better assessment</span>
          </div>
          <div className="feature">
            <span className="feature-icon">💾</span>
            <span className="feature-text">Save and manage multiple question papers</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📥</span>
            <span className="feature-text">Download papers in standardized PDF format</span>
          </div>
        </div>
        
        <Link 
          to="/create-paper" 
          className="get-started-btn"
          onClick={handleGetStarted}
        >
          Create Question Paper
        </Link>
      </div>
    </div>
  );
};

export default Home;
