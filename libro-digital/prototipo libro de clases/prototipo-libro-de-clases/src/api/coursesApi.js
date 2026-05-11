import { apiRequest } from './apiClient.js';
export const getCourses = () => apiRequest('/courses');
export const createCourse = (payload) => apiRequest('/courses', { method: 'POST', body: JSON.stringify(payload) });
export const getProfesores = () => apiRequest('/courses/profesores');
export const getAsignaciones = () => apiRequest('/courses/asignaciones');
export const asignarProfesor = (payload) => apiRequest('/courses/asignar-profesor', { method: 'POST', body: JSON.stringify(payload) });
