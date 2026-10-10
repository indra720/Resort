import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initDatabase } from './api/db';

// Initialize fake DB in localStorage with multi-tenant seeds
initDatabase();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
