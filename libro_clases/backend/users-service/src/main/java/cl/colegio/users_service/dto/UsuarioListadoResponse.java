package cl.colegio.users_service.dto;

public class UsuarioListadoResponse {

    private Long id;
    private String nombre;
    private String email;
    private String rol;
    private String codigoUsuario;
    private Boolean activo;

    public UsuarioListadoResponse(
            Long id,
            String nombre,
            String email,
            String rol,
            String codigoUsuario,
            Boolean activo
    ) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.codigoUsuario = codigoUsuario;
        this.activo = activo;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getEmail() {
        return email;
    }

    public String getRol() {
        return rol;
    }

    public String getCodigoUsuario() {
        return codigoUsuario;
    }

    public Boolean getActivo() {
        return activo;
    }
}