import { useState } from 'react';
import QRGenerator from '../components/QRGenerator';

const ProfessorPanel = ({ attendances: initialAttendances = [] }) => {
  const [activeTab, setActiveTab] = useState('qr');
  const [attendances, setAttendances] = useState(initialAttendances);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formName, setFormName] = useState('');
  const [formDate, setFormDate] = useState('');

  const openAddModal = () => {
    setEditIndex(null);
    setFormName('');
    setFormDate('');
    setShowModal(true);
  };

  const openEditModal = (index) => {
    setEditIndex(index);
    setFormName(attendances[index].name);
    setFormDate(attendances[index].timestamp);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formName || !formDate) {
      alert('Por favor completa todos los campos');
      return;
    }
    const updatedAttendance = { name: formName, timestamp: formDate };
    if (editIndex === null) {
      setAttendances([...attendances, updatedAttendance]);
    } else {
      const updated = [...attendances];
      updated[editIndex] = updatedAttendance;
      setAttendances(updated);
    }
    setShowModal(false);
  };

  const handleDelete = (index) => {
    if (window.confirm('¿Seguro que quieres eliminar esta asistencia?')) {
      setAttendances(attendances.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="min-h-screen w-full px-6 py-10 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-10">
          <h2 className="text-4xl font-extrabold mb-10 text-center text-gray-800 dark:text-white">
            Panel de Administración
          </h2>

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

              <div className="overflow-x-auto rounded-2xl shadow">
                <table className="min-w-full table-auto text-sm bg-white dark:bg-gray-800">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    <tr>
                      <th className="px-6 py-4 text-left">Nombre</th>
                      <th className="px-6 py-4 text-left">Fecha</th>
                      <th className="px-6 py-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendances.length > 0 ? (
                      attendances.map((entry, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700">
                          <td className="px-6 py-4">{entry.name}</td>
                          <td className="px-6 py-4">{entry.timestamp}</td>
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
                        <td colSpan="3" className="text-center py-6 text-gray-500 dark:text-gray-400">
                          No hay asistencias registradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

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
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
                        placeholder="Nombre del asistente"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 dark:text-white mb-1 font-medium">Fecha</label>
                      <input
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
                      />
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