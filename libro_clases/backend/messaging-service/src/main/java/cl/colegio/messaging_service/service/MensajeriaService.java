package cl.colegio.messaging_service.service;

import cl.colegio.messaging_service.dto.CrearConversacionRequest;
import cl.colegio.messaging_service.dto.ResponderMensajeRequest;
import cl.colegio.messaging_service.repository.MensajeriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class MensajeriaService {

    private final MensajeriaRepository repository;

    public MensajeriaService(MensajeriaRepository repository) {
        this.repository = repository;
    }

    public List<Map<String, Object>> listarDestinatarios(Long usuarioId) {
        Map<String, Object> usuario = obtenerUsuarioActivo(usuarioId);
        String rol = String.valueOf(usuario.get("rol")).toLowerCase();

        return switch (rol) {
            case "profesor" -> repository.listarDestinatariosProfesor(usuarioId);
            case "alumno" -> repository.listarDestinatariosAlumno(usuarioId);
            case "apoderado" -> repository.listarDestinatariosApoderado(usuarioId);
            default -> throw new IllegalArgumentException(
                    "El usuario no tiene acceso a mensajería."
            );
        };
    }

    public List<Map<String, Object>> listarConversaciones(Long usuarioId) {
        obtenerUsuarioActivo(usuarioId);
        return repository.listarConversaciones(usuarioId);
    }

    public Map<String, Object> obtenerConversacion(Long conversacionId, Long usuarioId) {
        Map<String, Object> conversacion = obtenerConversacionParticipante(
                conversacionId,
                usuarioId
        );

        repository.marcarConversacionLeida(conversacionId, usuarioId);

        return Map.of(
                "conversacion", conversacion,
                "mensajes", repository.listarMensajesConversacion(conversacionId)
        );
    }

    @Transactional
    public Map<String, Object> crearConversacion(CrearConversacionRequest request) {
        Long remitenteId = request.getRemitenteUsuarioId();
        Long destinatarioId = request.getDestinatarioUsuarioId();

        if (remitenteId.equals(destinatarioId)) {
            throw new IllegalArgumentException("No puede enviarse mensajes a sí mismo.");
        }

        obtenerUsuarioActivo(remitenteId);
        obtenerUsuarioActivo(destinatarioId);
        validarDestinatarioPermitido(remitenteId, destinatarioId);

        String asunto = request.getAsunto().trim();
        String contenido = request.getContenido().trim();

        Long conversacionId = repository.crearConversacion(
                remitenteId,
                destinatarioId,
                asunto
        );

        Long mensajeId = repository.crearMensaje(
                conversacionId,
                remitenteId,
                destinatarioId,
                contenido
        );

        return Map.of(
                "conversacionId", conversacionId,
                "mensajeId", mensajeId,
                "message", "Mensaje enviado correctamente."
        );
    }

    @Transactional
    public Map<String, Object> responderConversacion(
            Long conversacionId,
            ResponderMensajeRequest request
    ) {
        Long remitenteId = request.getRemitenteUsuarioId();
        obtenerUsuarioActivo(remitenteId);

        Map<String, Object> conversacion = obtenerConversacionParticipante(
                conversacionId,
                remitenteId
        );

        Long usuarioUnoId = numeroLong(conversacion.get("usuarioUnoId"));
        Long usuarioDosId = numeroLong(conversacion.get("usuarioDosId"));
        Long destinatarioId = remitenteId.equals(usuarioUnoId)
                ? usuarioDosId
                : usuarioUnoId;

        obtenerUsuarioActivo(destinatarioId);

        Long mensajeId = repository.crearMensaje(
                conversacionId,
                remitenteId,
                destinatarioId,
                request.getContenido().trim()
        );

        return Map.of(
                "mensajeId", mensajeId,
                "message", "Respuesta enviada correctamente."
        );
    }

    @Transactional
    public Map<String, Object> marcarLeida(Long conversacionId, Long usuarioId) {
        obtenerConversacionParticipante(conversacionId, usuarioId);
        repository.marcarConversacionLeida(conversacionId, usuarioId);
        return Map.of("message", "Conversación marcada como leída.");
    }

    public Map<String, Object> contarNoLeidos(Long usuarioId) {
        obtenerUsuarioActivo(usuarioId);
        return Map.of("cantidad", repository.contarNoLeidos(usuarioId));
    }

    private Map<String, Object> obtenerUsuarioActivo(Long usuarioId) {
        Map<String, Object> usuario = repository.buscarUsuario(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));

        if (!Boolean.TRUE.equals(usuario.get("activo"))) {
            throw new IllegalArgumentException("Usuario inhabilitado.");
        }

        return usuario;
    }

    private Map<String, Object> obtenerConversacionParticipante(
            Long conversacionId,
            Long usuarioId
    ) {
        Map<String, Object> conversacion = repository.buscarConversacion(conversacionId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Conversación no encontrada."
                ));

        Long usuarioUnoId = numeroLong(conversacion.get("usuarioUnoId"));
        Long usuarioDosId = numeroLong(conversacion.get("usuarioDosId"));

        if (!usuarioId.equals(usuarioUnoId) && !usuarioId.equals(usuarioDosId)) {
            throw new IllegalArgumentException("No tiene acceso a esta conversación.");
        }

        return conversacion;
    }

    private void validarDestinatarioPermitido(Long remitenteId, Long destinatarioId) {
        boolean permitido = listarDestinatarios(remitenteId)
                .stream()
                .map(destinatario -> numeroLong(destinatario.get("usuarioId")))
                .anyMatch(destinatarioId::equals);

        if (!permitido) {
            throw new IllegalArgumentException("No puede enviar mensajes a ese usuario.");
        }
    }

    private Long numeroLong(Object valor) {
        if (valor instanceof Number numero) {
            return numero.longValue();
        }

        return Long.valueOf(String.valueOf(valor));
    }
}
