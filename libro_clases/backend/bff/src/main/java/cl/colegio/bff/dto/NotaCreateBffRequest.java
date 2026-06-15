package cl.colegio.bff.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record NotaCreateBffRequest(
        @NotNull Long alumnoId,
        Long cursoId,
        @NotNull Long profesorUsuarioId,
        @NotBlank String asignatura,
        @NotNull BigDecimal nota,
        String descripcion
) {}
