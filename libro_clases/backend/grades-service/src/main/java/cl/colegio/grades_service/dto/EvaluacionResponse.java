package cl.colegio.grades_service.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class EvaluacionResponse {
    private Long id;
    private Long cursoId;
    private String cursoNombre;
    private Long profesorId;
    private String asignatura;
    private String titulo;
    private String descripcion;
    private LocalDate fecha;
    private LocalTime hora;
    private String tipo;
    private LocalDateTime creadoEn;

    public EvaluacionResponse(Long id, Long cursoId, String cursoNombre, Long profesorId, String asignatura, String titulo, String descripcion, LocalDate fecha, LocalTime hora, String tipo, LocalDateTime creadoEn) {
        this.id = id;
        this.cursoId = cursoId;
        this.cursoNombre = cursoNombre;
        this.profesorId = profesorId;
        this.asignatura = asignatura;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.hora = hora;
        this.tipo = tipo;
        this.creadoEn = creadoEn;
    }

    public Long getId() { return id; }
    public Long getCursoId() { return cursoId; }
    public String getCursoNombre() { return cursoNombre; }
    public Long getProfesorId() { return profesorId; }
    public String getAsignatura() { return asignatura; }
    public String getTitulo() { return titulo; }
    public String getDescripcion() { return descripcion; }
    public LocalDate getFecha() { return fecha; }
    public LocalTime getHora() { return hora; }
    public String getTipo() { return tipo; }
    public LocalDateTime getCreadoEn() { return creadoEn; }
}
