import React from 'react';
import { BrowserRouter } from "react-router";
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.scss';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
