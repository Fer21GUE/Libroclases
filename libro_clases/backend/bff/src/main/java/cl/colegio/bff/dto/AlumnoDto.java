package cl.colegio.bff.dto;

public record AlumnoDto(
        Long id,
        Long usuarioId,
        String nombre,
        String email,
        String codigoAlumno,
        Long cursoId,
        String cursoNombre
) {}
