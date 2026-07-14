package cl.colegio.users_service.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "profesor_asignatura",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_profesor_asignatura",
                        columnNames = {
                                "profesor_id",
                                "asignatura_id"
                        }
                )
        }
)
public class ProfesorAsignatura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(
            name = "profesor_id",
            nullable = false
    )
    private Profesor profesor;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(
            name = "asignatura_id",
            nullable = false
    )
    private Asignatura asignatura;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Profesor getProfesor() {
        return profesor;
    }

    public void setProfesor(Profesor profesor) {
        this.profesor = profesor;
    }

    public Asignatura getAsignatura() {
        return asignatura;
    }

    public void setAsignatura(Asignatura asignatura) {
        this.asignatura = asignatura;
    }
}