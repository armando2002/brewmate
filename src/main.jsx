// src/main.jsx
import './firebase'; // ✅ This line MUST be first, before any Firebase usage
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast'; // ✅ Add this

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="*" element={<App />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
    <Toaster position="top-center" reverseOrder={false} /> {/* ✅ Add this */}
  </React.StrictMode>
);
