package cl.colegio.users_service.controller;

import cl.colegio.users_service.dto.AsignarProfesorRequest;
import cl.colegio.users_service.dto.CursoCreateRequest;
import cl.colegio.users_service.service.CursoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class CursoController {
    private final CursoService cursoService;

    public CursoController(CursoService cursoService) { this.cursoService = cursoService; }

    @GetMapping
    public ResponseEntity<?> listarCursos() { return ResponseEntity.ok(cursoService.listarCursos()); }

    @PostMapping
    public ResponseEntity<?> crearCurso(@Valid @RequestBody CursoCreateRequest request) {
        try { return ResponseEntity.ok(cursoService.crearCurso(request)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("message", e.getMessage())); }
    }

    @GetMapping("/profesores")
    public ResponseEntity<?> listarProfesores() { return ResponseEntity.ok(cursoService.listarProfesores()); }

    @GetMapping("/asignaciones")
    public ResponseEntity<?> listarAsignaciones() { return ResponseEntity.ok(cursoService.listarAsignaciones()); }

    @GetMapping("/profesor/{profesorId}")
    public ResponseEntity<?> listarCursosPorProfesor(@PathVariable Long profesorId) { return ResponseEntity.ok(cursoService.listarCursosPorProfesor(profesorId)); }

    @GetMapping("/alumnos/{alumnoId}")
    public ResponseEntity<?> obtenerAlumno(@PathVariable Long alumnoId) {
        try { return ResponseEntity.ok(cursoService.obtenerAlumnoPorId(alumnoId)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("message", e.getMessage())); }
    }

    @GetMapping("/{cursoId}/alumnos")
    public ResponseEntity<?> listarAlumnosPorCurso(@PathVariable Long cursoId) { return ResponseEntity.ok(cursoService.listarAlumnosPorCurso(cursoId)); }

    @GetMapping("/apoderado/{apoderadoId}/alumnos")
    public ResponseEntity<?> listarAlumnosPorApoderado(@PathVariable Long apoderadoId) { return ResponseEntity.ok(cursoService.listarAlumnosPorApoderado(apoderadoId)); }

    @PostMapping("/asignar-profesor")
    public ResponseEntity<?> asignar(@Valid @RequestBody AsignarProfesorRequest request) {
        try { return ResponseEntity.ok(cursoService.asignarProfesor(request)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("message", e.getMessage())); }
    }
}
