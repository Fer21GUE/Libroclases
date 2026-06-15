package cl.colegio.bff.dto;

import java.util.List;

public record ProfesorDashboardResponse(
        PerfilDto profesor,
        List<CursoDto> cursos,
        List<MensajeDto> mensajes,
        List<AnotacionDto> anotaciones,
        List<NotaDto> ultimasNotas,
        List<EvaluacionDto> proximasEvaluaciones,
        List<AsistenciaDto> asistencia
) {}
