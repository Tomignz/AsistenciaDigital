import ManualAttendanceForm from './ManualAttendanceForm';

export default function AddManualModal({ open, onClose, onAdd }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
        <ManualAttendanceForm onAdd={(data) => { onAdd(data); onClose(); }} />
        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
