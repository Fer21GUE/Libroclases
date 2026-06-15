package cl.colegio.bff.dto;

public record AsistenciaDto(
        Long id,
        Long alumnoId,
        String alumnoNombre,
        Long cursoId,
        String cursoNombre,
        Long profesorId,
        String profesorNombre,
        String fecha,
        String estado,
        Boolean presente,
        String observacion,
        String registradoEn
) {}
