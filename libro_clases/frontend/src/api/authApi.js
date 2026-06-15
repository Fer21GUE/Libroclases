import { apiRequest } from './apiClient.js';
export const loginRequest = (email, password) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
