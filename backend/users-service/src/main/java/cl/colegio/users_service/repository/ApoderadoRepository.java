package cl.colegio.users_service.repository;

import cl.colegio.users_service.entity.Apoderado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApoderadoRepository extends JpaRepository<Apoderado, Long> {
    Optional<Apoderado> findByUsuarioId(Long usuarioId);
}
