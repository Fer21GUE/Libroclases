package cl.colegio.users_service.repository;

import cl.colegio.users_service.entity.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AlumnoRepository extends JpaRepository<Alumno, Long> {
    Optional<Alumno> findByUsuarioId(Long usuarioId);
    List<Alumno> findByCursoId(Long cursoId);
    long countByCursoId(Long cursoId);
}
