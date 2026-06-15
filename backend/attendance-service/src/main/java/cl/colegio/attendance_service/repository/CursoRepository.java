package cl.colegio.attendance_service.repository;

import cl.colegio.attendance_service.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CursoRepository extends JpaRepository<Curso, Long> {}
