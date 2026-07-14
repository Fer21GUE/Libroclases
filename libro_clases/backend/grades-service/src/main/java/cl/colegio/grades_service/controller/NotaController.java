package cl.colegio.grades_service.controller;

import cl.colegio.grades_service.dto.NotaCreateRequest;
import cl.colegio.grades_service.dto.NotaUpdateRequest;
import cl.colegio.grades_service.service.NotaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/grades")
@CrossOrigin(
        origins = "http://localhost:5173"
)
public class NotaController {

    private final NotaService notaService;

    public NotaController(
            NotaService notaService
    ) {
        this.notaService = notaService;
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(
                notaService.listar()
        );
    }

    @GetMapping("/alumno/{alumnoId}")
    public ResponseEntity<?> porAlumno(
            @PathVariable Long alumnoId
    ) {
        return ResponseEntity.ok(
                notaService.listarPorAlumno(
                        alumnoId
                )
        );
    }

    @GetMapping("/profesor/{profesorId}")
    public ResponseEntity<?> porProfesor(
            @PathVariable Long profesorId
    ) {
        return ResponseEntity.ok(
                notaService.listarPorProfesor(
                        profesorId
                )
        );
    }

    @GetMapping(
            "/profesor-usuario/{profesorUsuarioId}/curso/{cursoId}"
    )
    public ResponseEntity<?>
            porProfesorUsuarioCursoAsignatura(
                    @PathVariable
                    Long profesorUsuarioId,

                    @PathVariable
                    Long cursoId,

                    @RequestParam
                    String asignatura
            ) {
        try {
            return ResponseEntity.ok(
                    notaService
                            .listarPorProfesorUsuarioCursoAsignatura(
                                    profesorUsuarioId,
                                    cursoId,
                                    asignatura
                            )
            );
        } catch (IllegalArgumentException e) {
            return error(e);
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(
            @Valid
            @RequestBody
            NotaCreateRequest request
    ) {
        try {
            return ResponseEntity.ok(
                    notaService.crear(request)
            );
        } catch (IllegalArgumentException e) {
            return error(e);
        }
    }

    @PutMapping("/{notaId}")
    public ResponseEntity<?> actualizar(
            @PathVariable Long notaId,

            @Valid
            @RequestBody
            NotaUpdateRequest request
    ) {
        try {
            return ResponseEntity.ok(
                    notaService.actualizar(
                            notaId,
                            request
                    )
            );
        } catch (IllegalArgumentException e) {
            return error(e);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(
                Map.of(
                        "status",
                        "grades-service ok"
                )
        );
    }

    private ResponseEntity<?> error(
            IllegalArgumentException e
    ) {
        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                e.getMessage()
                        )
                );
    }
}