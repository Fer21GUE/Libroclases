import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { loginRequest } from '../api/authApi.js';

const AuthContext = createContext();

function getRouteByRole(rol) {
  const role = (rol || '').toLowerCase();

  if (role === 'admin') return '/admin';
  if (role === 'profesor') return '/profesor';
  if (role === 'alumno') return '/alumno';
  if (role === 'apoderado') return '/apoderado';

  return '/';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('schoolbook_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('schoolbook_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email, password, rolEsperado) => {
    setLoading(true);

    try {
      const data = await loginRequest(email, password);

      const userData = {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
        token: data.token
      };

      if (rolEsperado && data.rol?.toLowerCase() !== rolEsperado.toLowerCase()) {
        return {
          success: false,
          error: `Este usuario no corresponde al rol seleccionado: ${rolEsperado}`
        };
      }

      localStorage.setItem('schoolbook_token', data.token);
      localStorage.setItem('schoolbook_user', JSON.stringify(userData));

      setUser(userData);

      return {
        success: true,
        user: userData,
        redirectTo: getRouteByRole(userData.rol)
      };
    } catch (error) {
      console.error('Error en login:', error);

      return {
        success: false,
        error: error.message || 'Error de conexiÃ³n con el servidor'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('schoolbook_token');
    localStorage.removeItem('schoolbook_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
};