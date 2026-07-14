package cl.colegio.users_service.repository;

import cl.colegio.users_service.entity.ProfesorAsignatura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfesorAsignaturaRepository
        extends JpaRepository<ProfesorAsignatura, Long> {

    List<ProfesorAsignatura> findByProfesorId(
            Long profesorId
    );

    boolean existsByProfesorIdAndAsignaturaId(
            Long profesorId,
            Long asignaturaId
    );
}