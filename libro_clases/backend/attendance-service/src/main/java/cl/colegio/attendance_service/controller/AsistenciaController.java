package cl.colegio.attendance_service.controller;

import cl.colegio.attendance_service.dto.AsistenciaCreateRequest;
import cl.colegio.attendance_service.service.AsistenciaService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:5173")
public class AsistenciaController {
    private final AsistenciaService asistenciaService;

    public AsistenciaController(AsistenciaService asistenciaService) {
        this.asistenciaService = asistenciaService;
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(asistenciaService.listar());
    }

    @GetMapping("/alumno/{alumnoId}")
    public ResponseEntity<?> porAlumno(@PathVariable Long alumnoId) {
        return ResponseEntity.ok(asistenciaService.listarPorAlumno(alumnoId));
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<?> porCurso(@PathVariable Long cursoId) {
        return ResponseEntity.ok(asistenciaService.listarPorCurso(cursoId));
    }

    @GetMapping("/curso/{cursoId}/fecha/{fecha}")
    public ResponseEntity<?> porCursoYFecha(@PathVariable Long cursoId, @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(asistenciaService.listarPorCursoYFecha(cursoId, fecha));
    }

    @GetMapping("/profesor/{profesorId}")
    public ResponseEntity<?> porProfesor(@PathVariable Long profesorId) {
        return ResponseEntity.ok(asistenciaService.listarPorProfesor(profesorId));
    }

    @PostMapping
    public ResponseEntity<?> registrar(@Valid @RequestBody AsistenciaCreateRequest request) {
        try {
            return ResponseEntity.ok(asistenciaService.registrar(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "attendance-service ok"));
    }
}
