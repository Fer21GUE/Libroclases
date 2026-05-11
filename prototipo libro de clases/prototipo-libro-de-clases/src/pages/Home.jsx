import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content text-center">
            <h1>Colegio Bernardo O'Higgins</h1>
            <p>
              Plataforma base de libro de clases digital para gestionar información
              académica de alumnos, profesores, apoderados y administración.
            </p>
            <div className="hero-actions">
              <button className="btn-base btn-primary" onClick={() => navigate('/login')}>
                Ingresar al sistema
              </button>
              <a
                className="btn-base btn-secondary-custom text-decoration-none"
                href=""
                target="_blank"
                rel="noreferrer"
              >
                Historia del colegio
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container institutional-grid">
        <div className="feature-card">
          <h3>Nombre del establecimiento</h3>
          <p>Colegio Bernardo O&apos;Higgins de Coquimbo.</p>
        </div>
        <div className="feature-card">
          <h3>Director</h3>
          <p>Wilson I. Puelles Jopia.</p>
        </div>
        <div className="feature-card">
          <h3>Historia del colegio</h3>
          <p>Historia del colegio</p>
        </div>
      </section>
    </div>
  );
}
