package cl.colegio.grades_service.repository;

import cl.colegio.grades_service.entity.Evaluacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {
    List<Evaluacion> findByCursoIdOrderByFechaAsc(Long cursoId);
    List<Evaluacion> findByProfesorIdAndFechaGreaterThanEqualOrderByFechaAsc(Long profesorId, LocalDate fecha);
    List<Evaluacion> findByCursoIdAndFechaGreaterThanEqualOrderByFechaAsc(Long cursoId, LocalDate fecha);
}
