package cl.colegio.bff.dto;

import java.math.BigDecimal;
import java.util.List;

public record AlumnoDetalleResponse(
        AlumnoDto alumno,
        List<NotaDto> notas,
        List<AsistenciaDto> asistencia,
        List<EvaluacionDto> proximasEvaluaciones,
        BigDecimal promedioGeneral,
        BigDecimal porcentajeAsistencia
) {}
