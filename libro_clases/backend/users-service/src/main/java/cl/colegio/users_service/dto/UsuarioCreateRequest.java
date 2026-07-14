package cl.colegio.users_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public class UsuarioCreateRequest {

    @NotBlank(message = "Debe ingresar el nombre.")
    @Pattern(
            regexp = "^[\\p{L}]+(?:[ '\\-][\\p{L}]+)*$",
            message = "El nombre solo puede contener letras."
    )
    private String nombre;

    @Pattern(
            regexp = "^$|^[\\p{L}]+(?:[ '\\-][\\p{L}]+)+$",
            message = "Debe ingresar el apellido paterno y materno correctamente."
    )
    private String apellidos;

    @Pattern(
            regexp = "^$|^\\d{1,2}\\.\\d{3}\\.\\d{3}-[0-9Kk]$",
            message = "El RUT debe tener el formato 12.345.678-5."
    )
    private String rut;

    private String email;

    private String password;

    @NotBlank(message = "Debe seleccionar un rol.")
    private String rol;

    @Pattern(
            regexp = "^$|^PROF-\\d{3,}$",
            message = "El código debe tener el formato PROF-001."
    )
    private String codigoProfesor;

    private List<Long> asignaturaIds;

    @Pattern(
            regexp = "^$|^ALU-\\d{3,}$",
            message = "El código debe tener el formato ALU-001."
    )
    private String codigoAlumno;

    private Long cursoId;

    @Pattern(
            regexp = "^$|^\\d{9}$",
            message = "El teléfono debe contener exactamente 9 dígitos."
    )
    private String telefono;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(
            String nombre
    ) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(
            String apellidos
    ) {
        this.apellidos = apellidos;
    }

    public String getRut() {
        return rut;
    }

    public void setRut(
            String rut
    ) {
        this.rut = rut;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email
    ) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(
            String password
    ) {
        this.password = password;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(
            String rol
    ) {
        this.rol = rol;
    }

    public String getCodigoProfesor() {
        return codigoProfesor;
    }

    public void setCodigoProfesor(
            String codigoProfesor
    ) {
        this.codigoProfesor = codigoProfesor;
    }

    public List<Long> getAsignaturaIds() {
        return asignaturaIds;
    }

    public void setAsignaturaIds(
            List<Long> asignaturaIds
    ) {
        this.asignaturaIds = asignaturaIds;
    }

    public String getCodigoAlumno() {
        return codigoAlumno;
    }

    public void setCodigoAlumno(
            String codigoAlumno
    ) {
        this.codigoAlumno = codigoAlumno;
    }

    public Long getCursoId() {
        return cursoId;
    }

    public void setCursoId(
            Long cursoId
    ) {
        this.cursoId = cursoId;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(
            String telefono
    ) {
        this.telefono = telefono;
    }
}