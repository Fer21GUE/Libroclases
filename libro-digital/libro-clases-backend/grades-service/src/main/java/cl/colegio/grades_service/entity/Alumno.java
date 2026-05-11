package cl.colegio.grades_service.entity;
import jakarta.persistence.*;
@Entity @Table(name="alumnos")
public class Alumno { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; public Long getId(){return id;} public void setId(Long id){this.id=id;} }
