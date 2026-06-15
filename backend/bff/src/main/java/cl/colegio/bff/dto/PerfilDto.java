package cl.colegio.bff.dto;

public record PerfilDto(
        Long usuarioId,
        String nombre,
        String email,
        String rol,
        Long profesorId,
        Long alumnoId,
        Long apoderadoId,
        Long cursoId,
        String cursoNombre,
        String especialidad
) {}
