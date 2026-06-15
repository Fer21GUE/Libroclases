import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageLayout from '../../components/AdminLayout.jsx';
import { getAdminDashboard } from '../../api/bffApi.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ totalUsuarios: 0, totalCursos: 0, totalNotas: 0, solicitudesPendientes: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminDashboard().then(setSummary).catch((e) => setError(e.message));
  }, []);

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
        {error && <div className="form-error">{error}</div>}
        <div className="stats-grid">
          <div className="stat-card"><span>Usuarios</span><strong>{summary.totalUsuarios}</strong><small>Alumnos, profesores y apoderados</small></div>
          <div className="stat-card"><span>Cursos</span><strong>{summary.totalCursos}</strong><small>Activos en el sistema</small></div>
          <div className="stat-card"><span>Notas</span><strong>{summary.totalNotas}</strong><small>Registradas en grades-service</small></div>
          <div className="stat-card"><span>Solicitudes</span><strong>{summary.solicitudesPendientes}</strong><small>Pendientes de revisión</small></div>
        </div>
      </section>
    </AdminPageLayout>
  );
}
