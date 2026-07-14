package cl.colegio.grades_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "notas")
public class Nota {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @ManyToOne
    @JoinColumn(
            name = "alumno_id",
            nullable = false
    )
    private Alumno alumno;

    @ManyToOne
    @JoinColumn(name = "curso_id")
    private Curso curso;

    @ManyToOne
    @JoinColumn(name = "profesor_id")
    private Profesor profesor;

    @Column(
            nullable = false,
            length = 120
    )
    private String asignatura;

    @Column(
            nullable = false,
            precision = 3,
            scale = 2
    )
    private BigDecimal nota;

    @Column(length = 150)
    private String descripcion;

    @Column(
            nullable = false
    )
    private LocalDateTime fecha =
            LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public void setId(
            Long id
    ) {
        this.id = id;
    }

    public Alumno getAlumno() {
        return alumno;
    }

    public void setAlumno(
            Alumno alumno
    ) {
        this.alumno = alumno;
    }

    public Curso getCurso() {
        return curso;
    }

    public void setCurso(
            Curso curso
    ) {
        this.curso = curso;
    }

    public Profesor getProfesor() {
        return profesor;
    }

    public void setProfesor(
            Profesor profesor
    ) {
        this.profesor = profesor;
    }

    public String getAsignatura() {
        return asignatura;
    }

    public void setAsignatura(
            String asignatura
    ) {
        this.asignatura = asignatura;
    }

    public BigDecimal getNota() {
        return nota;
    }

    public void setNota(
            BigDecimal nota
    ) {
        this.nota = nota;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(
            String descripcion
    ) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(
            LocalDateTime fecha
    ) {
        this.fecha = fecha;
    }
}