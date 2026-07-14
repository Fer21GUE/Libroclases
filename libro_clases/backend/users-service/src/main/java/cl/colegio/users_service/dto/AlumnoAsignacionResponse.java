package cl.colegio.users_service.dto;

public class AlumnoAsignacionResponse {

    private Long alumnoId;
    private String codigoAlumno;
    private String alumnoNombre;
    private Long cursoId;
    private String cursoNombre;

    public AlumnoAsignacionResponse(
            Long alumnoId,
            String codigoAlumno,
            String alumnoNombre,
            Long cursoId,
            String cursoNombre
    ) {
        this.alumnoId = alumnoId;
        this.codigoAlumno = codigoAlumno;
        this.alumnoNombre = alumnoNombre;
        this.cursoId = cursoId;
        this.cursoNombre = cursoNombre;
    }

    public Long getAlumnoId() {
        return alumnoId;
    }

    public String getCodigoAlumno() {
        return codigoAlumno;
    }

    public String getAlumnoNombre() {
        return alumnoNombre;
    }

    public Long getCursoId() {
        return cursoId;
    }

    public String getCursoNombre() {
        return cursoNombre;
    }
}