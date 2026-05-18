package cl.colegio.users_service.repository;

import cl.colegio.users_service.entity.Profesor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfesorRepository extends JpaRepository<Profesor, Long> {}
