package cl.colegio.bff.service;

import cl.colegio.bff.dto.AsistenciaDto;
import cl.colegio.bff.dto.NotaDto;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

final class ResumenUtils {
    private ResumenUtils() {}

    static BigDecimal promedioNotas(List<NotaDto> notas) {
        if (notas == null || notas.isEmpty()) return BigDecimal.ZERO;
        BigDecimal suma = notas.stream()
                .map(NotaDto::nota)
                .filter(n -> n != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (suma.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
        return suma.divide(BigDecimal.valueOf(notas.size()), 1, RoundingMode.HALF_UP);
    }

    static BigDecimal porcentajeAsistencia(List<AsistenciaDto> asistencia) {
        if (asistencia == null || asistencia.isEmpty()) return BigDecimal.ZERO;
        long presentes = asistencia.stream().filter(a -> Boolean.TRUE.equals(a.presente())).count();
        return BigDecimal.valueOf(presentes * 100.0 / asistencia.size()).setScale(1, RoundingMode.HALF_UP);
    }
}
