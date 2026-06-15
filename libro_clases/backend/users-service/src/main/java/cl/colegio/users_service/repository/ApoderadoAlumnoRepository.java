package cl.colegio.users_service.repository;

import cl.colegio.users_service.entity.ApoderadoAlumno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApoderadoAlumnoRepository extends JpaRepository<ApoderadoAlumno, Long> {
    List<ApoderadoAlumno> findByApoderadoId(Long apoderadoId);
}
