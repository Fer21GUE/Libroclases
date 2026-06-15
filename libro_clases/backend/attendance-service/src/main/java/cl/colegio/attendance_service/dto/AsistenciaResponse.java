package cl.colegio.attendance_service.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AsistenciaResponse {
    private Long id;
    private Long alumnoId;
    private String alumnoNombre;
    private Long cursoId;
    private String cursoNombre;
    private Long profesorId;
    private String profesorNombre;
    private LocalDate fecha;
    private String estado;
    private Boolean presente;
    private String observacion;
    private LocalDateTime registradoEn;

    public AsistenciaResponse(Long id, Long alumnoId, String alumnoNombre, Long cursoId, String cursoNombre, Long profesorId, String profesorNombre, LocalDate fecha, String estado, Boolean presente, String observacion, LocalDateTime registradoEn) {
        this.id = id;
        this.alumnoId = alumnoId;
        this.alumnoNombre = alumnoNombre;
        this.cursoId = cursoId;
        this.cursoNombre = cursoNombre;
        this.profesorId = profesorId;
        this.profesorNombre = profesorNombre;
        this.fecha = fecha;
        this.estado = estado;
        this.presente = presente;
        this.observacion = observacion;
        this.registradoEn = registradoEn;
    }

    public Long getId() { return id; }
    public Long getAlumnoId() { return alumnoId; }
    public String getAlumnoNombre() { return alumnoNombre; }
    public Long getCursoId() { return cursoId; }
    public String getCursoNombre() { return cursoNombre; }
    public Long getProfesorId() { return profesorId; }
    public String getProfesorNombre() { return profesorNombre; }
    public LocalDate getFecha() { return fecha; }
    public String getEstado() { return estado; }
    public Boolean getPresente() { return presente; }
    public String getObservacion() { return observacion; }
    public LocalDateTime getRegistradoEn() { return registradoEn; }
}
