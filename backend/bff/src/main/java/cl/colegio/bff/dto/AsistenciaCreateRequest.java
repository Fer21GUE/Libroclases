package cl.colegio.bff.dto;

import jakarta.validation.constraints.NotNull;

public record AsistenciaCreateRequest(
        @NotNull Long alumnoId,
        Long cursoId,
        @NotNull String fecha,
        String estado,
        Boolean presente,
        String observacion,
        @NotNull Long profesorUsuarioId
) {}
