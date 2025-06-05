export default function AttendanceTable({ records = [], onEdit, onDelete }) {
  return (
    <table className="w-full border-collapse border border-gray-300 text-sm">
      <thead className="bg-gray-200">
        <tr>
          <th className="border px-2 py-1">Nombre</th>
          <th className="border px-2 py-1">Apellido</th>
          <th className="border px-2 py-1">Materia</th>
          <th className="border px-2 py-1">Fecha</th>
          <th className="border px-2 py-1">Presente</th>
          {onEdit && <th className="border px-2 py-1">Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {records.length > 0 ? (
          records.map((r, idx) => (
            <tr key={r._id || idx} className="text-center">
              <td className="border px-2 py-1">{r.nombre}</td>
              <td className="border px-2 py-1">{r.apellido}</td>
              <td className="border px-2 py-1">{r.materia}</td>
              <td className="border px-2 py-1">{new Date(r.fecha).toLocaleDateString()}</td>
              <td className="border px-2 py-1">{r.presente ? '✔️' : '❌'}</td>
              {onEdit && (
                <td className="border px-2 py-1 space-x-2">
                  <button
                    onClick={() => onEdit(idx)}
                    className="px-2 py-1 bg-blue-600 text-white rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(r._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={onEdit ? 6 : 5} className="text-center py-4 text-gray-500">
              No hay registros
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
