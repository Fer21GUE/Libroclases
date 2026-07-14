package cl.colegio.users_service.dto;

import jakarta.validation.constraints.NotNull;

public class UsuarioActivoRequest {

    @NotNull
    private Boolean activo;

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}