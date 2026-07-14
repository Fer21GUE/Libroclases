package cl.colegio.users_service.dto;

import jakarta.validation.constraints.NotNull;

public class AsignarApoderadoAlumnoRequest {

    @NotNull
    private Long apoderadoId;

    @NotNull
    private Long alumnoId;

    private String parentesco;

    public Long getApoderadoId() {
        return apoderadoId;
    }

    public void setApoderadoId(Long apoderadoId) {
        this.apoderadoId = apoderadoId;
    }

    public Long getAlumnoId() {
        return alumnoId;
    }

    public void setAlumnoId(Long alumnoId) {
        this.alumnoId = alumnoId;
    }

    public String getParentesco() {
        return parentesco;
    }

    public void setParentesco(String parentesco) {
        this.parentesco = parentesco;
    }
}