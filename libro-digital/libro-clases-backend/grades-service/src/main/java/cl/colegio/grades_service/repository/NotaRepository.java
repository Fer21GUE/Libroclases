package cl.colegio.grades_service.repository;
import cl.colegio.grades_service.entity.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface NotaRepository extends JpaRepository<Nota, Long> { List<Nota> findByAlumnoId(Long alumnoId); }
