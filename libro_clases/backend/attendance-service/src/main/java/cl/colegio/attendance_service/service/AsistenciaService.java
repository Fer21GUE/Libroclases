package cl.colegio.attendance_service.service;

import cl.colegio.attendance_service.dto.AsistenciaCreateRequest;
import cl.colegio.attendance_service.dto.AsistenciaResponse;
import cl.colegio.attendance_service.entity.*;
import cl.colegio.attendance_service.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class AsistenciaService {
    private final AsistenciaRepository asistenciaRepository;
    private final AlumnoRepository alumnoRepository;
    private final CursoRepository cursoRepository;
    private final ProfesorRepository profesorRepository;

    public AsistenciaService(AsistenciaRepository asistenciaRepository, AlumnoRepository alumnoRepository, CursoRepository cursoRepository, ProfesorRepository profesorRepository) {
        this.asistenciaRepository = asistenciaRepository;
        this.alumnoRepository = alumnoRepository;
        this.cursoRepository = cursoRepository;
        this.profesorRepository = profesorRepository;
    }

    public List<AsistenciaResponse> listar() {
        return asistenciaRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<AsistenciaResponse> listarPorAlumno(Long alumnoId) {
        return asistenciaRepository.findByAlumnoIdOrderByFechaDesc(alumnoId).stream().map(this::toResponse).toList();
    }

    public List<AsistenciaResponse> listarPorCurso(Long cursoId) {
        return asistenciaRepository.findByCursoIdOrderByFechaDesc(cursoId).stream().map(this::toResponse).toList();
    }

    public List<AsistenciaResponse> listarPorCursoYFecha(Long cursoId, LocalDate fecha) {
        return asistenciaRepository.findByCursoIdAndFecha(cursoId, fecha).stream().sorted((a, b) -> a.getAlumno().getId().compareTo(b.getAlumno().getId())).map(this::toResponse).toList();
    }

    public List<AsistenciaResponse> listarPorProfesor(Long profesorId) {
        return asistenciaRepository.findByProfesorIdOrderByFechaDesc(profesorId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public AsistenciaResponse registrar(AsistenciaCreateRequest request) {
        Alumno alumno = alumnoRepository.findById(request.getAlumnoId()).orElseThrow(() -> new IllegalArgumentException("Alumno no encontrado."));
        Curso curso = resolverCurso(request, alumno);
        Profesor profesor = request.getProfesorId() != null ? profesorRepository.findById(request.getProfesorId()).orElse(null) : null;
        String estado = resolverEstado(request);
        Asistencia asistencia = asistenciaRepository.findByAlumnoIdAndFecha(alumno.getId(), request.getFecha()).orElseGet(Asistencia::new);
        asistencia.setAlumno(alumno);
        asistencia.setCurso(curso);
        asistencia.setProfesor(profesor);
        asistencia.setFecha(request.getFecha());
        asistencia.setEstado(estado);
        asistencia.setObservacion(request.getObservacion());
        return toResponse(asistenciaRepository.save(asistencia));
    }

    private Curso resolverCurso(AsistenciaCreateRequest request, Alumno alumno) {
        if (request.getCursoId() != null) return cursoRepository.findById(request.getCursoId()).orElse(null);
        return alumno.getCurso();
    }

    private String resolverEstado(AsistenciaCreateRequest request) {
        if (request.getEstado() != null && !request.getEstado().isBlank()) return request.getEstado().trim().toLowerCase();
        if (Boolean.TRUE.equals(request.getPresente())) return "presente";
        return "ausente";
    }

    private AsistenciaResponse toResponse(Asistencia asistencia) {
        Alumno alumno = asistencia.getAlumno();
        Curso curso = asistencia.getCurso();
        Profesor profesor = asistencia.getProfesor();
        String alumnoNombre = alumno != null && alumno.getUsuario() != null ? alumno.getUsuario().getNombre() : null;
        String cursoNombre = curso != null ? curso.getNombre() : null;
        String profesorNombre = profesor != null && profesor.getUsuario() != null ? profesor.getUsuario().getNombre() : null;
        boolean presente = "presente".equalsIgnoreCase(asistencia.getEstado()) || "justificado".equalsIgnoreCase(asistencia.getEstado());
        return new AsistenciaResponse(
                asistencia.getId(),
                alumno != null ? alumno.getId() : null,
                alumnoNombre,
                curso != null ? curso.getId() : null,
                cursoNombre,
                profesor != null ? profesor.getId() : null,
                profesorNombre,
                asistencia.getFecha(),
                asistencia.getEstado(),
                presente,
                asistencia.getObservacion(),
                asistencia.getRegistradoEn()
        );
    }
}
