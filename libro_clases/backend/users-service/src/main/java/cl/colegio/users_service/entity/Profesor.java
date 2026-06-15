package cl.colegio.users_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "profesores")
public class Profesor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name="codigo_profesor", unique = true, nullable = false, length = 20) private String codigoProfesor;
    @OneToOne @JoinColumn(name="usuario_id", nullable = false, unique = true) private Usuario usuario;
    @Column(length = 100) private String especialidad;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getCodigoProfesor(){return codigoProfesor;} public void setCodigoProfesor(String codigoProfesor){this.codigoProfesor=codigoProfesor;}
    public Usuario getUsuario(){return usuario;} public void setUsuario(Usuario usuario){this.usuario=usuario;}
    public String getEspecialidad(){return especialidad;} public void setEspecialidad(String especialidad){this.especialidad=especialidad;}
}
