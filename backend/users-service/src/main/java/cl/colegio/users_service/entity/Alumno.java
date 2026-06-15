package cl.colegio.users_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "alumnos")
public class Alumno {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name="codigo_alumno", unique = true, nullable = false, length = 20) private String codigoAlumno;
    @OneToOne @JoinColumn(name="usuario_id", nullable = false, unique = true) private Usuario usuario;
    @ManyToOne @JoinColumn(name="curso_id") private Curso curso;
    @Column(name="curso", length = 50) private String cursoTexto;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getCodigoAlumno(){return codigoAlumno;} public void setCodigoAlumno(String codigoAlumno){this.codigoAlumno=codigoAlumno;}
    public Usuario getUsuario(){return usuario;} public void setUsuario(Usuario usuario){this.usuario=usuario;}
    public Curso getCurso(){return curso;} public void setCurso(Curso curso){this.curso=curso;}
    public String getCursoTexto(){return cursoTexto;} public void setCursoTexto(String cursoTexto){this.cursoTexto=cursoTexto;}
}
