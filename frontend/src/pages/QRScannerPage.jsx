import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useLocation, useNavigate } from 'react-router-dom';
import { authenticatedFetch } from '../utils/api';

const QRScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const scannerRef = useRef(null);
  const hasProcessedUrlSessionId = useRef(false);

  const QR_READER_ELEMENT_ID = 'qr-reader';

  const handleRegisterAttendance = async (sessionId) => {
    if (!sessionId) {
      setMessage('ID de sesión inválido.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await authenticatedFetch('/api/asistencias/scan', {
        method: 'POST',
        body: { sessionId },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Asistencia registrada exitosamente!');
        setScanResult(`Éxito para sesión: ${sessionId}`); 
      } else {
        setMessage(data.message || 'Error al registrar asistencia.');
      }
    } catch (error) {
      console.error('Error during attendance registration:', error);
      setMessage('Error de conexión o del servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasProcessedUrlSessionId.current) {
      const queryParams = new URLSearchParams(location.search);
      const sessionIdFromUrl = queryParams.get('sessionId');
      if (sessionIdFromUrl) {
        console.log(`SessionID from URL: ${sessionIdFromUrl}`);
        setScanResult(`SessionID from URL: ${sessionIdFromUrl}`);
        handleRegisterAttendance(sessionIdFromUrl);
        hasProcessedUrlSessionId.current = true;
      }
    }
    
    if (!scannerRef.current && !hasProcessedUrlSessionId.current && document.getElementById(QR_READER_ELEMENT_ID)) {
      const scanner = new Html5QrcodeScanner(
        QR_READER_ELEMENT_ID,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          supportedScanTypes: [0], // SCAN_TYPE_CAMERA
        },
        false // verbose
      );

      const onScanSuccess = (decodedText, decodedResult) => {
        console.log(`Scan successful: ${decodedText}`, decodedResult);
        setMessage('Procesando asistencia...');
        
        try {
          const url = new URL(decodedText);
          const sessionId = url.searchParams.get('sessionId');
          if (sessionId) {
            setScanResult(decodedText);
            handleRegisterAttendance(sessionId);
          } else {
            setMessage('Código QR inválido: No se encontró sessionId.');
          }
        } catch (error) {
          console.error('Error parsing QR code URL:', error);
          setMessage('Código QR no es una URL válida.');
        }
        
        if (scannerRef.current) {
            scannerRef.current.clear().catch(error => {
                console.error("Failed to clear scanner:", error);
            });
        }
      };

      const onScanFailure = (error) => {
        // Can be noisy, handle selectively or ignore
      };

      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        // Check if clear method exists before calling
        if (typeof scannerRef.current.clear === 'function') {
            scannerRef.current.clear().catch(error => {
                console.error("Failed to clear scanner on unmount:", error);
            });
        }
        scannerRef.current = null;
      }
    };
  }, [location.search]);

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold text-center my-6 dark:text-white">Escanear Código QR</h1>
      
      {!hasProcessedUrlSessionId.current && (
        <div id={QR_READER_ELEMENT_ID} style={{ width: '100%', margin: 'auto' }}></div>
      )}

      {isLoading && (
        <p className="text-center text-blue-500 dark:text-blue-400 mt-4">Procesando...</p>
      )}
      
      {message && (
        <div className={`mt-4 p-3 rounded text-center font-semibold ${message.includes('Error') || message.includes('inválido') || message.includes('expirado') || message.includes('Ya te has registrado') ? 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100' : 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100'}`}>
          {message}
        </div>
      )}

      {scanResult && (message.includes('Éxito') || message.includes('exitosa')) && (
        <div className="mt-4 text-center">
          <p className="text-gray-700 dark:text-gray-300">Último escaneo/URL procesado con éxito:</p>
          <p className="font-mono break-all text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">{scanResult}</p>
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg shadow transition-colors"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default QRScannerPage;
