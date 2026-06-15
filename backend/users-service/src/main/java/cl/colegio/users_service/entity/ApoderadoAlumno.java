package cl.colegio.users_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "apoderado_alumno", uniqueConstraints = @UniqueConstraint(columnNames = {"apoderado_id", "alumno_id"}))
public class ApoderadoAlumno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "apoderado_id", nullable = false)
    private Apoderado apoderado;

    @ManyToOne
    @JoinColumn(name = "alumno_id", nullable = false)
    private Alumno alumno;

    @Column(length = 50)
    private String parentesco;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Apoderado getApoderado() { return apoderado; }
    public void setApoderado(Apoderado apoderado) { this.apoderado = apoderado; }
    public Alumno getAlumno() { return alumno; }
    public void setAlumno(Alumno alumno) { this.alumno = alumno; }
    public String getParentesco() { return parentesco; }
    public void setParentesco(String parentesco) { this.parentesco = parentesco; }
}
