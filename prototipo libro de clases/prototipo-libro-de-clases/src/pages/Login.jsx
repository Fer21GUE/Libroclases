import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);

    setLoading(false);

    if (result.success) {
      navigate(result.redirectTo);
      return;
    }

    setError(result.error);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-form-side">
          <h2>Inicio de sesión</h2>

          <form onSubmit={onSubmit} className="auth-form">
            <div className="form-group-custom">
              <label htmlFor="email">Correo</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@colegio.cl"
                autoComplete="username"
              />
            </div>

            <div className="form-group-custom">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                autoComplete="current-password"
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="btn-base btn-primary btn-full" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <div className="auth-info-side">
          <div className="auth-info-content">
            <h3>Libro de clases digital</h3>
            <p>
              Acceso a informacion academica.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
