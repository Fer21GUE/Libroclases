package cl.colegio.grades_service.controller;

import cl.colegio.grades_service.dto.EvaluacionCreateRequest;
import cl.colegio.grades_service.service.EvaluacionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/grades/evaluaciones")
@CrossOrigin(origins = "http://localhost:5173")
public class EvaluacionController {
    private final EvaluacionService evaluacionService;

    public EvaluacionController(EvaluacionService evaluacionService) {
        this.evaluacionService = evaluacionService;
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(evaluacionService.listar());
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<?> porCurso(@PathVariable Long cursoId) {
        return ResponseEntity.ok(evaluacionService.listarPorCurso(cursoId));
    }

    @GetMapping("/profesor/{profesorId}")
    public ResponseEntity<?> porProfesor(@PathVariable Long profesorId) {
        return ResponseEntity.ok(evaluacionService.listarPorProfesor(profesorId));
    }

    @GetMapping("/alumno/{alumnoId}")
    public ResponseEntity<?> porAlumno(@PathVariable Long alumnoId) {
        try {
            return ResponseEntity.ok(evaluacionService.listarPorAlumno(alumnoId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody EvaluacionCreateRequest request) {
        try {
            return ResponseEntity.ok(evaluacionService.crear(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
