package cl.colegio.users_service.dto;

public class ApoderadoAlumnoAsignacionResponse {

    private Long id;
    private Long apoderadoId;
    private String apoderadoNombre;
    private Long alumnoId;
    private String codigoAlumno;
    private String alumnoNombre;
    private String parentesco;

    public ApoderadoAlumnoAsignacionResponse(
            Long id,
            Long apoderadoId,
            String apoderadoNombre,
            Long alumnoId,
            String codigoAlumno,
            String alumnoNombre,
            String parentesco
    ) {
        this.id = id;
        this.apoderadoId = apoderadoId;
        this.apoderadoNombre = apoderadoNombre;
        this.alumnoId = alumnoId;
        this.codigoAlumno = codigoAlumno;
        this.alumnoNombre = alumnoNombre;
        this.parentesco = parentesco;
    }

    public Long getId() {
        return id;
    }

    public Long getApoderadoId() {
        return apoderadoId;
    }

    public String getApoderadoNombre() {
        return apoderadoNombre;
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

    public String getParentesco() {
        return parentesco;
    }
}