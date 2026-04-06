import React, { createContext, useContext, useMemo, useState } from 'react';
import { DEMO_USERS } from '../data/demoUsers.js';

const AuthContext = createContext();

const STORAGE_USER_KEY = 'schoolbook_user';
const STORAGE_TOKEN_KEY = 'schoolbook_token';

function getRouteByRole(role) {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'profesor':
      return '/profesor';
    case 'alumno':
      return '/alumno';
    case 'apoderado':
      return '/apoderado';
    default:
      return '/';
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
      localStorage.setItem(STORAGE_TOKEN_KEY, `demo-${nextUser.rol}`);
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    }
  };

  const login = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    const users = [
      DEMO_USERS.admin,
      DEMO_USERS.profesor,
      DEMO_USERS.alumno,
      DEMO_USERS.apoderado
    ];

    const matchedUser = users.find(
      (u) =>
        u &&
        u.email.toLowerCase() === normalizedEmail &&
        u.password === normalizedPassword
    );

    if (!matchedUser) {
      return {
        success: false,
        error: 'Credenciales inválidas.'
      };
    }

    persistUser(matchedUser);

    return {
      success: true,
      user: matchedUser,
      redirectTo: getRouteByRole(matchedUser.rol)
    };
  };

  const logout = () => persistUser(null);

  const isAuthenticated = () => !!user && !!localStorage.getItem(STORAGE_TOKEN_KEY);
  const isAdmin = () => user?.rol === 'admin';

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    getRouteByRole
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};