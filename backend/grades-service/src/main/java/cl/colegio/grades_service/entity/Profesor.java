package cl.colegio.grades_service.entity;
import jakarta.persistence.*;
@Entity @Table(name="profesores")
public class Profesor { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; public Long getId(){return id;} public void setId(Long id){this.id=id;} }
