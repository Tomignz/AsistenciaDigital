import { useState, useEffect } from 'react';
import ManualAttendanceForm from '../components/ManualAttendanceForm'; // Asegúrate de que el path sea correcto

const AdminPanel = () => {
  const [attendances, setAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const fetchAttendances = async () => {
      const data = await fetch('/api/asistencias').then(res => res.json());
      setAttendances(data);
      const uniqueMaterias = [...new Set(data.map(a => a.materia))];
      setMaterias(uniqueMaterias);
      setSelectedMateria(uniqueMaterias[0] || '');
    };
    fetchAttendances();
  }, []);

  useEffect(() => {
    let filtered = attendances;
    if (selectedMateria) filtered = filtered.filter(a => a.materia === selectedMateria);
    if (dateFrom) filtered = filtered.filter(a => new Date(a.fecha) >= new Date(dateFrom));
    if (dateTo) filtered = filtered.filter(a => new Date(a.fecha) <= new Date(dateTo));
    setFilteredAttendances(filtered);
  }, [attendances, selectedMateria, dateFrom, dateTo]);

  const handleAddAsistencia = (nuevaAsistencia) => {
    setAttendances(prev => [...prev, nuevaAsistencia]);
  };

  const attendanceByStudent = filteredAttendances.reduce((acc, cur) => {
    const fullName = `${cur.nombre} ${cur.apellido}`;
    if (!acc[fullName]) acc[fullName] = { total: 0, present: 0 };
    acc[fullName].total += 1;
    if (cur.presente) acc[fullName].present += 1;
    return acc;
  }, {});

  const statsByStudent = attendances.reduce((acc, entry) => {
    const name = `${entry.nombre} ${entry.apellido}`;
    if (!acc[name]) {
      acc[name] = { total: 0, materias: {} };
    }
    acc[name].total += 1;
    acc[name].materias[entry.materia] = (acc[name].materias[entry.materia] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Panel de Administración</h2>

      {/* Formulario para agregar asistencia manual */}
      <div className="mb-8">
        <ManualAttendanceForm onAdd={handleAddAsistencia} />
      </div>

      {/* Filtros */}
      <div className="mb-4 flex gap-4 items-center flex-wrap">
        <label className="font-semibold">Filtrar por materia:</label>
        <select
          className="border p-2 rounded"
          value={selectedMateria}
          onChange={e => setSelectedMateria(e.target.value)}
        >
          {materias.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <label className="font-semibold">Desde:</label>
        <input
          type="date"
          className="border p-2 rounded"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
        />

        <label className="font-semibold">Hasta:</label>
        <input
          type="date"
          className="border p-2 rounded"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
        />
      </div>

      <h3 className="text-2xl font-semibold mt-8 mb-4">Estadísticas por Alumno</h3>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Alumno</th>
            <th className="border px-4 py-2">Asistencias</th>
            <th className="border px-4 py-2">Total Clases</th>
            <th className="border px-4 py-2">% Cumplimiento</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(attendanceByStudent).map(([student, stats]) => {
            const porcentaje = ((stats.present / stats.total) * 100).toFixed(2);
            const color = porcentaje < 75 ? 'text-red-600 font-bold' : 'text-green-600';
            return (
              <tr key={student} className="text-center">
                <td className="border px-4 py-2 text-left">{student}</td>
                <td className="border px-4 py-2">{stats.present}</td>
                <td className="border px-4 py-2">{stats.total}</td>
                <td className={`border px-4 py-2 ${color}`}>{porcentaje}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
