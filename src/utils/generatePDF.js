// src/utils/generatePDF.js
import { jsPDF } from 'jspdf';

export const generatePDF = (attendance) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("Reporte de Asistencias", 14, 22);

  doc.setFontSize(12);
  doc.text("Fecha: " + new Date().toLocaleDateString(), 14, 30);

  let y = 40;
  attendance.forEach((record) => {
    doc.text(`${record.name} - ${record.date}`, 14, y);
    y += 10;
  });

  doc.save("reporte_asistencias.pdf");
};
