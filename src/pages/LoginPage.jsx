// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Validación para admin
    if (user === 'admin' && pass === '123456') {
      navigate('/panel');
    } 
    // Validación para profesor de Programación
    else if (user === 'programacion' && pass === '123456') {
      navigate('/professor-panel');
    } 
    // Otros casos de error
    else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">Iniciar sesión</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">Ingrese sus credenciales para acceder al sistema</p>

        <input
          type="text"
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-lg border"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-lg border"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}
