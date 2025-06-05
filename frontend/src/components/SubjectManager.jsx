import { useEffect, useState } from 'react';
import { authenticatedFetch } from '../utils/api';

const SubjectManager = () => {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ name: '', code: '', commission: 'A' });
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const res = await authenticatedFetch('/api/subjects');
    if (res.ok) setSubjects(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/subjects/${editId}` : '/api/subjects';
    const res = await authenticatedFetch(url, { method, body: form });
    if (res.ok) {
      setForm({ name: '', code: '', commission: 'A' });
      setEditId(null);
      load();
    } else {
      alert('Error al guardar');
    }
  };

  const edit = (s) => {
    setEditId(s._id);
    setForm({ name: s.name, code: s.code, commission: s.commission });
  };

  const del = async (id) => {
    if (!confirm('Eliminar asignatura?')) return;
    const res = await authenticatedFetch(`/api/subjects/${id}`, { method: 'DELETE' });
    if (res.ok) load();
  };

  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-4">Asignaturas</h3>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4 flex-wrap">
        <input
          className="border p-2 rounded"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Código"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />
        <select
          className="border p-2 rounded"
          value={form.commission}
          onChange={(e) => setForm({ ...form, commission: e.target.value })}
        >
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          {editId ? 'Actualizar' : 'Crear'}
        </button>
        {editId && (
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => { setEditId(null); setForm({ name: '', code: '', commission: 'A' }); }}
          >
            Cancelar
          </button>
        )}
      </form>
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Código</th>
            <th className="border px-2 py-1">Comisión</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((s) => (
            <tr key={s._id} className="text-center">
              <td className="border px-2 py-1">{s.name}</td>
              <td className="border px-2 py-1">{s.code}</td>
              <td className="border px-2 py-1">{s.commission}</td>
              <td className="border px-2 py-1 space-x-2">
                <button onClick={() => edit(s)} className="px-2 py-1 bg-yellow-400 rounded">Editar</button>
                <button onClick={() => del(s._id)} className="px-2 py-1 bg-red-600 text-white rounded">Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubjectManager;
