import { useEffect, useState } from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [attendances, setAttendances] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formName, setFormName] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendances = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:3000/api/attendances', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAttendances(data);
      } catch (err) {
        console.error('Error al obtener asistencias', err);
      }
    };
    fetchAttendances();
  }, []);

  const openAddModal = () => {
    setEditIndex(null);
    setFormName('');
    setFormDate('');
    setFormSubject('');
    setShowModal(true);
  };

  const openEditModal = (index) => {
    const entry = attendances[index];
    setEditIndex(index);
    setFormName(entry.name);
    setFormDate(entry.timestamp);
    setFormSubject(entry.subject);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formName || !formDate || !formSubject) {
      alert('Por favor completa todos los campos');
      return;
    }

    const token = localStorage.getItem('token');
    const payload = { name: formName, timestamp: formDate, subject: formSubject };

    try {
      if (editIndex === null) {
        const res = await fetch('http://localhost:3000/api/attendances', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const newEntry = await res.json();
        setAttendances([...attendances, newEntry]);
      } else {
        const id = attendances[editIndex]._id;
        const res = await fetch(`http://localhost:3000/api/attendances/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const updatedEntry = await res.json();
        const updated = [...attendances];
        updated[editIndex] = updatedEntry;
        setAttendances(updated);
      }

      setShowModal(false);
    } catch (err) {
      console.error('Error al guardar', err);
    }
  };

  const handleDelete = async (index) => {
    const confirm = window.confirm('¿Seguro que quieres eliminar esta asistencia?');
    if (!confirm) return;

    const token = localStorage.getItem('token');
    const id = attendances[index]._id;

    try {
      await fetch(`http://localhost:3000/api/attendances/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = [...attendances];
      updated.splice(index, 1);
      setAttendances(updated);
    } catch (err) {
      console.error('Error al eliminar', err);
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Deseas cerrar sesión?')) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  // Agrupar asistencias por materia
  const groupedBySubject = attendances.reduce((acc, entry, index) => {
    const subject = entry.subject || 'Sin materia';
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push({ ...entry, _index: index });
    return acc;
  }, {});

  return (
    <div className="p-6 w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(0)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        >
          <ArrowLeft size={20} /> Volver
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
        >
          <LogOut size={20} /> Cerrar sesión
        </button>
      </div>

      <h2 className="text-4xl font-bold mb-10 text-center text-gray-800 dark:text-white">
        Panel de Administración
      </h2>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-700 dark:text-white">
          Registro de Asistencias por Materia
        </h3>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition shadow-md"
        >
          + Nueva Asistencia
        </button>
      </div>

      {Object.entries(groupedBySubject).map(([subject, entries]) => (
        <div key={subject} className="mb-10">
          <h4 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-300">{subject}</h4>
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
                <tr>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">{entry.name}</td>
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">{entry.timestamp}</td>
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 text-center">
                      <button
                        onClick={() => openEditModal(entry._index)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-1 rounded-xl mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(entry._index)}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-1 rounded-xl"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-xl animate-fade-in">
            <h3 className="text-2xl font-semibold mb-4">
              {editIndex === null ? 'Agregar Asistencia' : 'Editar Asistencia'}
            </h3>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Nombre</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="Nombre del asistente"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Fecha</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-1 font-medium">Materia</label>
              <input
                type="text"
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="Nombre de la materia"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
