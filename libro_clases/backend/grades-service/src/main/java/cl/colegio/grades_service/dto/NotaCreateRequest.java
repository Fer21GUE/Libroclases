package cl.colegio.grades_service.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class NotaCreateRequest {

    @NotNull(
            message = "Debe indicar el alumno."
    )
    private Long alumnoId;

    private Long cursoId;

    private Long profesorId;

    @NotBlank(
            message = "Debe indicar la asignatura."
    )
    @Size(
            max = 120,
            message = "La asignatura es demasiado extensa."
    )
    private String asignatura;

    @NotNull(
            message = "Debe ingresar una nota."
    )
    @DecimalMin(
            value = "1.00",
            message = "La nota mínima es 1,00."
    )
    @DecimalMax(
            value = "7.00",
            message = "La nota máxima es 7,00."
    )
    @Digits(
            integer = 1,
            fraction = 2,
            message = "La nota solo puede tener hasta dos decimales."
    )
    private BigDecimal nota;

    @Size(
            max = 150,
            message = "La descripción puede tener como máximo 150 caracteres."
    )
    private String descripcion;

    public Long getAlumnoId() {
        return alumnoId;
    }

    public void setAlumnoId(
            Long alumnoId
    ) {
        this.alumnoId = alumnoId;
    }

    public Long getCursoId() {
        return cursoId;
    }

    public void setCursoId(
            Long cursoId
    ) {
        this.cursoId = cursoId;
    }

    public Long getProfesorId() {
        return profesorId;
    }

    public void setProfesorId(
            Long profesorId
    ) {
        this.profesorId = profesorId;
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
}