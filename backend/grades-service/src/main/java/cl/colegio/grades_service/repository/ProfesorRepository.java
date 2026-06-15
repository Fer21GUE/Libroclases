package cl.colegio.grades_service.repository;
import cl.colegio.grades_service.entity.Profesor;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProfesorRepository extends JpaRepository<Profesor, Long> {}
