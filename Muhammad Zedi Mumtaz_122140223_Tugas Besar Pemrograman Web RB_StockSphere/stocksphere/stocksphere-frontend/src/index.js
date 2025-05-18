import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { RequestProvider } from './context/RequestContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <RequestProvider>
      <App />
    </RequestProvider>
  </AuthProvider>
);
