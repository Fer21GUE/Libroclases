import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false);
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  const getRoleBadgeClass = () => {
    if (!user) return '';
    switch (user.rol) {
      case 'admin': return 'badge-admin';
      case 'profesor': return 'badge-profesor';
      case 'alumno': return 'badge-alumno';
      case 'apoderado': return 'badge-apoderado';
      default: return '';
    }
  };

  const getRoleName = () => {
    if (!user) return '';
    switch (user.rol) {
      case 'admin': return 'Administrador';
      case 'profesor': return 'Profesor';
      case 'alumno': return 'Alumno';
      case 'apoderado': return 'Apoderado';
      default: return '';
    }
  };

  return (
    <BootstrapNavbar expand="lg" fixed="top" className="school-navbar">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="brand-title" onClick={handleNavClick}>
          Colegio Bernardo O'Higgins
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle 
          aria-controls="main-navbar-nav" 
          onClick={() => setExpanded(!expanded)}
        />
        
        <BootstrapNavbar.Collapse id="main-navbar-nav" in={expanded}>
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" onClick={handleNavClick}>
              Inicio
            </Nav.Link>
            
            {!user && (
              <Dropdown>
                <Dropdown.Toggle variant="link" className="nav-link">
                  Acceder
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => navigate('/login/alumno')}>Alumno</Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate('/login/profesor')}>Profesor</Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate('/login/apoderado')}>Apoderado</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => navigate('/login/admin')}>Administrador</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}

            {user && user.rol === 'admin' && (
              <Nav.Link as={Link} to="/admin" onClick={handleNavClick}>
                Admin Panel
              </Nav.Link>
            )}
          </Nav>

          {user && (
            <div className="nav-user-info">
              <span className={`user-role-badge ${getRoleBadgeClass()}`}>
                {getRoleName()}
              </span>
              <span className="user-name">{user.nombre}</span>
              <Button 
                variant="outline-light" 
                size="sm" 
                onClick={handleLogout}
                className="logout-btn"
              >
                Salir
              </Button>
            </div>
          )}
        </BootstrapNavbar.Collapse>
      </Container>

      <style>{`
        .school-navbar {
          background: linear-gradient(135deg, #0b2b40 0%, #1a4a6f 100%);
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 0.75rem 0;
        }
        
        .brand-title {
          font-weight: 700;
          font-size: 1.25rem;
          letter-spacing: 0.5px;
          color: white !important;
          text-decoration: none;
        }
        
        .school-navbar .nav-link {
          color: rgba(255,255,255,0.85) !important;
          font-weight: 500;
          transition: all 0.2s;
          margin: 0 0.25rem;
        }
        
        .school-navbar .nav-link:hover {
          color: white !important;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
        }
        
        .dropdown-menu {
          background: white;
          border: none;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.15);
          margin-top: 0.5rem;
        }
        
        .dropdown-item {
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        
        .dropdown-item:hover {
          background: #f8f9fa;
          color: #1a4a6f;
        }
        
        .nav-user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-left: 1rem;
          padding-left: 1rem;
          border-left: 1px solid rgba(255,255,255,0.2);
        }
        
        .user-role-badge {
          font-size: 0.7rem;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-weight: 600;
        }
        
        .user-role-badge.badge-admin {
          background: #dc2626;
          color: white;
        }
        
        .user-role-badge.badge-profesor {
          background: #3b82f6;
          color: white;
        }
        
        .user-role-badge.badge-alumno {
          background: #10b981;
          color: white;
        }
        
        .user-role-badge.badge-apoderado {
          background: #f59e0b;
          color: white;
        }
        
        .user-name {
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .logout-btn {
          border-color: rgba(255,255,255,0.3);
          color: white;
          font-size: 0.8rem;
          padding: 0.25rem 0.75rem;
        }
        
        .logout-btn:hover {
          background: white;
          color: #1a4a6f;
          border-color: white;
        }
        
        @media (max-width: 992px) {
          .nav-user-info {
            margin-left: 0;
            padding-left: 0;
            border-left: none;
            margin-top: 1rem;
            justify-content: space-between;
          }
        }
      `}</style>
    </BootstrapNavbar>
  );
}