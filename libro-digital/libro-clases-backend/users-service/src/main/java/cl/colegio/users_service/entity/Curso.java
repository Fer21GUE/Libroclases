package cl.colegio.users_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cursos")
public class Curso {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 100) private String nombre;
    @Column(length = 50) private String nivel;
    @ManyToOne @JoinColumn(name="profesor_id") private Profesor profesorJefe;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getNombre(){return nombre;} public void setNombre(String nombre){this.nombre=nombre;}
    public String getNivel(){return nivel;} public void setNivel(String nivel){this.nivel=nivel;}
    public Profesor getProfesorJefe(){return profesorJefe;} public void setProfesorJefe(Profesor profesorJefe){this.profesorJefe=profesorJefe;}
}
