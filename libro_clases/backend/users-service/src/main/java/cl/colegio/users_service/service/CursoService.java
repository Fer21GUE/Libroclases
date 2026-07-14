package cl.colegio.users_service.service;

import cl.colegio.users_service.dto.AlumnoAsignacionResponse;
import cl.colegio.users_service.dto.AlumnoCursoResponse;
import cl.colegio.users_service.dto.ApoderadoAlumnoAsignacionResponse;
import cl.colegio.users_service.dto.AsignarAlumnoCursoRequest;
import cl.colegio.users_service.dto.AsignarApoderadoAlumnoRequest;
import cl.colegio.users_service.dto.AsignarProfesorRequest;
import cl.colegio.users_service.dto.AsignaturaProfesorResponse;
import cl.colegio.users_service.dto.CursoCreateRequest;
import cl.colegio.users_service.dto.CursoListadoResponse;
import cl.colegio.users_service.dto.CursoProfesorResponse;
import cl.colegio.users_service.entity.Alumno;
import cl.colegio.users_service.entity.Apoderado;
import cl.colegio.users_service.entity.ApoderadoAlumno;
import cl.colegio.users_service.entity.Asignatura;
import cl.colegio.users_service.entity.Curso;
import cl.colegio.users_service.entity.Profesor;
import cl.colegio.users_service.entity.ProfesorCurso;
import cl.colegio.users_service.repository.AlumnoRepository;
import cl.colegio.users_service.repository.ApoderadoAlumnoRepository;
import cl.colegio.users_service.repository.ApoderadoRepository;
import cl.colegio.users_service.repository.AsignaturaRepository;
import cl.colegio.users_service.repository.CursoRepository;
import cl.colegio.users_service.repository.ProfesorAsignaturaRepository;
import cl.colegio.users_service.repository.ProfesorCursoRepository;
import cl.colegio.users_service.repository.ProfesorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class CursoService {

    private final CursoRepository cursoRepository;
    private final ProfesorRepository profesorRepository;
    private final ProfesorCursoRepository profesorCursoRepository;
    private final AlumnoRepository alumnoRepository;
    private final ApoderadoRepository apoderadoRepository;
    private final ApoderadoAlumnoRepository apoderadoAlumnoRepository;
    private final AsignaturaRepository asignaturaRepository;
    private final ProfesorAsignaturaRepository profesorAsignaturaRepository;

    public CursoService(
            CursoRepository cursoRepository,
            ProfesorRepository profesorRepository,
            ProfesorCursoRepository profesorCursoRepository,
            AlumnoRepository alumnoRepository,
            ApoderadoRepository apoderadoRepository,
            ApoderadoAlumnoRepository apoderadoAlumnoRepository,
            AsignaturaRepository asignaturaRepository,
            ProfesorAsignaturaRepository profesorAsignaturaRepository
    ) {
        this.cursoRepository = cursoRepository;
        this.profesorRepository = profesorRepository;
        this.profesorCursoRepository = profesorCursoRepository;
        this.alumnoRepository = alumnoRepository;
        this.apoderadoRepository = apoderadoRepository;
        this.apoderadoAlumnoRepository = apoderadoAlumnoRepository;
        this.asignaturaRepository = asignaturaRepository;
        this.profesorAsignaturaRepository = profesorAsignaturaRepository;
    }

    public List<CursoListadoResponse> listarCursos() {
        return cursoRepository
                .findAll()
                .stream()
                .map(this::toCursoListadoResponse)
                .toList();
    }

    public List<Profesor> listarProfesores() {
        return profesorRepository.findAll();
    }

    public List<Alumno> listarAlumnos() {
        return alumnoRepository.findAll();
    }

    public List<Apoderado> listarApoderados() {
        return apoderadoRepository.findAll();
    }

    public List<Asignatura> listarAsignaturas() {
        return asignaturaRepository
                .findAllByOrderByNombreAsc();
    }

    public List<AsignaturaProfesorResponse>
            listarAsignaturasPorProfesor(
                    Long profesorId
            ) {

        if (!profesorRepository.existsById(profesorId)) {
            throw new IllegalArgumentException(
                    "Profesor no encontrado."
            );
        }

        return profesorAsignaturaRepository
                .findByProfesorId(profesorId)
                .stream()
                .map(relacion ->
                        new AsignaturaProfesorResponse(
                                relacion.getAsignatura().getId(),
                                relacion.getAsignatura().getNombre()
                        )
                )
                .sorted(
                        Comparator.comparing(
                                AsignaturaProfesorResponse::getNombre
                        )
                )
                .toList();
    }

    public List<ProfesorCurso> listarAsignaciones() {
        return profesorCursoRepository.findAll();
    }

    public List<AlumnoAsignacionResponse>
            listarAsignacionesAlumnos() {

        return alumnoRepository
                .findAll()
                .stream()
                .filter(
                        alumno ->
                                alumno.getCurso() != null
                )
                .map(
                        alumno ->
                                new AlumnoAsignacionResponse(
                                        alumno.getId(),
                                        alumno.getCodigoAlumno(),
                                        alumno.getUsuario().getNombre(),
                                        alumno.getCurso().getId(),
                                        alumno.getCurso().getNombre()
                                )
                )
                .toList();
    }

    public List<ApoderadoAlumnoAsignacionResponse>
            listarAsignacionesApoderados() {

        return apoderadoAlumnoRepository
                .findAll()
                .stream()
                .map(
                        relacion ->
                                new ApoderadoAlumnoAsignacionResponse(
                                        relacion.getId(),
                                        relacion.getApoderado().getId(),
                                        relacion.getApoderado()
                                                .getUsuario()
                                                .getNombre(),
                                        relacion.getAlumno().getId(),
                                        relacion.getAlumno()
                                                .getCodigoAlumno(),
                                        relacion.getAlumno()
                                                .getUsuario()
                                                .getNombre(),
                                        relacion.getParentesco()
                                )
                )
                .toList();
    }

    public List<CursoProfesorResponse>
            listarCursosPorProfesor(
                    Long profesorId
            ) {

        return profesorCursoRepository
                .findByProfesorId(profesorId)
                .stream()
                .map(
                        pc ->
                                new CursoProfesorResponse(
                                        pc.getCurso().getId(),
                                        pc.getCurso().getNombre(),
                                        pc.getCurso().getNivel(),
                                        pc.getAsignatura(),
                                        pc.getProfesor().getId(),
                                        pc.getProfesor()
                                                .getUsuario()
                                                .getNombre(),
                                        alumnoRepository
                                                .countByCursoId(
                                                        pc.getCurso().getId()
                                                )
                                )
                )
                .toList();
    }

    public List<AlumnoCursoResponse>
            listarAlumnosPorCurso(
                    Long cursoId
            ) {

        return alumnoRepository
                .findByCursoId(cursoId)
                .stream()
                .map(this::toAlumnoResponse)
                .toList();
    }

    public List<AlumnoCursoResponse>
            listarAlumnosPorApoderado(
                    Long apoderadoId
            ) {

        return apoderadoAlumnoRepository
                .findByApoderadoId(apoderadoId)
                .stream()
                .map(ApoderadoAlumno::getAlumno)
                .map(this::toAlumnoResponse)
                .toList();
    }

    public AlumnoCursoResponse obtenerAlumnoPorId(
            Long alumnoId
    ) {
        Alumno alumno = alumnoRepository
                .findById(alumnoId)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Alumno no encontrado."
                        )
                );

        return toAlumnoResponse(alumno);
    }

    @Transactional
    public Curso crearCurso(
            CursoCreateRequest request
    ) {
        String nombre = request.getNombre() == null
                ? ""
                : request.getNombre().trim();

        String nivel = request.getNivel() == null
                ? ""
                : request.getNivel().trim();

        validarNombreCurso(nombre, nivel);

        if (
                cursoRepository
                        .existsByNombreIgnoreCase(nombre)
        ) {
            throw new IllegalArgumentException(
                    "El curso ya existe"
            );
        }

        Curso curso = new Curso();

        curso.setNombre(nombre);
        curso.setNivel(nivel);

        if (request.getProfesorJefeId() != null) {
            Profesor profesor = profesorRepository
                    .findById(
                            request.getProfesorJefeId()
                    )
                    .orElseThrow(
                            () -> new IllegalArgumentException(
                                    "Profesor no encontrado."
                            )
                    );

            curso.setProfesorJefe(profesor);
        }

        return cursoRepository.save(curso);
    }

    @Transactional
    public void eliminarCurso(
            Long cursoId
    ) {
        Curso curso = cursoRepository
                .findById(cursoId)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Curso no encontrado."
                        )
                );

        List<Alumno> alumnosCurso =
                alumnoRepository
                        .findByCursoId(cursoId);

        for (Alumno alumno : alumnosCurso) {
            alumno.setCurso(null);
            alumno.setCursoTexto(null);
            alumnoRepository.save(alumno);
        }

        cursoRepository.delete(curso);
    }

    @Transactional
    public ProfesorCurso asignarProfesor(
            AsignarProfesorRequest request
    ) {
        Profesor profesor = profesorRepository
                .findById(request.getProfesorId())
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Profesor no encontrado."
                        )
                );

        Curso curso = cursoRepository
                .findById(request.getCursoId())
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Curso no encontrado."
                        )
                );

        Asignatura asignatura = asignaturaRepository
                .findById(request.getAsignaturaId())
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Asignatura no encontrada."
                        )
                );

        boolean profesorImparteAsignatura =
                profesorAsignaturaRepository
                        .existsByProfesorIdAndAsignaturaId(
                                profesor.getId(),
                                asignatura.getId()
                        );

        if (!profesorImparteAsignatura) {
            throw new IllegalArgumentException(
                    "El profesor no imparte la asignatura seleccionada."
            );
        }

        boolean asignacionExistente =
                profesorCursoRepository
                        .existsByProfesorIdAndCursoIdAndAsignaturaIgnoreCase(
                                profesor.getId(),
                                curso.getId(),
                                asignatura.getNombre()
                        );

        if (asignacionExistente) {
            throw new IllegalArgumentException(
                    "El profesor ya tiene esa asignatura asignada en el curso."
            );
        }

        ProfesorCurso asignacion =
                new ProfesorCurso();

        asignacion.setProfesor(profesor);
        asignacion.setCurso(curso);
        asignacion.setAsignatura(
                asignatura.getNombre()
        );

        if (curso.getProfesorJefe() == null) {
            curso.setProfesorJefe(profesor);
            cursoRepository.save(curso);
        }

        return profesorCursoRepository
                .save(asignacion);
    }

    @Transactional
    public AlumnoAsignacionResponse asignarAlumnoCurso(
            AsignarAlumnoCursoRequest request
    ) {
        Alumno alumno = alumnoRepository
                .findById(request.getAlumnoId())
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Alumno no encontrado."
                        )
                );

        Curso curso = cursoRepository
                .findById(request.getCursoId())
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Curso no encontrado."
                        )
                );

        alumno.setCurso(curso);
        alumno.setCursoTexto(curso.getNombre());

        Alumno alumnoGuardado =
                alumnoRepository.save(alumno);

        return new AlumnoAsignacionResponse(
                alumnoGuardado.getId(),
                alumnoGuardado.getCodigoAlumno(),
                alumnoGuardado.getUsuario().getNombre(),
                curso.getId(),
                curso.getNombre()
        );
    }

    @Transactional
    public ApoderadoAlumnoAsignacionResponse
            asignarApoderadoAlumno(
                    AsignarApoderadoAlumnoRequest request
            ) {

        Apoderado apoderado =
                apoderadoRepository
                        .findById(
                                request.getApoderadoId()
                        )
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Apoderado no encontrado."
                                )
                        );

        Alumno alumno =
                alumnoRepository
                        .findById(
                                request.getAlumnoId()
                        )
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Alumno no encontrado."
                                )
                        );

        boolean existe =
                apoderadoAlumnoRepository
                        .existsByApoderadoIdAndAlumnoId(
                                apoderado.getId(),
                                alumno.getId()
                        );

        if (existe) {
            throw new IllegalArgumentException(
                    "El apoderado ya está asignado a ese alumno."
            );
        }

        ApoderadoAlumno relacion =
                new ApoderadoAlumno();

        relacion.setApoderado(apoderado);
        relacion.setAlumno(alumno);
        relacion.setParentesco(null);

        ApoderadoAlumno guardada =
                apoderadoAlumnoRepository
                        .save(relacion);

        return new ApoderadoAlumnoAsignacionResponse(
                guardada.getId(),
                apoderado.getId(),
                apoderado.getUsuario().getNombre(),
                alumno.getId(),
                alumno.getCodigoAlumno(),
                alumno.getUsuario().getNombre(),
                null
        );
    }

    private void validarNombreCurso(
            String nombre,
            String nivel
    ) {
        if ("Basica".equalsIgnoreCase(nivel)) {
            if (
                    !nombre.matches(
                            "^[1-8]° Basico [A-F]$"
                    )
            ) {
                throw new IllegalArgumentException(
                        "El nombre del curso no es válido."
                );
            }

            return;
        }

        if ("Media".equalsIgnoreCase(nivel)) {
            if (
                    !nombre.matches(
                            "^[1-4]° Medio [A-F]$"
                    )
            ) {
                throw new IllegalArgumentException(
                        "El nombre del curso no es válido."
                );
            }

            return;
        }

        throw new IllegalArgumentException(
                "El nivel debe ser Basica o Media."
        );
    }

    private CursoListadoResponse toCursoListadoResponse(
            Curso curso
    ) {
        Set<String> nombresProfesores =
                new LinkedHashSet<>();

        if (curso.getProfesorJefe() != null) {
            nombresProfesores.add(
                    curso.getProfesorJefe()
                            .getUsuario()
                            .getNombre()
            );
        }

        profesorCursoRepository
                .findByCursoId(curso.getId())
                .stream()
                .map(ProfesorCurso::getProfesor)
                .map(Profesor::getUsuario)
                .map(usuario -> usuario.getNombre())
                .forEach(nombresProfesores::add);

        return new CursoListadoResponse(
                curso.getId(),
                curso.getNombre(),
                curso.getNivel(),
                nombresProfesores
                        .stream()
                        .toList()
        );
    }

    private AlumnoCursoResponse toAlumnoResponse(
            Alumno alumno
    ) {
        Long cursoId =
                alumno.getCurso() != null
                        ? alumno.getCurso().getId()
                        : null;

        String cursoNombre =
                alumno.getCurso() != null
                        ? alumno.getCurso().getNombre()
                        : alumno.getCursoTexto();

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