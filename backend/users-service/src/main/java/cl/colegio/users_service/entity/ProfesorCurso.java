package cl.colegio.users_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "profesor_curso", uniqueConstraints = @UniqueConstraint(columnNames = {"profesor_id", "curso_id", "asignatura"}))
public class ProfesorCurso {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="profesor_id", nullable = false) private Profesor profesor;
    @ManyToOne @JoinColumn(name="curso_id", nullable = false) private Curso curso;
    @Column(nullable = false, length = 100) private String asignatura;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Profesor getProfesor(){return profesor;} public void setProfesor(Profesor profesor){this.profesor=profesor;}
    public Curso getCurso(){return curso;} public void setCurso(Curso curso){this.curso=curso;}
    public String getAsignatura(){return asignatura;} public void setAsignatura(String asignatura){this.asignatura=asignatura;}
}
