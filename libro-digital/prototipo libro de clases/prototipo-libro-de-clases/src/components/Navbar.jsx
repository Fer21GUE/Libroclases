import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const panelByRole = {
    admin: { label: 'Panel administrador', to: '/admin' },
    profesor: { label: 'Panel profesor', to: '/profesor' },
    alumno: { label: 'Panel alumno', to: '/alumno' },
    apoderado: { label: 'Panel apoderado', to: '/apoderado' }
  };

  const currentPanel = user ? panelByRole[user.rol] : null;

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" fixed="top" className="school-navbar">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="brand-title">
          Colegio Bernardo O&apos;Higgins
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="main-navbar-nav" />
        <BootstrapNavbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
            {currentPanel && <Nav.Link as={NavLink} to={currentPanel.to}>{currentPanel.label}</Nav.Link>}
          </Nav>

          {user && (
            <Nav className="align-items-center gap-2 nav-user-block">
              <span className="text-light small">{user.nombre}</span>
              <Button variant="outline-light" onClick={handleLogout}>Salir</Button>
            </Nav>
          )}
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}
