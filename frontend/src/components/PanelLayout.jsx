// src/components/PanelLayout.jsx
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function PanelLayout({ title, subtitle, children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black dark:bg-black dark:text-white">
      <div className="flex justify-end">
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm">
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>

      <div className="text-center my-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">{children}</div>
    </div>
  );
}
