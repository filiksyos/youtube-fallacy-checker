import React from 'react';
import ReactDOM from 'react-dom/client';
import { Sidebar } from '../sidebar/Sidebar';
import '../styles/index.css';

export const initializeSidebar = (onClose) => {
  const root = document.getElementById('fallacy-sidebar-root');
  if (!root) return;
  
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Sidebar onClose={onClose} />
    </React.StrictMode>
  );
};