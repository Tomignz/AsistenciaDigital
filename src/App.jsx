import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import QRScannerPage from './pages/QRScannerPage';
import ProfessorPanel from "./pages/ProfessorPanel";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
            className="fixed top-5 right-5 bg-gray-800 text-white p-2 rounded-full"
          >
            {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
          </button>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/panel" element={<AdminPanel />} />
            <Route path="/professor-panel" element={<ProfessorPanel />} />
            {/* Ruta para escanear QR */}
            <Route path="/escanear" element={<QRScannerPage />} />
            {/* Ruta para escanear QR en modo demo */}
            {/* Puedes cambiar la ruta a lo que necesites */}
            <Route path="/escanear/demo" element={<QRScannerPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
