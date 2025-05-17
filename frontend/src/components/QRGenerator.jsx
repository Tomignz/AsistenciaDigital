import { useState, useRef } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { motion, AnimatePresence } from 'framer-motion';

const QRGenerator = () => {
  const [qrId, setQrId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const qrRef = useRef();

  const handleSubmit = () => {
    console.log('handleSubmit ejecutado');
    const newQr = `qr-${Math.floor(Math.random() * 100000)}`;
    setQrId(newQr);
    setShowModal(true);
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${qrId}.png`;
    a.click();
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/asistencia/${qrId}`;
    navigator.clipboard.writeText(link);
    alert('¡Enlace copiado al portapapeles!');
  };

  return (
    <div className="text-center">
      <button
        className="bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
        onClick={handleSubmit}
      >
        Generar Código QR
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-md text-center shadow-xl relative"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <h2 className="text-xl font-semibold mb-4">Código QR generado</h2>
              <div ref={qrRef} className="flex justify-center">
                <QRCode value={qrId} size={200} />
              </div>
              <p className="mt-4 text-gray-700 break-all">
                Enlace: {window.location.origin}/asistencia/{qrId}
              </p>
              <div className="flex gap-2 justify-center mt-4">
                <button
                  onClick={handleCopyLink}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Copiar enlace
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
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
