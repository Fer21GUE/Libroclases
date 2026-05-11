package cl.colegio.users_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AsignarProfesorRequest {
    @NotNull private Long profesorId;
    @NotNull private Long cursoId;
    @NotBlank private String asignatura;
    public Long getProfesorId(){return profesorId;} public void setProfesorId(Long profesorId){this.profesorId=profesorId;}
    public Long getCursoId(){return cursoId;} public void setCursoId(Long cursoId){this.cursoId=cursoId;}
    public String getAsignatura(){return asignatura;} public void setAsignatura(String asignatura){this.asignatura=asignatura;}
}
