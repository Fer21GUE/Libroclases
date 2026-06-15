package cl.colegio.bff.dto;

import java.math.BigDecimal;
import java.util.List;

public record AlumnoDashboardResponse(
        PerfilDto alumno,
        List<NotaDto> notas,
        List<AsistenciaDto> asistencia,
        List<MensajeDto> mensajes,
        List<EvaluacionDto> proximasEvaluaciones,
        BigDecimal promedioGeneral,
        BigDecimal porcentajeAsistencia
) {}
