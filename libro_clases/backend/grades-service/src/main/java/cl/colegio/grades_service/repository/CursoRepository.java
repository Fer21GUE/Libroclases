package cl.colegio.grades_service.repository;
import cl.colegio.grades_service.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CursoRepository extends JpaRepository<Curso, Long> {}
