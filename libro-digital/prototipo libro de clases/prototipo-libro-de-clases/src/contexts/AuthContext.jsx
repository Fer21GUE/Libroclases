import React, { createContext, useContext, useMemo, useState } from 'react';

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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password, rolEsperado) => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rol: rolEsperado })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUser(data.user);
        return { 
          success: true, 
          user: data.user, 
          redirectTo: getRouteByRole(data.user.rol) 
        };
      }
      
      return { success: false, error: data.error || 'Credenciales inválidas' };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
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
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};