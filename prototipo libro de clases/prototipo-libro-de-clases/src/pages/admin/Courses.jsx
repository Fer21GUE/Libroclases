import React from 'react';
import AdminPageLayout from '../../components/AdminLayout.jsx';

export default function Courses() {
  return (
    <AdminPageLayout title="Gestión de cursos">
      <div className="content-section">
        <h2>Cursos creados</h2>
      </div>

      <div className="content-section">
        <h2>Formulario base</h2>
        <div className="role-card" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="row g-3">
            <div className="col-md-4">
              <input className="form-control" placeholder="Nombre del curso" />
            </div>
            <div className="col-md-4">
              <input className="form-control" placeholder="Profesor jefe" />
            </div>
            <div className="col-md-4">
              <input className="form-control" placeholder="Cantidad de alumnos" />
            </div>
            <div className="col-12">
              <button className="btn-base btn-primary">Crear curso</button>
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}
