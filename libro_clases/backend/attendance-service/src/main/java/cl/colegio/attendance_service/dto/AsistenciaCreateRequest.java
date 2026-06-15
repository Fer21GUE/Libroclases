package cl.colegio.attendance_service.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class AsistenciaCreateRequest {
    @NotNull
    private Long alumnoId;
    private Long cursoId;
    private Long profesorId;
    @NotNull
    private LocalDate fecha;
    private String estado;
    private String observacion;
    private Boolean presente;

    public Long getAlumnoId() { return alumnoId; }
    public void setAlumnoId(Long alumnoId) { this.alumnoId = alumnoId; }
    public Long getCursoId() { return cursoId; }
    public void setCursoId(Long cursoId) { this.cursoId = cursoId; }
    public Long getProfesorId() { return profesorId; }
    public void setProfesorId(Long profesorId) { this.profesorId = profesorId; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getObservacion() { return observacion; }
    public void setObservacion(String observacion) { this.observacion = observacion; }
    public Boolean getPresente() { return presente; }
    public void setPresente(Boolean presente) { this.presente = presente; }
}
