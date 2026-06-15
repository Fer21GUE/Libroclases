package cl.colegio.users_service.repository;

import cl.colegio.users_service.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CursoRepository extends JpaRepository<Curso, Long> {}
