import PanelLayout from "../components/PanelLayout";

export default function ProfessorPanel() {
  return (
    <PanelLayout
         title="Sistema de Asistencia"
         subtitle="Genere códigos QR y vea estadísticas generales de asistencia"
       >
         <div className="border rounded-lg p-4">
           <h2 className="text-xl font-semibold mb-2">Generar Código QR</h2>
           <p className="text-sm text-gray-600 mb-4">
             Cree un código QR para que los alumnos marquen su asistencia
           </p>
           <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
             Generar Código QR
           </button>
         </div>
   
         <div className="border rounded-lg p-4">
           <h2 className="text-xl font-semibold mb-2">Ver Asistencias</h2>
           <p className="text-sm text-gray-600 mb-4">
             Consulte el registro de asistencias de todas las materias
           </p>
           <button className="bg-white border px-6 py-2 rounded hover:bg-gray-100">
             Ver Asistencias
           </button>
         </div>
   
         <div className="border rounded-lg p-4">
           <h2 className="text-xl font-semibold mb-4">Estadísticas Generales</h2>
           <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
             <li>Programación: 85% asistencia</li>
             <li>Matemática: 78% asistencia</li>
             <li>Sistemas: 92% asistencia</li>
           </ul>
         </div>
       </PanelLayout>
  );
}
