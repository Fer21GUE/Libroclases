package cl.colegio.grades_service.repository;
import cl.colegio.grades_service.entity.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AlumnoRepository extends JpaRepository<Alumno, Long> {}
