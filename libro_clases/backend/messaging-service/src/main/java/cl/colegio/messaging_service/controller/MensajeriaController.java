package cl.colegio.messaging_service.controller;

import cl.colegio.messaging_service.dto.CrearConversacionRequest;
import cl.colegio.messaging_service.dto.ResponderMensajeRequest;
import cl.colegio.messaging_service.service.MensajeriaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MensajeriaController {

    private final MensajeriaService service;

    public MensajeriaController(MensajeriaService service) {
        this.service = service;
    }

    @GetMapping("/users/{usuarioId}/recipients")
    public ResponseEntity<?> listarDestinatarios(@PathVariable Long usuarioId) {
        try {
            return ResponseEntity.ok(service.listarDestinatarios(usuarioId));
        } catch (IllegalArgumentException e) {
            return error(e);
        }
    }

    @GetMapping("/users/{usuarioId}/conversations")
    public ResponseEntity<?> listarConversaciones(@PathVariable Long usuarioId) {
        try {
            return ResponseEntity.ok(service.listarConversaciones(usuarioId));
        } catch (IllegalArgumentException e) {
            return error(e);
        }
    }

    @GetMapping("/conversations/{conversacionId}")
    public ResponseEntity<?> obtenerConversacion(
            @PathVariable Long conversacionId,
            @RequestParam Long usuarioId
    ) {
        try {
            return ResponseEntity.ok(
                    service.obtenerConversacion(conversacionId, usuarioId)
            );
        } catch (IllegalArgumentException e) {
            return error(e);
        }
    }

    @PostMapping("/conversations")
    public ResponseEntity<?> crearConversacion(
            @Valid @RequestBody CrearConversacionRequest request
    ) {
        try {
            return ResponseEntity.ok(service.crearConversacion(request));
        } catch (IllegalArgumentException e) {
            return error(e);
        }
    }

    @PostMapping("/conversations/{conversacionId}/messages")
    public ResponseEntity<?> responder(
            @PathVariable Long conversacionId,
            @Valid @RequestBody ResponderMensajeRequest request
    ) {
        try {
            return ResponseEntity.ok(
                    service.responderConversacion(conversacionId, request)
            );
        } catch (IllegalArgumentException e) {
            return error(e);
        }
    }

    @PatchMapping("/conversations/{conversacionId}/read")
    public ResponseEntity<?> marcarLeida(
            @PathVariable Long conversacionId,
            @RequestParam Long usuarioId
    ) {
        try {
            return ResponseEntity.ok(service.marcarLeida(conversacionId, usuarioId));
        } catch (IllegalArgumentException e) {
            return error(e);
        }
    }

    @GetMapping("/users/{usuarioId}/unread-count")
    public ResponseEntity<?> contarNoLeidos(@PathVariable Long usuarioId) {
        try {
            return ResponseEntity.ok(service.contarNoLeidos(usuarioId));
        } catch (IllegalArgumentException e) {
            return error(e);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "messaging-service ok"));
    }

    private ResponseEntity<?> error(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }
}
