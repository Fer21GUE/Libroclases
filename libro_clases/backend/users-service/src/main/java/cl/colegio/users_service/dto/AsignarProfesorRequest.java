package cl.colegio.users_service.dto;

import jakarta.validation.constraints.NotNull;

public class AsignarProfesorRequest {

    @NotNull
    private Long profesorId;

    @NotNull
    private Long cursoId;

    @NotNull
    private Long asignaturaId;

    public Long getProfesorId() {
        return profesorId;
    }

    public void setProfesorId(Long profesorId) {
        this.profesorId = profesorId;
    }

    public Long getCursoId() {
        return cursoId;
    }

    public void setCursoId(Long cursoId) {
        this.cursoId = cursoId;
    }

    public Long getAsignaturaId() {
        return asignaturaId;
    }

    public void setAsignaturaId(Long asignaturaId) {
        this.asignaturaId = asignaturaId;
    }
}