package cl.colegio.users_service.service;

import cl.colegio.users_service.dto.AlumnoCursoResponse;
import cl.colegio.users_service.dto.AsignarProfesorRequest;
import cl.colegio.users_service.dto.CursoCreateRequest;
import cl.colegio.users_service.dto.CursoProfesorResponse;
import cl.colegio.users_service.entity.*;
import cl.colegio.users_service.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CursoService {
    private final CursoRepository cursoRepository;
    private final ProfesorRepository profesorRepository;
    private final ProfesorCursoRepository profesorCursoRepository;
    private final AlumnoRepository alumnoRepository;
    private final ApoderadoAlumnoRepository apoderadoAlumnoRepository;

    public CursoService(CursoRepository cursoRepository, ProfesorRepository profesorRepository, ProfesorCursoRepository profesorCursoRepository, AlumnoRepository alumnoRepository, ApoderadoAlumnoRepository apoderadoAlumnoRepository) {
        this.cursoRepository = cursoRepository;
        this.profesorRepository = profesorRepository;
        this.profesorCursoRepository = profesorCursoRepository;
        this.alumnoRepository = alumnoRepository;
        this.apoderadoAlumnoRepository = apoderadoAlumnoRepository;
    }

    public List<Curso> listarCursos() { return cursoRepository.findAll(); }
    public List<Profesor> listarProfesores() { return profesorRepository.findAll(); }
    public List<ProfesorCurso> listarAsignaciones() { return profesorCursoRepository.findAll(); }

    public List<CursoProfesorResponse> listarCursosPorProfesor(Long profesorId) {
        return profesorCursoRepository.findByProfesorId(profesorId).stream()
                .map(pc -> new CursoProfesorResponse(
                        pc.getCurso().getId(),
                        pc.getCurso().getNombre(),
                        pc.getCurso().getNivel(),
                        pc.getAsignatura(),
                        pc.getProfesor().getId(),
                        pc.getProfesor().getUsuario().getNombre(),
                        alumnoRepository.countByCursoId(pc.getCurso().getId())
                ))
                .toList();
    }

    public List<AlumnoCursoResponse> listarAlumnosPorCurso(Long cursoId) {
        return alumnoRepository.findByCursoId(cursoId).stream().map(this::toAlumnoResponse).toList();
    }

    public List<AlumnoCursoResponse> listarAlumnosPorApoderado(Long apoderadoId) {
        return apoderadoAlumnoRepository.findByApoderadoId(apoderadoId).stream()
                .map(ApoderadoAlumno::getAlumno)
                .map(this::toAlumnoResponse)
                .toList();
    }

    public AlumnoCursoResponse obtenerAlumnoPorId(Long alumnoId) {
        Alumno alumno = alumnoRepository.findById(alumnoId)
                .orElseThrow(() -> new IllegalArgumentException("Alumno no encontrado."));
        return toAlumnoResponse(alumno);
    }

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

    private AlumnoCursoResponse toAlumnoResponse(Alumno alumno) {
        Long cursoId = alumno.getCurso() != null ? alumno.getCurso().getId() : null;
        String cursoNombre = alumno.getCurso() != null ? alumno.getCurso().getNombre() : alumno.getCursoTexto();
        return new AlumnoCursoResponse(
                alumno.getId(),
                alumno.getUsuario().getId(),
                alumno.getUsuario().getNombre(),
                alumno.getUsuario().getEmail(),
                alumno.getCodigoAlumno(),
                cursoId,
                cursoNombre
        );
    }
}
