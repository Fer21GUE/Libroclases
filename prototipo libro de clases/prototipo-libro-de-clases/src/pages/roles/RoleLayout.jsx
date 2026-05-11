import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function RoleLayout({ title, subtitle, summaryCards = [], children }) {
  const { user } = useAuth();

  const getRoleIcon = () => {
    if (title.includes('alumno')) return '👨‍🎓';
    if (title.includes('apoderado')) return '👨‍👩‍👧';
    if (title.includes('profesor')) return '👨‍🏫';
    if (title.includes('Administrador')) return '👑';
    return '📚';
  };

  return (
    <div className="role-layout-modern">
      {/* Hero Section del Rol */}
      <div className="role-hero-modern">
        <div className="role-hero-overlay"></div>
        <div className="role-hero-container">
          <div className="role-icon">{getRoleIcon()}</div>
          <span className="role-badge">Colegio Bernardo O'Higgins</span>
          <h1 className="role-title">{title}</h1>
          <p className="role-subtitle">{subtitle}</p>
          {user && (
            <div className="user-info-badge">
              <span className="user-avatar">👤</span>
              <span className="user-name">Bienvenido, {user.nombre}</span>
            </div>
          )}
        </div>
      </div>

      {summaryCards.length > 0 && (
        <div className="summary-cards-container">
          <div className="container-modern">
            <div className="summary-cards-grid">
              {summaryCards.map((card, index) => (
                <div className="summary-card-modern" key={card.label}>
                  <div className="summary-card-icon">
                    {index === 0 && '📊'}
                    {index === 1 && '📅'}
                    {index === 2 && '💬'}
                    {index === 3 && '📋'}
                  </div>
                  <div className="summary-card-content">
                    <span className="summary-card-label">{card.label}</span>
                    <strong className="summary-card-value">{card.value}</strong>
                    {card.helper && <small className="summary-card-helper">{card.helper}</small>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="role-content">
        <div className="container-modern">
          {children}
        </div>
      </div>

      <style>{`
        .role-layout-modern {
          min-height: 100vh;
          background: #f8f9fa;
        }

        /* Hero Section Moderna para Roles */
        .role-hero-modern {
          position: relative;
          background: linear-gradient(135deg, #0b2b40 0%, #1a4a6f 100%);
          background-size: cover;
          background-position: center;
          padding: 3rem 0;
          margin-bottom: 2rem;
        }

        .role-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(11,43,64,0.92) 0%, rgba(26,74,111,0.88) 100%);
        }

        .role-hero-container {
          position: relative;
          z-index: 2;
          text-align: center;
          color: white;
          padding: 0 2rem;
        }

        .role-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: fadeInUp 0.5s ease;
        }

        .role-badge {
          display: inline-block;
          background: rgba(255,193,7,0.2);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.85rem;
          margin-bottom: 1rem;
          border: 1px solid rgba(255,193,7,0.4);
        }

        .role-title {
          font-size: clamp(1.8rem, 5vw, 2.8rem);
          font-weight: 800;
          margin: 0.5rem 0;
          animation: fadeInUp 0.5s ease 0.1s both;
        }

        .role-subtitle {
          font-size: 1.1rem;
          opacity: 0.95;
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.5s ease 0.2s both;
        }

        .user-info-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.15);
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.9rem;
          animation: fadeInUp 0.5s ease 0.3s both;
        }

        .user-avatar {
          font-size: 1.2rem;
        }

        .user-name {
          font-weight: 500;
        }

        /* Summary Cards Modernas */
        .summary-cards-container {
          position: relative;
          z-index: 3;
          margin-top: -1.5rem;
          margin-bottom: 2rem;
        }

        .summary-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .summary-card-modern {
          background: white;
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 5px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
        }

        .summary-card-modern:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
        }

        .summary-card-icon {
          font-size: 2rem;
          width: 55px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
        }

        .summary-card-content {
          flex: 1;
        }

        .summary-card-label {
          display: block;
          font-size: 0.85rem;
          color: #6c757d;
          margin-bottom: 0.25rem;
        }

        .summary-card-value {
          display: block;
          font-size: 1.8rem;
          font-weight: 800;
          color: #0b2b40;
          line-height: 1.2;
        }

        .summary-card-helper {
          display: block;
          font-size: 0.75rem;
          color: #adb5bd;
          margin-top: 0.25rem;
        }

        /* Contenido principal */
        .role-content {
          padding: 1rem 0 3rem;
        }

        .container-modern {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Animaciones */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .summary-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          
          .summary-card-modern {
            padding: 1rem;
          }
          
          .summary-card-icon {
            width: 45px;
            height: 45px;
            font-size: 1.5rem;
          }
          
          .summary-card-value {
            font-size: 1.4rem;
          }
          
          .container-modern {
            padding: 0 1rem;
          }
          
          .role-hero-container {
            padding: 0 1rem;
          }
        }

        @media (max-width: 576px) {
          .summary-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}