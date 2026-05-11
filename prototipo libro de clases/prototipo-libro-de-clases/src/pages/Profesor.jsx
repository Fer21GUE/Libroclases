import React from 'react';
import RoleLayout from './roles/RoleLayout.jsx';

export default function Profesor() {
  return (
    <RoleLayout
      title="Panel de profesor"
      subtitle="Vista del libro digital usuario profesor."
      summaryCards={[
        { label: 'Cursos asignados', value: '8', helper: 'Activos este semestre' },
        { label: 'Clases del día', value: '5', helper: '' },
        { label: 'Mensajes nuevos', value: '3', helper: 'Pendientes de revisar' },
        { label: 'Anotaciones', value: '8', helper: 'Registradas esta semana' }
      ]}
    >
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="role-card">
            <h3>Listado de cursos asignados</h3>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="role-card h-100">
            <h3>Mensajería</h3>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="role-card">
            <h3>Libro de notas y asistencia</h3>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="role-card h-100">
            <h3>Anotaciones recientes</h3>
          </div>
        </div>
      </div>
    </RoleLayout>
  );
}