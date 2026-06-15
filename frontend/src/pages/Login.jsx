import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('alumno');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { id: 'alumno', label: 'Alumno', icon: 'fa-graduation-cap', color: '#10b981' },
    { id: 'profesor', label: 'Profesor', icon: 'fa-chalkboard-user', color: '#3b82f6' },
    { id: 'apoderado', label: 'Apoderado', icon: 'fa-users', color: '#f59e0b' },
    { id: 'admin', label: 'Administrador', icon: 'fa-user-shield', color: '#dc2626' }
  ];

  const getPlaceholderByRole = () => {
    switch (selectedRole) {
      case 'alumno': return 'Ingresa tu RUT o correo';
      case 'profesor': return 'nombre@colegio.cl';
      case 'apoderado': return 'apoderado@email.com';
      case 'admin': return 'admin@colegio.cl';
      default: return 'usuario@colegio.cl';
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password, selectedRole);
    setLoading(false);

    if (result.success) {
      navigate(result.redirectTo);
      return;
    }

    setError(result.error);
  };

  return (
    <div className="login-page-modern">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <h1>Colegio Bernardo O'Higgins</h1>
              <p>Libro de Clases Digital</p>
            </div>
          </div>

          <div className="role-selector">
            {roles.map((role) => (
              <button
                key={role.id}
                className={`role-btn ${selectedRole === role.id ? 'active' : ''}`}
                onClick={() => setSelectedRole(role.id)}
                style={{ '--role-color': role.color }}
              >
                <i className={`fas ${role.icon}`}></i>
                <span>{role.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="login-form">
            <div className="input-group">
              <label>Correo electrónico o RUT</label>
              <div className="input-icon">
                <i className="fas fa-envelope"></i>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={getPlaceholderByRole()}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <div className="input-icon">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" /> Recordarme
              </label>
              <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <><i className="fas fa-spinner fa-spin"></i> Ingresando...</>
              ) : (
                <><i className="fas fa-sign-in-alt"></i> Ingresar al Sistema</>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>¿Eres nuevo en el colegio?</p>
            <Link to="/admision" className="register-link">Solicitar Admisión →</Link>
          </div>
        </div>

        <div className="login-info">
          <div className="info-content">
            <i className="fas fa-chalkboard"></i>
            <h3>Plataforma Educativa</h3>
            <p>Accede a notas, asistencia, comunicados y más desde un solo lugar.</p>
            <div className="info-features">
              <div className="feature">
                <i className="fas fa-check-circle"></i>
                <span>Notas en tiempo real</span>
              </div>
              <div className="feature">
                <i className="fas fa-check-circle"></i>
                <span>Asistencia digital</span>
              </div>
              <div className="feature">
                <i className="fas fa-check-circle"></i>
                <span>Comunicados oficiales</span>
              </div>
              <div className="feature">
                <i className="fas fa-check-circle"></i>
                <span>Calendario escolar</span>
              </div>
            </div>
            <div className="info-testimonial">
              <i className="fas fa-quote-left"></i>
              <p>Comprometidos con la excelencia educativa desde 1976</p>
              <span>- Wilson I. Puelles Jopia, Director</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-page-modern {
          min-height: 100vh;
          background: linear-gradient(135deg, #0b2b40 0%, #1a4a6f 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .login-container {
          display: grid;
          grid-template-columns: 1fr 0.8fr;
          max-width: 1200px;
          width: 100%;
          background: white;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0,0,0,0.25);
        }

        .login-card {
          padding: 3rem;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-header h1 {
          font-size: 1.5rem;
          color: #0b2b40;
          margin-bottom: 0.5rem;
        }

        .login-header p {
          color: #6c757d;
        }

        .role-selector {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .role-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 2px solid #e9ecef;
          background: white;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
        }

        .role-btn i {
          font-size: 1.25rem;
          color: #6c757d;
        }

        .role-btn span {
          font-size: 0.8rem;
          color: #6c757d;
        }

        .role-btn.active {
          border-color: var(--role-color);
          background: rgba(107, 70, 193, 0.05);
        }

        .role-btn.active i,
        .role-btn.active span {
          color: var(--role-color);
        }

        .role-btn:hover {
          transform: translateY(-2px);
          border-color: var(--role-color);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-weight: 600;
          color: #0b2b40;
          font-size: 0.9rem;
        }

        .input-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon i {
          position: absolute;
          left: 1rem;
          color: #adb5bd;
          font-size: 1rem;
        }

        .input-icon input {
          width: 100%;
          padding: 0.9rem 1rem 0.9rem 2.8rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .input-icon input:focus {
          outline: none;
          border-color: #ffc107;
          box-shadow: 0 0 0 3px rgba(255,193,7,0.1);
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6c757d;
          cursor: pointer;
        }

        .forgot-password {
          color: #1a4a6f;
          text-decoration: none;
        }

        .forgot-password:hover {
          color: #ffc107;
        }

        .error-message {
          background: #fee;
          color: #dc2626;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
        }

        .login-btn {
          background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
          color: #0b2b40;
          border: none;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-footer {
          margin-top: 2rem;
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid #e9ecef;
        }

        .login-footer p {
          color: #6c757d;
          margin-bottom: 0.5rem;
        }

        .register-link {
          color: #1a4a6f;
          text-decoration: none;
          font-weight: 600;
        }

        .register-link:hover {
          color: #ffc107;
        }

        .login-info {
          background: linear-gradient(135deg, #0b2b40 0%, #1a4a6f 100%);
          padding: 3rem;
          color: white;
          display: flex;
          align-items: center;
        }

        .info-content {
          text-align: center;
        }

        .info-content i.fa-chalkboard {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .info-content h3 {
          font-size: 1.75rem;
          margin-bottom: 1rem;
        }

        .info-content p {
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .info-features {
          text-align: left;
          margin-bottom: 2rem;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .feature i {
          color: #ffc107;
        }

        .info-testimonial {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.2);
          font-style: italic;
        }

        .info-testimonial i {
          font-size: 2rem;
          opacity: 0.5;
          margin-bottom: 0.5rem;
        }

        .info-testimonial p {
          margin-bottom: 0.5rem;
        }

        .info-testimonial span {
          font-size: 0.85rem;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .login-container {
            grid-template-columns: 1fr;
          }
          
          .login-card {
            padding: 2rem;
          }
          
          .role-selector {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .login-info {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}