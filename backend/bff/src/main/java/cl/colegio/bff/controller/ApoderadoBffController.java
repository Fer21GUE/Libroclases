package cl.colegio.bff.controller;

import cl.colegio.bff.dto.ApoderadoDashboardResponse;
import cl.colegio.bff.dto.AlumnoDetalleResponse;
import cl.colegio.bff.service.ApoderadoBffService;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/bff/apoderado")
public class ApoderadoBffController {
    private final ApoderadoBffService apoderadoBffService;

    public ApoderadoBffController(ApoderadoBffService apoderadoBffService) {
        this.apoderadoBffService = apoderadoBffService;
    }

    @GetMapping("/{usuarioId}/dashboard")
    public Mono<ApoderadoDashboardResponse> dashboard(
            @PathVariable Long usuarioId,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        return apoderadoBffService.obtenerDashboard(usuarioId, authorization);
    }

    @GetMapping("/{usuarioId}/alumno/{alumnoId}/detalle")
    public Mono<AlumnoDetalleResponse> detalleAlumno(
            @PathVariable Long usuarioId,
            @PathVariable Long alumnoId,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        return apoderadoBffService.obtenerDetalleAlumno(alumnoId, authorization);
    }

}
