package cl.colegio.grades_service.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
public class NotaCreateRequest {
    @NotNull private Long alumnoId; private Long cursoId; private Long profesorId; @NotBlank private String asignatura; @NotNull private BigDecimal nota; private String descripcion;
    public Long getAlumnoId(){return alumnoId;} public void setAlumnoId(Long alumnoId){this.alumnoId=alumnoId;}
    public Long getCursoId(){return cursoId;} public void setCursoId(Long cursoId){this.cursoId=cursoId;}
    public Long getProfesorId(){return profesorId;} public void setProfesorId(Long profesorId){this.profesorId=profesorId;}
    public String getAsignatura(){return asignatura;} public void setAsignatura(String asignatura){this.asignatura=asignatura;}
    public BigDecimal getNota(){return nota;} public void setNota(BigDecimal nota){this.nota=nota;}
    public String getDescripcion(){return descripcion;} public void setDescripcion(String descripcion){this.descripcion=descripcion;}
}
