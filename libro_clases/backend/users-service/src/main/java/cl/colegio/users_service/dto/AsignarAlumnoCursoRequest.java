package cl.colegio.users_service.dto;

import jakarta.validation.constraints.NotNull;

public class AsignarAlumnoCursoRequest {

    @NotNull
    private Long alumnoId;

    @NotNull
    private Long cursoId;

    public Long getAlumnoId() {
        return alumnoId;
    }

    public void setAlumnoId(Long alumnoId) {
        this.alumnoId = alumnoId;
    }

    public Long getCursoId() {
        return cursoId;
    }

    public void setCursoId(Long cursoId) {
        this.cursoId = cursoId;
    }
}