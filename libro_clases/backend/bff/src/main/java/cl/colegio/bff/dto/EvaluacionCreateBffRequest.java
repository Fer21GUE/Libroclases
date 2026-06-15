package cl.colegio.bff.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EvaluacionCreateBffRequest(
        @NotNull Long cursoId,
        @NotNull Long profesorUsuarioId,
        @NotBlank String asignatura,
        @NotBlank String titulo,
        String descripcion,
        @NotBlank String fecha,
        String hora,
        String tipo
) {}
