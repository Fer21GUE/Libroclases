import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function RoleLayout({ title, subtitle, summaryCards = [], children }) {
  const { user } = useAuth();

  return (
    <div className="role-page">
      <div className="role-hero">
        <span className="hero-badge">Colegio Bernardo O&apos;Higgins</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {user && <small className="text-light opacity-75">Sesión iniciada como: {user.nombre}</small>}
      </div>

      {summaryCards.length > 0 && (
        <div className="row g-4 mb-4">
          {summaryCards.map((card) => (
            <div className="col-md-6 col-xl-3" key={card.label}>
              <div className="role-stat-card h-100">
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <small>{card.helper}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
