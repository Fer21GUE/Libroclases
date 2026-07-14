package cl.colegio.grades_service.repository;

import cl.colegio.grades_service.entity.Nota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotaRepository
        extends JpaRepository<Nota, Long> {

    List<Nota> findByAlumnoId(
            Long alumnoId
    );

    List<Nota> findByProfesorId(
            Long profesorId
    );

    List<Nota>
            findByProfesorIdAndCursoIdAndAsignaturaIgnoreCaseOrderByFechaDesc(
                    Long profesorId,
                    Long cursoId,
                    String asignatura
            );

    Optional<Nota> findByIdAndProfesorId(
            Long notaId,
            Long profesorId
    );
}