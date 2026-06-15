package cl.colegio.attendance_service.repository;

import cl.colegio.attendance_service.entity.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
    List<Asistencia> findByAlumnoIdOrderByFechaDesc(Long alumnoId);
    List<Asistencia> findByCursoIdOrderByFechaDesc(Long cursoId);
    List<Asistencia> findByCursoIdAndFecha(Long cursoId, LocalDate fecha);
    List<Asistencia> findByProfesorIdOrderByFechaDesc(Long profesorId);
    Optional<Asistencia> findByAlumnoIdAndFecha(Long alumnoId, LocalDate fecha);
}
