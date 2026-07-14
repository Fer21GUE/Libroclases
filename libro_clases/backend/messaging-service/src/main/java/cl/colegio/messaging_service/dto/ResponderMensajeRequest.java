package cl.colegio.messaging_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ResponderMensajeRequest {

    @NotNull
    private Long remitenteUsuarioId;

    @NotBlank
    @Size(max = 5000)
    private String contenido;

    public Long getRemitenteUsuarioId() {
        return remitenteUsuarioId;
    }

    public void setRemitenteUsuarioId(Long remitenteUsuarioId) {
        this.remitenteUsuarioId = remitenteUsuarioId;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }
}
