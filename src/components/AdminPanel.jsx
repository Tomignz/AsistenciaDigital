import QRCodeGenerator from '../components/QRCodeGenerator';

const AdminPanel = ({ attendances = [] }) => {
  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>

      {/* Generador de QR */}
      <div className="mb-8">
        <QRCodeGenerator />
      </div>

      <table className="mx-auto border border-collapse border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Nombre</th>
            <th className="px-4 py-2 border">Fecha de Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map((entry, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border">{entry.name}</td>
              <td className="px-4 py-2 border">{entry.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
