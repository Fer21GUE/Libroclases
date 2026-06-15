package cl.colegio.grades_service.service;

import cl.colegio.grades_service.dto.EvaluacionCreateRequest;
import cl.colegio.grades_service.dto.EvaluacionResponse;
import cl.colegio.grades_service.entity.*;
import cl.colegio.grades_service.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class EvaluacionService {
    private final EvaluacionRepository evaluacionRepository;
    private final CursoRepository cursoRepository;
    private final ProfesorRepository profesorRepository;
    private final AlumnoRepository alumnoRepository;

    public EvaluacionService(EvaluacionRepository evaluacionRepository, CursoRepository cursoRepository, ProfesorRepository profesorRepository, AlumnoRepository alumnoRepository) {
        this.evaluacionRepository = evaluacionRepository;
        this.cursoRepository = cursoRepository;
        this.profesorRepository = profesorRepository;
        this.alumnoRepository = alumnoRepository;
    }

    public List<EvaluacionResponse> listar() {
        return evaluacionRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<EvaluacionResponse> listarPorCurso(Long cursoId) {
        return evaluacionRepository.findByCursoIdOrderByFechaAsc(cursoId).stream().map(this::toResponse).toList();
    }

    public List<EvaluacionResponse> listarPorProfesor(Long profesorId) {
        return evaluacionRepository.findByProfesorIdAndFechaGreaterThanEqualOrderByFechaAsc(profesorId, LocalDate.now()).stream().map(this::toResponse).toList();
    }

    public List<EvaluacionResponse> listarPorAlumno(Long alumnoId) {
        Alumno alumno = alumnoRepository.findById(alumnoId).orElseThrow(() -> new IllegalArgumentException("Alumno no encontrado."));
        if (alumno.getCurso() == null) return List.of();
        return evaluacionRepository.findByCursoIdAndFechaGreaterThanEqualOrderByFechaAsc(alumno.getCurso().getId(), LocalDate.now()).stream().map(this::toResponse).toList();
    }

    @Transactional
    public EvaluacionResponse crear(EvaluacionCreateRequest request) {
        Curso curso = cursoRepository.findById(request.getCursoId()).orElseThrow(() -> new IllegalArgumentException("Curso no encontrado."));
        Profesor profesor = request.getProfesorId() != null ? profesorRepository.findById(request.getProfesorId()).orElse(null) : null;
        Evaluacion evaluacion = new Evaluacion();
        evaluacion.setCurso(curso);
        evaluacion.setProfesor(profesor);
        evaluacion.setAsignatura(request.getAsignatura());
        evaluacion.setTitulo(request.getTitulo());
        evaluacion.setDescripcion(request.getDescripcion());
        evaluacion.setFecha(request.getFecha());
        evaluacion.setHora(request.getHora());
        evaluacion.setTipo(request.getTipo());
        return toResponse(evaluacionRepository.save(evaluacion));
    }

    private EvaluacionResponse toResponse(Evaluacion evaluacion) {
        Curso curso = evaluacion.getCurso();
        Profesor profesor = evaluacion.getProfesor();
        return new EvaluacionResponse(
                evaluacion.getId(),
                curso != null ? curso.getId() : null,
                curso != null ? curso.getNombre() : null,
                profesor != null ? profesor.getId() : null,
                evaluacion.getAsignatura(),
                evaluacion.getTitulo(),
                evaluacion.getDescripcion(),
                evaluacion.getFecha(),
                evaluacion.getHora(),
                evaluacion.getTipo(),
                evaluacion.getCreadoEn()
        );
    }
}
