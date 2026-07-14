package cl.colegio.users_service.repository;

import cl.colegio.users_service.entity.ProfesorCurso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfesorCursoRepository
        extends JpaRepository<ProfesorCurso, Long> {

    List<ProfesorCurso> findByProfesorId(
            Long profesorId
    );

    List<ProfesorCurso> findByCursoId(
            Long cursoId
    );

    boolean existsByProfesorIdAndCursoIdAndAsignaturaIgnoreCase(
            Long profesorId,
            Long cursoId,
            String asignatura
    );
}