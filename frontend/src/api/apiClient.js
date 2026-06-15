const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('schoolbook_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || 'Error de comunicación con el servidor.');
  }

  return data;
}