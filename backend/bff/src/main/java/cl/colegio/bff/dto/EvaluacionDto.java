package cl.colegio.bff.dto;

public record EvaluacionDto(
        Long id,
        Long cursoId,
        String cursoNombre,
        Long profesorId,
        String asignatura,
        String titulo,
        String descripcion,
        String fecha,
        String hora,
        String tipo,
        String creadoEn
) {}
