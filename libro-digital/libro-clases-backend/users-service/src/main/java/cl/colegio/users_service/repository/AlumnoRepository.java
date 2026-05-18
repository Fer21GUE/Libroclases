package cl.colegio.users_service.repository;

import cl.colegio.users_service.entity.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlumnoRepository extends JpaRepository<Alumno, Long> {}
