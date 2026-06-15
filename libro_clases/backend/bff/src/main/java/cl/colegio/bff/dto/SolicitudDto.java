package cl.colegio.bff.dto;

public record SolicitudDto(
        Long id,
        String tipo,
        String estado,
        String mensaje,
        String respuesta,
        String createdAt
) {}
