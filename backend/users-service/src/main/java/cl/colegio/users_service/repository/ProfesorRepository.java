package cl.colegio.users_service.repository;

import cl.colegio.users_service.entity.Profesor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfesorRepository extends JpaRepository<Profesor, Long> {
    Optional<Profesor> findByUsuarioId(Long usuarioId);
}
