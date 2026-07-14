package cl.colegio.users_service.controller;

import cl.colegio.users_service.dto.UsuarioActivoRequest;
import cl.colegio.users_service.dto.UsuarioCreateRequest;
import cl.colegio.users_service.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(
            UsuarioService usuarioService
    ) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(
                usuarioService.listar()
        );
    }

    @GetMapping("/perfil/{usuarioId}")
    public ResponseEntity<?> perfil(
            @PathVariable Long usuarioId
    ) {
        try {
            return ResponseEntity.ok(
                    usuarioService.obtenerPerfil(
                            usuarioId
                    )
            );
        } catch (IllegalArgumentException e) {
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

    @GetMapping("/{usuarioId}/estado")
    public ResponseEntity<?> consultarEstado(
            @PathVariable Long usuarioId
    ) {
        try {
            return ResponseEntity.ok(
                    Map.of(
                            "activo",
                            usuarioService.consultarEstado(
                                    usuarioId
                            )
                    )
            );
        } catch (IllegalArgumentException e) {
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

    @PostMapping
    public ResponseEntity<?> crear(
            @Valid @RequestBody
            UsuarioCreateRequest request
    ) {
        try {
            return ResponseEntity.ok(
                    usuarioService.crear(request)
            );
        } catch (IllegalArgumentException e) {
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

    @PatchMapping("/{usuarioId}/activo")
    public ResponseEntity<?> cambiarEstado(
            @PathVariable Long usuarioId,
            @Valid @RequestBody
            UsuarioActivoRequest request
    ) {
        try {
            return ResponseEntity.ok(
                    usuarioService.cambiarEstado(
                            usuarioId,
                            request.getActivo()
                    )
            );
        } catch (IllegalArgumentException e) {
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

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(
                Map.of(
                        "status",
                        "users-service ok"
                )
        );
    }
}