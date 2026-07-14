import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  loginRequest
} from '../api/authApi.js';

import {
  getUserStatus
} from '../api/usersApi.js';

const AuthContext = createContext();

function getRouteByRole(rol) {
  const role = (rol || '')
    .toLowerCase();

  if (role === 'admin') {
    return '/admin';
  }

  if (role === 'profesor') {
    return '/profesor';
  }

  if (role === 'alumno') {
    return '/alumno';
  }

  if (role === 'apoderado') {
    return '/apoderado';
  }

  return '/';
}

function getSavedUser() {
  const savedUser =
    localStorage.getItem(
      'schoolbook_user'
    );

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem(
      'schoolbook_user'
    );

    return null;
  }
}

export function AuthProvider({
  children
}) {
  const [user, setUser] =
    useState(getSavedUser);

  const [token, setToken] =
    useState(() =>
      localStorage.getItem(
        'schoolbook_token'
      )
    );

  const [loading, setLoading] =
    useState(false);

  const logout = () => {
    localStorage.removeItem(
      'schoolbook_token'
    );

    localStorage.removeItem(
      'schoolbook_user'
    );

    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (!user?.id || !token) {
      return undefined;
    }

    let mounted = true;

    const verificarEstado = async () => {
      try {
        const response =
          await getUserStatus(user.id);

        if (
          mounted &&
          response.activo === false
        ) {
          logout();
        }
      } catch (error) {
        console.error(
          'No fue posible verificar el estado del usuario:',
          error
        );
      }
    };

    verificarEstado();

    const intervalId = window.setInterval(
      verificarEstado,
      10000
    );

    const verificarAlVolver = () => {
      verificarEstado();
    };

    window.addEventListener(
      'focus',
      verificarAlVolver
    );

    return () => {
      mounted = false;

      window.clearInterval(intervalId);

      window.removeEventListener(
        'focus',
        verificarAlVolver
      );
    };
  }, [
    user?.id,
    token
  ]);

  const login = async (
    email,
    password,
    rolEsperado
  ) => {
    setLoading(true);

    try {
      const data = await loginRequest(
        email,
        password
      );

      const userData = {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
        token: data.token
      };

      if (
        rolEsperado &&
        data.rol?.toLowerCase() !==
          rolEsperado.toLowerCase()
      ) {
        return {
          success: false,
          error:
            `Este usuario no corresponde al rol seleccionado: ${rolEsperado}`
        };
      }

      localStorage.setItem(
        'schoolbook_token',
        data.token
      );

      localStorage.setItem(
        'schoolbook_user',
        JSON.stringify(userData)
      );

      setToken(data.token);
      setUser(userData);

      return {
        success: true,
        user: userData,
        redirectTo:
          getRouteByRole(userData.rol)
      };
    } catch (error) {
      console.error(
        'Error en login:',
        error
      );

      return {
        success: false,
        error:
          error.message ||
          'Error de conexión con el servidor'
      };
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout
    }),
    [
      user,
      token,
      loading
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth debe usarse dentro de AuthProvider'
    );
  }

  return context;
};