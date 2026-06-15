package cl.colegio.users_service.dto;

public class AlumnoCursoResponse {
    private Long id;
    private Long usuarioId;
    private String nombre;
    private String email;
    private String codigoAlumno;
    private Long cursoId;
    private String cursoNombre;

    public AlumnoCursoResponse(Long id, Long usuarioId, String nombre, String email, String codigoAlumno, Long cursoId, String cursoNombre) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.nombre = nombre;
        this.email = email;
        this.codigoAlumno = codigoAlumno;
        this.cursoId = cursoId;
        this.cursoNombre = cursoNombre;
    }

    public Long getId() { return id; }
    public Long getUsuarioId() { return usuarioId; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getCodigoAlumno() { return codigoAlumno; }
    public Long getCursoId() { return cursoId; }
    public String getCursoNombre() { return cursoNombre; }
}
