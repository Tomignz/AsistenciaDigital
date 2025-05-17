// src/components/AttendanceForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AttendanceForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
      setName('');
    }
  };

  const handleLogout = () => {
    // Aquí puedes limpiar el estado de sesión si lo estás usando
    navigate('/login');
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-6">
      <h2 className="text-xl font-bold text-black dark:text-white">Registrar Asistencia</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Tu nombre"
          className="p-2 rounded text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
        >
          Registrar
        </button>
      </form>

      <div className="flex justify-between">
        <button
          onClick={() => navigate('/panel')}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Volver
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default AttendanceForm;
