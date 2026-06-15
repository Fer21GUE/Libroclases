package cl.colegio.grades_service.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class NotaResponse {
    private Long id;
    private Long alumnoId;
    private Long cursoId;
    private Long profesorId;
    private String asignatura;
    private BigDecimal nota;
    private String descripcion;
    private LocalDateTime fecha;
    private String tipo = "Evaluacion";
    private Integer periodo = 1;

    public NotaResponse(Long id, Long alumnoId, Long cursoId, Long profesorId, String asignatura, BigDecimal nota, String descripcion, LocalDateTime fecha) {
        this.id = id;
        this.alumnoId = alumnoId;
        this.cursoId = cursoId;
        this.profesorId = profesorId;
        this.asignatura = asignatura;
        this.nota = nota;
        this.descripcion = descripcion;
        this.fecha = fecha;
    }

    public Long getId() { return id; }
    public Long getAlumnoId() { return alumnoId; }
    public Long getCursoId() { return cursoId; }
    public Long getProfesorId() { return profesorId; }
    public String getAsignatura() { return asignatura; }
    public BigDecimal getNota() { return nota; }
    public String getDescripcion() { return descripcion; }
    public LocalDateTime getFecha() { return fecha; }
    public String getTipo() { return tipo; }
    public Integer getPeriodo() { return periodo; }
}
