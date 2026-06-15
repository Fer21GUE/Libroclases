package cl.colegio.bff.dto;

import java.math.BigDecimal;

public record NotaCreateInternalRequest(
        Long alumnoId,
        Long cursoId,
        Long profesorId,
        String asignatura,
        BigDecimal nota,
        String descripcion
) {}
