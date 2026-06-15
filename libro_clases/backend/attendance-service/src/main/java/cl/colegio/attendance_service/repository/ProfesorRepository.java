package cl.colegio.attendance_service.repository;

import cl.colegio.attendance_service.entity.Profesor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfesorRepository extends JpaRepository<Profesor, Long> {}
