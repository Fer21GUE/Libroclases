import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function AdminLayout({ children, title }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className="sidebar-link">Dashboard</Link>
          <Link to="/admin/usuarios" className="sidebar-link">Usuarios</Link>
          <Link to="/admin/cursos" className="sidebar-link">Cursos</Link>
          <Link to="/admin/asignaciones" className="sidebar-link">Asignaciones</Link>
        </nav>
        <button onClick={handleLogout} className="sidebar-logout">Cerrar sesión</button>
      </aside>
      <main className="admin-main">
        <div className="admin-header">
          <h1>{title}</h1>
        </div>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}