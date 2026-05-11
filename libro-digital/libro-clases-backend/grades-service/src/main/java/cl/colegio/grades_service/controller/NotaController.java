package cl.colegio.grades_service.controller;

import cl.colegio.grades_service.dto.NotaCreateRequest;
import cl.colegio.grades_service.service.NotaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/grades")
@CrossOrigin(origins = "http://localhost:5173")
public class NotaController {
    private final NotaService notaService;
    public NotaController(NotaService notaService){this.notaService=notaService;}
    @GetMapping public ResponseEntity<?> listar(){return ResponseEntity.ok(notaService.listar());}
    @GetMapping("/alumno/{alumnoId}") public ResponseEntity<?> porAlumno(@PathVariable Long alumnoId){return ResponseEntity.ok(notaService.listarPorAlumno(alumnoId));}
    @PostMapping public ResponseEntity<?> crear(@Valid @RequestBody NotaCreateRequest request){
        try{return ResponseEntity.ok(notaService.crear(request));}
        catch(IllegalArgumentException e){return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));}
    }
    @GetMapping("/health") public ResponseEntity<?> health(){return ResponseEntity.ok(Map.of("status","grades-service ok"));}
}
