package cl.colegio.grades_service.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class NotaUpdateRequest {

    @NotNull(
            message = "Debe indicar el profesor."
    )
    private Long profesorUsuarioId;

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

    public Long getProfesorUsuarioId() {
        return profesorUsuarioId;
    }

    public void setProfesorUsuarioId(
            Long profesorUsuarioId
    ) {
        this.profesorUsuarioId =
                profesorUsuarioId;
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