import React from 'react';
import { usePaper } from '../../context/PaperContext';

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
        </div>
      </div>

      <div className="settings-section">
        <h3>Data Management</h3>
        <button onClick={handleClearData} className="clear-data-btn">
          Clear All Saved Papers
        </button>
      </div>
    </div>
  );
};

export default Settings;
