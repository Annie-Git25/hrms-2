// src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // <--- Add this import!

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap your <App /> component with <AuthProvider> */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
