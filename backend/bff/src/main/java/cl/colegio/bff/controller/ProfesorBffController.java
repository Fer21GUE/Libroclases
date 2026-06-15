package cl.colegio.bff.controller;

import cl.colegio.bff.dto.*;
import cl.colegio.bff.service.ProfesorBffService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.util.List;

@RestController
@RequestMapping("/api/bff/profesor")
public class ProfesorBffController {
    private final ProfesorBffService profesorBffService;

    public ProfesorBffController(ProfesorBffService profesorBffService) {
        this.profesorBffService = profesorBffService;
    }

    @GetMapping("/{usuarioId}/dashboard")
    public Mono<ProfesorDashboardResponse> dashboard(
            @PathVariable Long usuarioId,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        return profesorBffService.obtenerDashboard(usuarioId, authorization);
    }

    @GetMapping("/cursos/{cursoId}/alumnos")
    public Mono<List<AlumnoDto>> alumnosPorCurso(
            @PathVariable Long cursoId,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        return profesorBffService.alumnosPorCurso(cursoId, authorization);
    }

    @PostMapping("/notas")
    public Mono<NotaDto> registrarNota(
            @Valid @RequestBody NotaCreateBffRequest request,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        return profesorBffService.registrarNota(request, authorization);
    }

    @PostMapping("/asistencia")
    public Mono<AsistenciaDto> registrarAsistencia(
            @Valid @RequestBody AsistenciaCreateRequest request,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        return profesorBffService.registrarAsistencia(request, authorization);
    }

    @PostMapping("/evaluaciones")
    public Mono<EvaluacionDto> crearEvaluacion(
            @Valid @RequestBody EvaluacionCreateBffRequest request,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        return profesorBffService.crearEvaluacion(request, authorization);
    }
}
