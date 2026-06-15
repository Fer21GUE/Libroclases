package cl.colegio.bff.dto;

public record AnotacionDto(
        Long id,
        Long alumnoId,
        String alumnoNombre,
        String tipo,
        String descripcion,
        String fecha
) {}
