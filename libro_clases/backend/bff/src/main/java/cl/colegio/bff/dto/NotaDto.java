package cl.colegio.bff.dto;

import java.math.BigDecimal;

public record NotaDto(
        Long id,
        Long alumnoId,
        Long cursoId,
        Long profesorId,
        String asignatura,
        BigDecimal nota,
        String descripcion,
        String fecha,
        String tipo,
        Integer periodo
) {}
