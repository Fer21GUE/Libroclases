package cl.colegio.bff.controller;

import cl.colegio.bff.dto.AlumnoDashboardResponse;
import cl.colegio.bff.service.AlumnoBffService;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/bff/alumno")
public class AlumnoBffController {
    private final AlumnoBffService alumnoBffService;

    public AlumnoBffController(AlumnoBffService alumnoBffService) {
        this.alumnoBffService = alumnoBffService;
    }

    @GetMapping("/{usuarioId}/dashboard")
    public Mono<AlumnoDashboardResponse> dashboard(
            @PathVariable Long usuarioId,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        return alumnoBffService.obtenerDashboard(usuarioId, authorization);
    }

    @PutMapping("/mensajes/{mensajeId}/leer")
    public Mono<Map<String, Object>> marcarMensajeLeido(@PathVariable Long mensajeId) {
        return alumnoBffService.marcarMensajeLeido(mensajeId);
    }
}
