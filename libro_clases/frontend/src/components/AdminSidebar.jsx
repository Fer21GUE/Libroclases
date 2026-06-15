import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const items = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/usuarios', label: 'Usuarios' },
  { path: '/admin/cursos', label: 'Cursos' },
  { path: '/admin/asignaciones', label: 'Asignaciones' }
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <p className="sidebar-kicker">Administrador</p>
        <h2>Colegio Bernardo O&apos;Higgins</h2>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </aside>
  );
}
