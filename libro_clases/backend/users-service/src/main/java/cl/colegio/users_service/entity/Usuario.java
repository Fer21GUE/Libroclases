package cl.colegio.users_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

 
    @Column(
            name = "nombre",
            nullable = false,
            length = 180
    )
    private String nombre;

    @Column(
            name = "nombre_persona",
            length = 100
    )
    private String nombrePersona;

    @Column(
            name = "apellido_paterno",
            length = 80
    )
    private String apellidoPaterno;

    @Column(
            name = "apellido_materno",
            length = 80
    )
    private String apellidoMaterno;

    @Column(
            name = "rut",
            unique = true,
            length = 12
    )
    private String rut;

    @Column(
            name = "email",
            nullable = false,
            unique = true,
            length = 120
    )
    private String email;

    @JsonIgnore
    @Column(
            name = "password",
            nullable = false,
            length = 255
    )
    private String password;

    @Column(
            name = "rol",
            nullable = false,
            length = 30
    )
    private String rol;

    @Column(
            name = "activo",
            nullable = false
    )
    private Boolean activo = true;

    @Column(name = "creado_en")
    private LocalDateTime creadoEn =
            LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getNombrePersona() {
        return nombrePersona;
    }

    public void setNombrePersona(
            String nombrePersona
    ) {
        this.nombrePersona = nombrePersona;
    }

    public String getApellidoPaterno() {
        return apellidoPaterno;
    }

    public void setApellidoPaterno(
            String apellidoPaterno
    ) {
        this.apellidoPaterno = apellidoPaterno;
    }

    public String getApellidoMaterno() {
        return apellidoMaterno;
    }

    public void setApellidoMaterno(
            String apellidoMaterno
    ) {
        this.apellidoMaterno = apellidoMaterno;
    }

    public String getRut() {
        return rut;
    }

    public void setRut(String rut) {
        this.rut = rut;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public LocalDateTime getCreadoEn() {
        return creadoEn;
    }

    public void setCreadoEn(
            LocalDateTime creadoEn
    ) {
        this.creadoEn = creadoEn;
    }
}