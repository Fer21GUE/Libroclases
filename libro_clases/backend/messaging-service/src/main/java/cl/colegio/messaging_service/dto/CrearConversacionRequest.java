package cl.colegio.messaging_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CrearConversacionRequest {

    @NotNull
    private Long remitenteUsuarioId;

    @NotNull
    private Long destinatarioUsuarioId;

    @NotBlank
    @Size(max = 150)
    private String asunto;

    @NotBlank
    @Size(max = 5000)
    private String contenido;

    public Long getRemitenteUsuarioId() {
        return remitenteUsuarioId;
    }

    public void setRemitenteUsuarioId(Long remitenteUsuarioId) {
        this.remitenteUsuarioId = remitenteUsuarioId;
    }

    public Long getDestinatarioUsuarioId() {
        return destinatarioUsuarioId;
    }

    public void setDestinatarioUsuarioId(Long destinatarioUsuarioId) {
        this.destinatarioUsuarioId = destinatarioUsuarioId;
    }

    public String getAsunto() {
        return asunto;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }
}
