import React, { createContext, useState, useContext, useEffect } from 'react';

const PaperContext = createContext();

export const PaperProvider = ({ children }) => {
  const [paperData, setPaperData] = useState(null);
  const [settings, setSettings] = useState({
    autoSave: localStorage.getItem('autoSave') === 'true',
    darkMode: localStorage.getItem('darkMode') === 'true',
    defaultPaperType: localStorage.getItem('defaultPaperType') || 'objective',
    showMarks: localStorage.getItem('showMarks') === 'true'
  });

  // Apply dark mode on mount and when it changes
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [settings.darkMode]);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    Object.entries(newSettings).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  };

  return (
    <PaperContext.Provider value={{ 
      paperData, 
      setPaperData,
      settings,
      updateSettings
    }}>
      {children}
    </PaperContext.Provider>
  );
};

export const usePaper = () => useContext(PaperContext);
