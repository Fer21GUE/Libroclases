package cl.colegio.users_service.dto;

public class PerfilUsuarioResponse {
    private Long usuarioId;
    private String nombre;
    private String email;
    private String rol;
    private Long profesorId;
    private Long alumnoId;
    private Long apoderadoId;
    private Long cursoId;
    private String cursoNombre;
    private String especialidad;

    public PerfilUsuarioResponse(Long usuarioId, String nombre, String email, String rol, Long profesorId, Long alumnoId, Long apoderadoId, Long cursoId, String cursoNombre, String especialidad) {
        this.usuarioId = usuarioId;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.profesorId = profesorId;
        this.alumnoId = alumnoId;
        this.apoderadoId = apoderadoId;
        this.cursoId = cursoId;
        this.cursoNombre = cursoNombre;
        this.especialidad = especialidad;
    }

    public Long getUsuarioId() { return usuarioId; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getRol() { return rol; }
    public Long getProfesorId() { return profesorId; }
    public Long getAlumnoId() { return alumnoId; }
    public Long getApoderadoId() { return apoderadoId; }
    public Long getCursoId() { return cursoId; }
    public String getCursoNombre() { return cursoNombre; }
    public String getEspecialidad() { return especialidad; }
}
