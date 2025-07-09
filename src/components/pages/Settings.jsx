import React from 'react';
import { usePaper } from '../../context/PaperContext';
import '../../App.css';

const Settings = () => {
  const { settings, updateSettings } = usePaper();

  const handleSettingChange = (setting, value) => {
    updateSettings({ ...settings, [setting]: value });
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all saved papers? This action cannot be undone.')) {
      localStorage.removeItem('savedPapers');
      alert('All saved papers have been cleared.');
    }
  };

  return (
    <div className="paper-form-container">
      <h2>Settings</h2>
      <div className="settings-section">
        <h3>General Settings</h3>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
            />
            Auto-save papers
          </label>
          <p className="setting-description">Automatically save papers as you create them</p>
        </div>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
            />
            Dark Mode
          </label>
          <p className="setting-description">Switch between light and dark theme</p>
        </div>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.showMarks}
              onChange={(e) => handleSettingChange('showMarks', e.target.checked)}
            />
            Show marks in preview
          </label>
          <p className="setting-description">Display marks for each question in the preview</p>
        </div>
      </div>

      <div className="settings-section">
        <h3>Default Settings</h3>
        <div className="setting-item">
          <label>
            Default Paper Type:
            <select
              value={settings.defaultPaperType}
              onChange={(e) => handleSettingChange('defaultPaperType', e.target.value)}
            >
              <option value="objective">Objective</option>
              <option value="subjective">Subjective</option>
              <option value="both">Both</option>
            </select>
          </label>
          <p className="setting-description">Choose the default paper type when creating a new paper</p>
        </div>
      </div>

      <div className="settings-section">
        <h3>Data Management</h3>
        <div className="setting-item">
          <button onClick={handleClearData} className="clear-data-btn">
            Clear All Saved Papers
          </button>
          <p className="setting-description">Remove all saved papers from your local storage</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
