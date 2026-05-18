package cl.colegio.users_service.service;

import cl.colegio.users_service.dto.AsignarProfesorRequest;
import cl.colegio.users_service.dto.CursoCreateRequest;
import cl.colegio.users_service.entity.Curso;
import cl.colegio.users_service.entity.Profesor;
import cl.colegio.users_service.entity.ProfesorCurso;
import cl.colegio.users_service.repository.CursoRepository;
import cl.colegio.users_service.repository.ProfesorCursoRepository;
import cl.colegio.users_service.repository.ProfesorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CursoService {
    private final CursoRepository cursoRepository;
    private final ProfesorRepository profesorRepository;
    private final ProfesorCursoRepository profesorCursoRepository;

    public CursoService(CursoRepository cursoRepository, ProfesorRepository profesorRepository, ProfesorCursoRepository profesorCursoRepository) {
        this.cursoRepository = cursoRepository;
        this.profesorRepository = profesorRepository;
        this.profesorCursoRepository = profesorCursoRepository;
    }

    public List<Curso> listarCursos() { return cursoRepository.findAll(); }
    public List<Profesor> listarProfesores() { return profesorRepository.findAll(); }
    public List<ProfesorCurso> listarAsignaciones() { return profesorCursoRepository.findAll(); }

    @Transactional
    public Curso crearCurso(CursoCreateRequest request) {
        Curso curso = new Curso();
        curso.setNombre(request.getNombre());
        curso.setNivel(request.getNivel());

        if (request.getProfesorJefeId() != null) {
            Profesor profesor = profesorRepository.findById(request.getProfesorJefeId()).orElseThrow(() -> new IllegalArgumentException("Profesor no encontrado."));
            curso.setProfesorJefe(profesor);
        }

        return cursoRepository.save(curso);
    }

    @Transactional
    public ProfesorCurso asignarProfesor(AsignarProfesorRequest request) {
        Profesor profesor = profesorRepository.findById(request.getProfesorId()).orElseThrow(() -> new IllegalArgumentException("Profesor no encontrado."));
        Curso curso = cursoRepository.findById(request.getCursoId()).orElseThrow(() -> new IllegalArgumentException("Curso no encontrado."));

        ProfesorCurso asignacion = new ProfesorCurso();
        asignacion.setProfesor(profesor);
        asignacion.setCurso(curso);
        asignacion.setAsignatura(request.getAsignatura());

        if (curso.getProfesorJefe() == null) {
            curso.setProfesorJefe(profesor);
            cursoRepository.save(curso);
        }

        return profesorCursoRepository.save(asignacion);
    }
}