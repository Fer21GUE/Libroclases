import { apiRequest } from './apiClient.js';

export const getUsers = () =>
  apiRequest('/users');

export const createUser = (payload) =>
  apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const updateUserActive = (
  usuarioId,
  activo
) =>
  apiRequest(`/users/${usuarioId}/activo`, {
    method: 'PATCH',
    body: JSON.stringify({
      activo
    })
  });

export const getUserStatus = (
  usuarioId
) =>
  apiRequest(`/users/${usuarioId}/estado`);