import { apiRequest } from './apiClient.js';

export const getUsers = () => apiRequest('/users');

export const createUser = (payload) => apiRequest('/users', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const deleteUser = (id) => apiRequest(`/users/${id}`, {
  method: 'DELETE'
});