import React from 'react';
import RoleLayout from './roles/RoleLayout.jsx';

export default function Alumno() {
  return (
    <RoleLayout
      title="Panel de alumno"
      subtitle="Vista libro digital usuario alumno."
      summaryCards={[
        { label: 'Promedio general', value: '6.0', helper: 'Actualizado al último registro' },
        { label: 'Asistencia', value: '94%', helper: 'Promedio acumulado' },
        { label: 'Mensajes', value: '3', helper: 'No leídos' },
        { label: 'Próxima evaluación', value: '02/04', helper: 'Matemática' }
      ]}
    >
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="role-card">
            <h3>Notas personales</h3>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="role-card h-100">
            <h3>Mensajes</h3>
          </div>
        </div>

        <div className="col-12">
          <div className="role-card">
            <h3>Asistencia</h3>
          </div>
        </div>
      </div>
    </RoleLayout>
  );
}