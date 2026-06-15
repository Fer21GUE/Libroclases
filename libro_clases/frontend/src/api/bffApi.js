import { apiRequest } from './apiClient.js';

export const getAdminDashboard = () => apiRequest('/bff/admin/dashboard');

export const getProfesorDashboard = (usuarioId) => apiRequest(`/bff/profesor/${usuarioId}/dashboard`);
export const getCursoAlumnos = (cursoId) => apiRequest(`/bff/profesor/cursos/${cursoId}/alumnos`);
export const crearNotaProfesor = (payload) => apiRequest('/bff/profesor/notas', {
  method: 'POST',
  body: JSON.stringify(payload)
});
export const registrarAsistenciaProfesor = (payload) => apiRequest('/bff/profesor/asistencia', {
  method: 'POST',
  body: JSON.stringify(payload)
});
export const crearEvaluacionProfesor = (payload) => apiRequest('/bff/profesor/evaluaciones', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const getAlumnoDashboard = (usuarioId) => apiRequest(`/bff/alumno/${usuarioId}/dashboard`);
export const marcarMensajeLeido = (mensajeId) => apiRequest(`/bff/alumno/mensajes/${mensajeId}/leer`, {
  method: 'PUT',
  body: JSON.stringify({})
});

export const getApoderadoDashboard = (usuarioId) => apiRequest(`/bff/apoderado/${usuarioId}/dashboard`);
export const getDetalleAlumnoApoderado = (usuarioId, alumnoId) => apiRequest(`/bff/apoderado/${usuarioId}/alumno/${alumnoId}/detalle`);
