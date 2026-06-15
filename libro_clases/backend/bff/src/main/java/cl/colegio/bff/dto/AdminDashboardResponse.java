package cl.colegio.bff.dto;

public record AdminDashboardResponse(
        long totalUsuarios,
        long totalCursos,
        long totalNotas,
        long solicitudesPendientes
) {}
