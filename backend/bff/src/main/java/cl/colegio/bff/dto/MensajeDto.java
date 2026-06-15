package cl.colegio.bff.dto;

public record MensajeDto(
        Long id,
        String emisorNombre,
        String asunto,
        String mensaje,
        Boolean leido,
        String createdAt
) {}
