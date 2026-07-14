package cl.colegio.users_service.repository;

import cl.colegio.users_service.entity.Asignatura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AsignaturaRepository
        extends JpaRepository<Asignatura, Long> {

    List<Asignatura> findAllByOrderByNombreAsc();
}