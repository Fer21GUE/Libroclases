import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Profesor from './pages/Profesor.jsx';
import Alumno from './pages/Alumno.jsx';
import Apoderado from './pages/Apoderado.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Users from './pages/admin/Users.jsx';
import Courses from './pages/admin/Courses.jsx';
import Assignments from './pages/admin/Assignments.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); }, [pathname]);
  return null;
}

const PublicLayout = ({ children }) => (
  <div className="app-shell">
    <Navbar />
    <ScrollToTop />
    <main className="app-main">{children}</main>
  </div>
);

const AdminShell = ({ children }) => (
  <div className="admin-shell">
    <ScrollToTop />
    {children}
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/profesor" element={<PublicLayout><ProtectedRoute allowedRoles={['profesor']}><Profesor /></ProtectedRoute></PublicLayout>} />
        <Route path="/alumno" element={<PublicLayout><ProtectedRoute allowedRoles={['alumno']}><Alumno /></ProtectedRoute></PublicLayout>} />
        <Route path="/apoderado" element={<PublicLayout><ProtectedRoute allowedRoles={['apoderado']}><Apoderado /></ProtectedRoute></PublicLayout>} />

        <Route path="/admin" element={<AdminShell><ProtectedRoute requireAdmin={true}><Dashboard /></ProtectedRoute></AdminShell>} />
        <Route path="/admin/usuarios" element={<AdminShell><ProtectedRoute requireAdmin={true}><Users /></ProtectedRoute></AdminShell>} />
        <Route path="/admin/cursos" element={<AdminShell><ProtectedRoute requireAdmin={true}><Courses /></ProtectedRoute></AdminShell>} />
        <Route path="/admin/asignaciones" element={<AdminShell><ProtectedRoute requireAdmin={true}><Assignments /></ProtectedRoute></AdminShell>} />
      </Routes>
    </AuthProvider>
  );
}
