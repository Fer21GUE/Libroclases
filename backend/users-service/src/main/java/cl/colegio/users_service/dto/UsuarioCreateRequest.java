package cl.colegio.users_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UsuarioCreateRequest {
    @NotBlank private String nombre;
    @Email @NotBlank private String email;
    @NotBlank private String password;
    @NotBlank private String rol;
    private String codigoProfesor;
    private String especialidad;
    private String codigoAlumno;
    private Long cursoId;
    private String telefono;
    public String getNombre(){return nombre;} public void setNombre(String nombre){this.nombre=nombre;}
    public String getEmail(){return email;} public void setEmail(String email){this.email=email;}
    public String getPassword(){return password;} public void setPassword(String password){this.password=password;}
    public String getRol(){return rol;} public void setRol(String rol){this.rol=rol;}
    public String getCodigoProfesor(){return codigoProfesor;} public void setCodigoProfesor(String codigoProfesor){this.codigoProfesor=codigoProfesor;}
    public String getEspecialidad(){return especialidad;} public void setEspecialidad(String especialidad){this.especialidad=especialidad;}
    public String getCodigoAlumno(){return codigoAlumno;} public void setCodigoAlumno(String codigoAlumno){this.codigoAlumno=codigoAlumno;}
    public Long getCursoId(){return cursoId;} public void setCursoId(Long cursoId){this.cursoId=cursoId;}
    public String getTelefono(){return telefono;} public void setTelefono(String telefono){this.telefono=telefono;}
}
