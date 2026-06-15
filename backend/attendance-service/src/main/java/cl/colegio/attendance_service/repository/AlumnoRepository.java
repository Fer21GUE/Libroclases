package cl.colegio.attendance_service.repository;

import cl.colegio.attendance_service.entity.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlumnoRepository extends JpaRepository<Alumno, Long> {}
