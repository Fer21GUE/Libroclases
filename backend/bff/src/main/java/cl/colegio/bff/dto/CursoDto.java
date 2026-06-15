package cl.colegio.bff.dto;

public record CursoDto(
        Long id,
        String nombre,
        String nivel,
        String asignatura,
        Long profesorId,
        String profesorNombre,
        Long totalAlumnos,
        String diaSemana,
        String horario,
        String sala,
        Integer anio,
        String letra
) {}
