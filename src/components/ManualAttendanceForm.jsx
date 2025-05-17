// src/components/ManualAttendanceForm.jsx
import { useState } from 'react';

const ManualAttendanceForm = ({ onAdd }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [materia, setMateria] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [presente, setPresente] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !materia || !fecha || !hora) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const fechaCompleta = new Date(`${fecha}T${hora}`);

    const nuevaAsistencia = {
      nombre,
      apellido,
      materia,
      fecha: fechaCompleta.toISOString(), // formato UTC
      presente
    };

    onAdd(nuevaAsistencia); // debe guardarse en el backend o estado global
    // Limpiar campos
    setNombre('');
    setApellido('');
    setMateria('');
    setFecha('');
    setHora('');
    setPresente(true);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow space-y-4 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-black dark:text-white">Agregar asistencia manual</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="border p-2 rounded" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Materia" value={materia} onChange={e => setMateria(e.target.value)} />
        <input type="date" className="border p-2 rounded" value={fecha} onChange={e => setFecha(e.target.value)} />
        <input type="time" className="border p-2 rounded" value={hora} onChange={e => setHora(e.target.value)} />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={presente} onChange={e => setPresente(e.target.checked)} />
          Presente
        </label>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Agregar Asistencia
      </button>
    </form>
  );
};

export default ManualAttendanceForm;
