package cl.colegio.bff.dto;

public record AsistenciaCreateInternalRequest(
        Long alumnoId,
        Long cursoId,
        Long profesorId,
        String fecha,
        String estado,
        String observacion,
        Boolean presente
) {}
