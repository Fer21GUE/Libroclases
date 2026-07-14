import { apiRequest } from './apiClient.js';

export const getCourses = () =>
  apiRequest('/courses');

export const createCourse = (payload) =>
  apiRequest('/courses', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const deleteCourse = (cursoId) =>
  apiRequest(`/courses/${cursoId}`, {
    method: 'DELETE'
  });

export const getProfesores = () =>
  apiRequest('/courses/profesores');

export const getAlumnos = () =>
  apiRequest('/courses/alumnos');

export const getApoderados = () =>
  apiRequest('/courses/apoderados');

export const getAsignaturas = () =>
  apiRequest('/courses/asignaturas');

export const getAsignaturasPorProfesor = (
  profesorId
) =>
  apiRequest(
    `/courses/profesores/${profesorId}/asignaturas`
  );

export const getAsignaciones = () =>
  apiRequest('/courses/asignaciones');

export const getAsignacionesAlumnos = () =>
  apiRequest(
    '/courses/asignaciones-alumnos'
  );

export const getAsignacionesApoderados = () =>
  apiRequest(
    '/courses/asignaciones-apoderados'
  );

export const asignarProfesor = (payload) =>
  apiRequest('/courses/asignar-profesor', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const asignarAlumno = (payload) =>
  apiRequest('/courses/asignar-alumno', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const asignarApoderado = (payload) =>
  apiRequest('/courses/asignar-apoderado', {
    method: 'POST',
    body: JSON.stringify(payload)
  });