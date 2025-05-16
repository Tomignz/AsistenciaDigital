// src/pages/QRScanView.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AttendanceForm from '../components/AttendanceForm';

const QRScanView = () => {
  const { qrId } = useParams();
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);

  const handleAttendance = (name) => {
    console.log(`Asistencia registrada para: ${name}`);
    setRegistered(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-black text-white"
    >
      <motion.div
        className="p-8 rounded-lg bg-gray-800 w-96"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-xl font-bold mb-4">Escanear QR para registrar asistencia</h2>
        <div className="text-center mb-4">
          <p>QR ID: {qrId}</p>
        </div>
        {!registered ? (
          <AttendanceForm onSubmit={handleAttendance} />
        ) : (
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-green-500 font-semibold">¡Asistencia registrada con éxito!</p>
            <motion.button
              className="mt-4 bg-white text-black px-4 py-2 rounded-lg"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Regresar
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default QRScanView;
