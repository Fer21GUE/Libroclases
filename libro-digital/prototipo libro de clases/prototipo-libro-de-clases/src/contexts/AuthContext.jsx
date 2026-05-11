import React, { createContext, useContext, useMemo, useState } from 'react';
import { loginRequest } from '../api/authApi.js';

const AuthContext = createContext();
const STORAGE_USER_KEY = 'schoolbook_user';
const STORAGE_TOKEN_KEY = 'schoolbook_token';

function normalizeRole(role) { return (role || '').toLowerCase(); }
function getRouteByRole(role) {
  switch (normalizeRole(role)) {
    case 'admin': return '/admin';
    case 'profesor': return '/profesor';
    case 'alumno': return '/alumno';
    case 'apoderado': return '/apoderado';
    default: return '/';
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading] = useState(false);

  const persistUser = (nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(nextUser));
      localStorage.setItem(STORAGE_TOKEN_KEY, nextUser.token);
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await loginRequest(email.trim().toLowerCase(), password);
      const loggedUser = { ...data, rol: normalizeRole(data.rol) };
      persistUser(loggedUser);
      return { success: true, user: loggedUser, redirectTo: getRouteByRole(loggedUser.rol) };
    } catch (error) {
      return { success: false, error: error.message || 'Credenciales inválidas.' };
    }
  };

  const logout = () => persistUser(null);
  const isAuthenticated = () => !!user && !!localStorage.getItem(STORAGE_TOKEN_KEY);
  const isAdmin = () => normalizeRole(user?.rol) === 'admin';

  const value = useMemo(() => ({ user, loading, login, logout, isAuthenticated, isAdmin, getRouteByRole }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
