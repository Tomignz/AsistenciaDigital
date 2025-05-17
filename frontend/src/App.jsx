import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel'; // aquí importamos AdminPanel
import QRScannerPage from './pages/QRScannerPage';
import ProfessorPanel from "./pages/ProfessorPanel";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-all">
          {/* Botón para cambiar tema */}
          <button
            onClick={toggleTheme}
            className="fixed top-2 right-40 bg-gray-800 text-white p-2 rounded-full"
          >
            {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
          </button>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/panel" element={<AdminPanel />} /> {/* Aquí está AdminPanel */}
            <Route path="/professor-panel" element={<ProfessorPanel />} />
            <Route path="/escanear" element={<QRScannerPage />} />
            <Route path="/escanear/demo" element={<QRScannerPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
