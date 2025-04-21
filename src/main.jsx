import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { PaperProvider } from './context/PaperContext'; // Import your context provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PaperProvider>
        <App />
      </PaperProvider>
    </BrowserRouter>
  </StrictMode>
);
