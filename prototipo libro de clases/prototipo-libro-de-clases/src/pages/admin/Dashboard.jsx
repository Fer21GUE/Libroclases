import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageLayout from '../../components/AdminLayout.jsx';

export default function Dashboard() {
  const navigate = useNavigate();

  const headerActions = (
    <div className="header-button-group">
      <button className="btn-base btn-primary" onClick={() => navigate('/admin/usuarios')}>
        Gestionar usuarios
      </button>
      <button className="btn-base btn-secondary-custom" onClick={() => navigate('/admin/cursos')}>
        Ver cursos
      </button>
    </div>
  );

  return (
    <AdminPageLayout title="Dashboard administrador" headerActions={headerActions}>
      <section className="content-section">
        <h2>Resumen general</h2>
        <div className="stats-grid">
          <div className="stat-card"><span>Usuarios</span><strong>300</strong><small>Alumnos, profesores y apoderados</small></div>
          <div className="stat-card"><span>Cursos</span><strong>33</strong><small>Activos en el sistema</small></div>
          <div className="stat-card"><span>Solicitudes</span><strong>9</strong><small>Pendientes de revisión</small></div>
        </div>
      </section>

    </AdminPageLayout>
  );
}
