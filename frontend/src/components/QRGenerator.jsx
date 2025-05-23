import { useState, useRef } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { motion, AnimatePresence } from 'framer-motion';
import { authenticatedFetch } from '../utils/api'; // Adjusted path as it's in components folder

const QRGenerator = () => {
  const [qrId, setQrId] = useState(''); // Will store the full URL for the QR code
  const [materia, setMateria] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const qrRef = useRef();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevent default if it's from a form submit event
    
    if (!materia || materia.trim() === '') {
      alert('Por favor, ingrese el nombre de la materia.');
      return;
    }
    if (durationMinutes <= 0) {
      alert('La duración debe ser un número positivo de minutos.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch('/api/qr/generate', {
        method: 'POST',
        body: { materia, durationMinutes: Number(durationMinutes) },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const data = await response.json();
      if (data.sessionId) {
        setQrId(`${window.location.origin}/escanear?sessionId=${data.sessionId}`);
        setShowModal(true);
      } else {
        throw new Error('No se recibió sessionId del servidor.');
      }
    } catch (err) {
      console.error('Error al generar QR:', err);
      setError(err.message);
      alert(`Error al generar QR: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    // Use materia and a timestamp for a more descriptive filename
    const filename = `QR_${materia.replace(/\s+/g, '_') || 'sesion'}_${Date.now()}.png`;
    a.download = filename;
    a.click();
  };

  const handleCopyLink = () => {
    if (!qrId) return;
    navigator.clipboard.writeText(qrId);
    alert('¡Enlace copiado al portapapeles!');
  };

  return (
    <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label htmlFor="materia" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Materia
          </label>
          <input
            type="text"
            id="materia"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            placeholder="Ej: Cálculo I"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Duración (minutos)
          </label>
          <input
            type="number"
            id="durationMinutes"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? 'Generando...' : 'Generar Código QR'}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
      </form>

      <AnimatePresence>
        {showModal && qrId && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md text-center shadow-xl relative"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Código QR Generado</h2>
              <div ref={qrRef} className="flex justify-center my-4">
                {qrId && <QRCode value={qrId} size={256} quietZone={10} />}
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 break-all">
                Escanea o visita: <strong className="text-gray-800 dark:text-white">{qrId}</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <button
                  onClick={handleCopyLink}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
                >
                  Copiar enlace
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
                >
                  Descargar
                </button>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QRGenerator;
