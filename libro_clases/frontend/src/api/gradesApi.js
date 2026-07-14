import {
  apiRequest
} from './apiClient.js';

export const getNotasProfesorCurso = (
  profesorUsuarioId,
  cursoId,
  asignatura
) =>
  apiRequest(
    `/grades/profesor-usuario/${profesorUsuarioId}/curso/${cursoId}?asignatura=${encodeURIComponent(asignatura)}`
  );

export const updateNotaProfesor = (
  notaId,
  payload
) =>
  apiRequest(
    `/grades/${notaId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload)
    }
  );