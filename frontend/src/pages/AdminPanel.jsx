import { useEffect, useState } from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authenticatedFetch } from '../utils/api'; // Added import

const AdminPanel = () => {
  const [attendances, setAttendances] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // Stores original index for updates
  const [formNombre, setFormNombre] = useState('');
  const [formApellido, setFormApellido] = useState(''); // Added
  const [formFecha, setFormFecha] = useState('');
  const [formMateria, setFormMateria] = useState('');
  const [formPresente, setFormPresente] = useState(true); // Added, default true
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:3000/api/asistencias'; // Define base URL

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const res = await authenticatedFetch(API_BASE_URL); // Use authenticatedFetch and new URL
        if (!res.ok) {
          // Handle non-ok responses (e.g., 401, 403)
          if (res.status === 401 || res.status === 403) {
            alert('Acceso denegado. Por favor, inicie sesión de nuevo.');
            navigate('/login'); // Redirect to login
          } else {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return; // Stop further processing if not ok
        }
        const data = await res.json();
        setAttendances(data);
      } catch (err) {
        console.error('Error al obtener asistencias', err);
        // Potentially show a user-friendly error message
      }
    };
    fetchAttendances();
  }, [navigate]); // Added navigate to dependency array

  const openAddModal = () => {
    setEditIndex(null);
    setFormNombre('');
    setFormApellido(''); // Reset new field
    setFormFecha('');
    setFormMateria('');
    setFormPresente(true); // Reset new field to default
    setShowModal(true);
  };

  const openEditModal = (index) => {
    const entry = attendances[index];
    setEditIndex(index); // Store original index
    setFormNombre(entry.nombre);
    setFormApellido(entry.apellido || ''); // Handle missing apellido
    // Format date for input type="date" which expects YYYY-MM-DD
    setFormFecha(entry.fecha ? new Date(entry.fecha).toISOString().split('T')[0] : '');
    setFormMateria(entry.materia);
    setFormPresente(entry.presente === undefined ? true : entry.presente);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formNombre || !formApellido || !formFecha || !formMateria) { // Updated validation
      alert('Por favor completa todos los campos (Nombre, Apellido, Fecha, Materia)');
      return;
    }

    const payload = {
      nombre: formNombre,
      apellido: formApellido,
      materia: formMateria,
      fecha: formFecha,
      presente: formPresente,
    };

    try {
      let res;
      let updatedEntry;

      if (editIndex === null) { // Adding new attendance
        res = await authenticatedFetch(API_BASE_URL, { // Use authenticatedFetch and new URL
          method: 'POST',
          body: payload, // authenticatedFetch handles stringification and headers
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        updatedEntry = await res.json();
        setAttendances([...attendances, updatedEntry]);
      } else { // Editing existing attendance
        const entryToUpdate = attendances[editIndex];
        if (!entryToUpdate || !entryToUpdate._id) {
          console.error("Error: Attempting to update an entry without an ID.", entryToUpdate);
          alert("Error: No se pudo encontrar el ID de la asistencia para actualizar.");
          return;
        }
        const id = entryToUpdate._id;
        res = await authenticatedFetch(`${API_BASE_URL}/${id}`, { // Use authenticatedFetch and new URL
          method: 'PUT',
          body: payload, // authenticatedFetch handles stringification and headers
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        updatedEntry = await res.json();
        const updatedAttendances = [...attendances];
        updatedAttendances[editIndex] = updatedEntry;
        setAttendances(updatedAttendances);
      }
      setShowModal(false);
    } catch (err) {
      console.error('Error al guardar', err);
      alert(`Error al guardar la asistencia: ${err.message}`);
    }
  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm('¿Seguro que quieres eliminar esta asistencia?');
    if (!confirmDelete) return;

    const entryToDelete = attendances[index];
     if (!entryToDelete || !entryToDelete._id) {
        console.error("Error: Attempting to delete an entry without an ID.", entryToDelete);
        alert("Error: No se pudo encontrar el ID de la asistencia para eliminar.");
        return;
    }
    const id = entryToDelete._id;

    try {
      const res = await authenticatedFetch(`${API_BASE_URL}/${id}`, { // Use authenticatedFetch and new URL
        method: 'DELETE',
      });
      if (!res.ok) {
         if (res.status === 401 || res.status === 403) {
            alert('Acceso denegado. Por favor, inicie sesión de nuevo.');
            navigate('/login');
          } else {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return;
      }

      const updatedAttendances = [...attendances];
      updatedAttendances.splice(index, 1);
      setAttendances(updatedAttendances);
    } catch (err) {
      console.error('Error al eliminar', err);
      alert(`Error al eliminar la asistencia: ${err.message}`);
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Deseas cerrar sesión?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
      navigate('/login');
    }
  };

  // Agrupar asistencias por materia
  const groupedBySubject = attendances.reduce((acc, entry, index) => {
    const subject = entry.materia || 'Sin materia'; // Changed from entry.subject to entry.materia
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push({ ...entry, _originalIndex: index }); // Store original index for actions
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

      {Object.entries(groupedBySubject).map(([materia, entries]) => ( // Changed subject to materia
        <div key={materia} className="mb-10">
          <h4 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-300">{materia}</h4>
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
                <tr>
                  <th className="px-6 py-3">Nombre Completo</th>
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3">Presente</th>
                  <th className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry._id || entry._originalIndex} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">{`${entry.nombre} ${entry.apellido || ''}`}</td>
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      {entry.fecha ? new Date(entry.fecha).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      {entry.presente ? 'Sí' : 'No'}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 text-center">
                      <button
                        onClick={() => openEditModal(entry._originalIndex)} // Use original index
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-1 rounded-xl mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(entry._originalIndex)} // Use original index
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
                value={formNombre}
                onChange={(e) => setFormNombre(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="Nombre del asistente"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Apellido</label>
              <input
                type="text"
                value={formApellido}
                onChange={(e) => setFormApellido(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="Apellido del asistente"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Fecha</label>
              <input
                type="date"
                value={formFecha}
                onChange={(e) => setFormFecha(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-4"> {/* Changed mb-6 to mb-4 for consistency */}
              <label className="block mb-1 font-medium">Materia</label>
              <input
                type="text"
                value={formMateria}
                onChange={(e) => setFormMateria(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="Nombre de la materia"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formPresente}
                  onChange={(e) => setFormPresente(e.target.checked)}
                  className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="font-medium">¿Presente?</span>
              </label>
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
