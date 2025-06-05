import { useState, useEffect } from 'react'; // useEffect imported
import { useNavigate } from 'react-router-dom'; // useNavigate for logout
import { LogOut } from 'lucide-react'; // For logout button
import QRGenerator from '../components/QRGenerator';
import { authenticatedFetch } from '../utils/api'; // Added import

const ProfessorPanel = () => {
  const [activeTab, setActiveTab] = useState('qr');
  const [attendances, setAttendances] = useState([]); // Initialized as empty array
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // Stores original index for updates
  const [formNombre, setFormNombre] = useState('');
  const [formApellido, setFormApellido] = useState('');
  const [formMateria, setFormMateria] = useState('');
  const [formFecha, setFormFecha] = useState('');
  const [formPresente, setFormPresente] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // For logout


  useEffect(() => {
    if (activeTab === 'asistencias') {
      const fetchAttendances = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // TODO: Future enhancement: Filter attendances by professorId
          // e.g., const res = await authenticatedFetch(`/api/asistencias?profesorId=${currentUser.id}`);
          // This requires backend support and access to current user's ID.
          const res = await authenticatedFetch('/api/asistencias');
          if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
              alert('Acceso denegado. Por favor, inicie sesión de nuevo.');
              navigate('/login');
            } else {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return;
          }
          const data = await res.json();
          setAttendances(data);
        } catch (err) {
          console.error('Error al obtener asistencias:', err);
          setError(err.message || 'Error al cargar datos.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchAttendances();
    }
  }, [activeTab, navigate]);

  const openAddModal = () => {
    setEditIndex(null);
    setFormNombre('');
    setFormApellido('');
    setFormMateria('');
    setFormFecha('');
    setFormPresente(true);
    setShowModal(true);
  };

  const openEditModal = (index) => {
    const entry = attendances[index];
    setEditIndex(index);
    setFormNombre(entry.nombre);
    setFormApellido(entry.apellido || '');
    setFormMateria(entry.materia);
    setFormFecha(entry.fecha ? new Date(entry.fecha).toISOString().split('T')[0] : '');
    setFormPresente(entry.presente === undefined ? true : entry.presente);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formNombre || !formApellido || !formFecha || !formMateria) {
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

    setIsLoading(true);
    setError(null);

    try {
      let res;
      let updatedEntry;
      if (editIndex === null) { // Adding new
        res = await authenticatedFetch('/api/asistencias', { method: 'POST', body: payload });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        updatedEntry = await res.json();
        setAttendances([...attendances, updatedEntry]);
      } else { // Editing existing
        const entryToUpdate = attendances[editIndex];
        if (!entryToUpdate || !entryToUpdate._id) {
          alert("Error: No se pudo encontrar el ID de la asistencia para actualizar.");
          setIsLoading(false);
          return;
        }
        const id = entryToUpdate._id;
        res = await authenticatedFetch(`/api/asistencias/${id}`, { method: 'PUT', body: payload });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        updatedEntry = await res.json();
        const updatedAttendances = [...attendances];
        updatedAttendances[editIndex] = updatedEntry;
        setAttendances(updatedAttendances);
      }
      setShowModal(false);
    } catch (err) {
      console.error('Error al guardar:', err);
      setError(err.message || 'Error al guardar datos.');
      alert(`Error al guardar la asistencia: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta asistencia?')) return;

    const entryToDelete = attendances[index];
    if (!entryToDelete || !entryToDelete._id) {
      alert("Error: No se pudo encontrar el ID de la asistencia para eliminar.");
      return;
    }
    const id = entryToDelete._id;

    setIsLoading(true);
    setError(null);

    try {
      const res = await authenticatedFetch(`/api/asistencias/${id}`, { method: 'DELETE' });
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
      console.error('Error al eliminar:', err);
      setError(err.message || 'Error al eliminar datos.');
      alert(`Error al eliminar la asistencia: ${err.message}`);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="min-h-screen w-full px-6 py-10 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white">
              Panel del Profesor
            </h2>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600 px-4 py-2 rounded-lg border border-red-500 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
            >
              <LogOut size={20} /> Cerrar sesión
            </button>
          </div>


          <div className="flex justify-center gap-6 mb-10">
            <button
              onClick={() => setActiveTab('qr')}
              className={`px-8 py-3 rounded-full text-lg font-semibold transition-all shadow-sm border ${
                activeTab === 'qr' ? 'bg-blue-700 text-white' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              Generar Código QR
            </button>
            <button
              onClick={() => setActiveTab('asistencias')}
              className={`px-8 py-3 rounded-full text-lg font-semibold transition-all shadow-sm border ${
                activeTab === 'asistencias' ? 'bg-blue-700 text-white' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              Ver Asistencias
            </button>
          </div>

          {activeTab === 'qr' && (
            <section className="flex flex-col items-center">
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-white mb-6">Generador de Códigos QR</h3>
              <QRGenerator />
            </section>
          )}

          {activeTab === 'asistencias' && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-700 dark:text-white">Listado de Asistencias</h3>
                <button
                  onClick={openAddModal}
                  className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition shadow-md"
                >
                  + Nueva Asistencia
                </button>
              </div>

              {isLoading && <p className="text-center text-gray-500 dark:text-gray-400">Cargando asistencias...</p>}
              {error && <p className="text-center text-red-500 dark:text-red-400">Error: {error}</p>}

              {!isLoading && !error && (
                <div className="overflow-x-auto rounded-2xl shadow">
                  <table className="min-w-full table-auto text-sm bg-white dark:bg-gray-800">
                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      <tr>
                        <th className="px-6 py-4 text-left">Nombre Completo</th>
                        <th className="px-6 py-4 text-left">Materia</th>
                        <th className="px-6 py-4 text-left">Fecha</th>
                        <th className="px-6 py-4 text-left">Presente</th>
                        <th className="px-6 py-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendances.length > 0 ? (
                        attendances.map((entry, index) => (
                          <tr key={entry._id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700">
                            <td className="px-6 py-4">{`${entry.nombre} ${entry.apellido || ''}`}</td>
                            <td className="px-6 py-4">{entry.materia}</td>
                            <td className="px-6 py-4">{entry.fecha ? new Date(entry.fecha).toLocaleDateString() : 'N/A'}</td>
                            <td className="px-6 py-4">{entry.presente ? 'Sí' : 'No'}</td>
                            <td className="px-6 py-4 text-center flex justify-center gap-3">
                              <button
                                onClick={() => openEditModal(index)}
                                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-1 rounded-xl"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(index)}
                                className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-1 rounded-xl"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-6 text-gray-500 dark:text-gray-400">
                            No hay asistencias registradas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl w-full max-w-md shadow-2xl">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                      {editIndex === null ? 'Agregar Asistencia' : 'Editar Asistencia'}
                    </h3>

                    <div className="mb-4">
                      <label className="block text-gray-700 dark:text-white mb-1 font-medium">Nombre</label>
                      <input
                        type="text"
                        value={formNombre}
                        onChange={(e) => setFormNombre(e.target.value)}
                        className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
                        placeholder="Nombre del asistente"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 dark:text-white mb-1 font-medium">Apellido</label>
                      <input
                        type="text"
                        value={formApellido}
                        onChange={(e) => setFormApellido(e.target.value)}
                        className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
                        placeholder="Apellido del asistente"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 dark:text-white mb-1 font-medium">Materia</label>
                      <input
                        type="text"
                        value={formMateria}
                        onChange={(e) => setFormMateria(e.target.value)}
                        className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
                        placeholder="Nombre de la materia"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 dark:text-white mb-1 font-medium">Fecha</label>
                      <input
                        type="date"
                        value={formFecha}
                        onChange={(e) => setFormFecha(e.target.value)}
                        className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
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
                            <span className="font-medium text-gray-700 dark:text-white">¿Presente?</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-5 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessorPanel;