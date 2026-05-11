import React from 'react';
import RoleLayout from './roles/RoleLayout.jsx';

export default function Apoderado() {
  return (
    <RoleLayout
      title="Panel de apoderado"
      subtitle="Vista libro digtal usuario apoderado."
      summaryCards={[
        { label: 'Estudiante asociado', value: '1', helper: 'Matías Rojas' },
        { label: 'Promedio', value: '6.0', helper: 'Promedio actual' },
        { label: 'Asistencia', value: '94%', helper: 'Acumulada' },
        { label: 'Solicitudes acedemicas', value: '2', helper: 'En proceso' }
      ]}
    >
      <div className="row g-4">

        <div className="col-lg-6">
          <div className="role-card">
            <h3>Notas del alumno</h3>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="role-card h-100">
            <h3>Mensajes</h3>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="role-card h-100">
            <h3>Asistencia del alumno</h3>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="role-card h-100">
            <h3>Solicitudes académicas</h3>
          </div>
        </div>

      </div>
    </RoleLayout>
  );
}