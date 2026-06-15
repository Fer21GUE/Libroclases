package cl.colegio.bff.dto;

public record EvaluacionCreateInternalRequest(
        Long cursoId,
        Long profesorId,
        String asignatura,
        String titulo,
        String descripcion,
        String fecha,
        String hora,
        String tipo
) {}
