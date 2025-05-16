// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 text-black dark:text-white transition-all">
      <h1 className="text-3xl font-bold mb-6">Sistema de Asistencia</h1>
      <h2 className="text-xl mb-4">Bienvenido al sistema de asistencia digital</h2>
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
        >
          Comenzar
        </Link>
    </div>
  );
};

export default Home;
