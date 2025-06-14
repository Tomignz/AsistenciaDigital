import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/auth`;

  const handleLogin = async () => {
    if (!user || !pass) return alert('Por favor ingresa usuario y contraseña');
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass }),
      });
      const data = await res.json();

      if (res.ok && data.token) { // Check for token presence
        // Store token and user info in localStorage
        localStorage.setItem('token', data.token);
        if (data.username) localStorage.setItem('username', data.username);
        if (data.role) localStorage.setItem('userRole', data.role);

        // Navigate based on role
        if (data.role === 'admin') {
          navigate('/panel');
        } else if (data.role === 'profesor') {
          navigate('/professor-panel');
        } else {
          // If role is somehow undefined after successful login with token,
          // it's an unexpected state, but we should handle it.
          // Perhaps navigate to a generic dashboard or show an error.
          // For now, alerting and staying on page or navigating to login.
          localStorage.removeItem('token'); // Clean up partial login
          localStorage.removeItem('username');
          localStorage.removeItem('userRole');
          alert('Rol de usuario no reconocido. Por favor, contacte al administrador.');
          // navigate('/login'); // Optionally navigate back to login
        }
      } else {
        alert(data.message || 'Credenciales incorrectas o token no recibido.');
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    }
  };

  const handleRegister = async () => {
    if (!user || !pass) return alert('Por favor ingresa usuario y contraseña');
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass }),
      });
      const data = await res.json();

      if (res.ok) {
        alert('Usuario registrado con éxito, ahora inicia sesión');
        setIsRegister(false);
        setUser('');
        setPass('');
      } else {
        alert(data.message || 'Error al registrar usuario');
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">
          {isRegister ? 'Registrar nuevo usuario' : 'Iniciar sesión'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
          {isRegister
            ? 'Ingrese un usuario y contraseña para registrarse'
            : 'Ingrese sus credenciales para acceder al sistema'}
        </p>

        <input
          type="text"
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:text-white"
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:text-white"
          autoComplete={isRegister ? 'new-password' : 'current-password'}
        />

        <button
          onClick={isRegister ? handleRegister : handleLogin}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors mb-4"
        >
          {isRegister ? 'Registrarse' : 'Iniciar sesión'}
        </button>

        <p
          className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none hover:underline"
          onClick={() => setIsRegister(!isRegister)}
          aria-label="Toggle login/register"
        >
          {isRegister
            ? '¿Ya tienes cuenta? Inicia sesión'
            : '¿No tienes cuenta? Regístrate aquí'}
        </p>
      </div>
    </div>
  );
}
