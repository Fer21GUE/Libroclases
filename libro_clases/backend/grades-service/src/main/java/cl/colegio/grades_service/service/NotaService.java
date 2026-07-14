package cl.colegio.grades_service.service;

import cl.colegio.grades_service.dto.NotaCreateRequest;
import cl.colegio.grades_service.dto.NotaResponse;
import cl.colegio.grades_service.dto.NotaUpdateRequest;
import cl.colegio.grades_service.entity.Alumno;
import cl.colegio.grades_service.entity.Curso;
import cl.colegio.grades_service.entity.Nota;
import cl.colegio.grades_service.entity.Profesor;
import cl.colegio.grades_service.repository.AlumnoRepository;
import cl.colegio.grades_service.repository.CursoRepository;
import cl.colegio.grades_service.repository.NotaRepository;
import cl.colegio.grades_service.repository.ProfesorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class NotaService {

    private final NotaRepository notaRepository;
    private final AlumnoRepository alumnoRepository;
    private final CursoRepository cursoRepository;
    private final ProfesorRepository profesorRepository;

    public NotaService(
            NotaRepository notaRepository,
            AlumnoRepository alumnoRepository,
            CursoRepository cursoRepository,
            ProfesorRepository profesorRepository
    ) {
        this.notaRepository = notaRepository;
        this.alumnoRepository = alumnoRepository;
        this.cursoRepository = cursoRepository;
        this.profesorRepository =
                profesorRepository;
    }

    public List<NotaResponse> listar() {
        return notaRepository
                .findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<NotaResponse> listarPorAlumno(
            Long alumnoId
    ) {
        return notaRepository
                .findByAlumnoId(alumnoId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<NotaResponse> listarPorProfesor(
            Long profesorId
    ) {
        return notaRepository
                .findByProfesorId(profesorId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<NotaResponse>
            listarPorProfesorUsuarioCursoAsignatura(
                    Long profesorUsuarioId,
                    Long cursoId,
                    String asignatura
            ) {

        Profesor profesor =
                buscarProfesorPorUsuario(
                        profesorUsuarioId
                );

        if (
                cursoId == null ||
                !cursoRepository.existsById(cursoId)
        ) {
            throw new IllegalArgumentException(
                    "Curso no encontrado."
            );
        }

        String asignaturaNormalizada =
                normalizarAsignatura(
                        asignatura
                );

        return notaRepository
                .findByProfesorIdAndCursoIdAndAsignaturaIgnoreCaseOrderByFechaDesc(
                        profesor.getId(),
                        cursoId,
                        asignaturaNormalizada
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public NotaResponse crear(
            NotaCreateRequest request
    ) {
        Alumno alumno = alumnoRepository
                .findById(
                        request.getAlumnoId()
                )
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Alumno no encontrado."
                        )
                );

        Curso curso = null;

        if (request.getCursoId() != null) {
            curso = cursoRepository
                    .findById(
                            request.getCursoId()
                    )
                    .orElseThrow(
                            () -> new IllegalArgumentException(
                                    "Curso no encontrado."
                            )
                    );
        }

        Profesor profesor = null;

        if (request.getProfesorId() != null) {
            profesor = profesorRepository
                    .findById(
                            request.getProfesorId()
                    )
                    .orElseThrow(
                            () -> new IllegalArgumentException(
                                    "Profesor no encontrado."
                            )
                    );
        }

        BigDecimal notaValidada =
                validarNota(
                        request.getNota()
                );

        Nota nota = new Nota();

        nota.setAlumno(alumno);
        nota.setCurso(curso);
        nota.setProfesor(profesor);

        nota.setAsignatura(
                normalizarAsignatura(
                        request.getAsignatura()
                )
        );

        nota.setNota(notaValidada);

        nota.setDescripcion(
                normalizarDescripcion(
                        request.getDescripcion()
                )
        );

        return toResponse(
                notaRepository.save(nota)
        );
    }

    @Transactional
    public NotaResponse actualizar(
            Long notaId,
            NotaUpdateRequest request
    ) {
        Profesor profesor =
                buscarProfesorPorUsuario(
                        request
                                .getProfesorUsuarioId()
                );

        Nota nota = notaRepository
                .findByIdAndProfesorId(
                        notaId,
                        profesor.getId()
                )
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "La nota no existe o no fue registrada por este profesor."
                        )
                );

        nota.setNota(
                validarNota(
                        request.getNota()
                )
        );

        nota.setDescripcion(
                normalizarDescripcion(
                        request.getDescripcion()
                )
        );

        return toResponse(
                notaRepository.save(nota)
        );
    }

    private Profesor buscarProfesorPorUsuario(
            Long profesorUsuarioId
    ) {
        if (profesorUsuarioId == null) {
            throw new IllegalArgumentException(
                    "Debe indicar el profesor."
            );
        }

        return profesorRepository
                .findByUsuarioId(
                        profesorUsuarioId
                )
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Profesor no encontrado."
                        )
                );
    }

    private BigDecimal validarNota(
            BigDecimal valor
    ) {
        if (valor == null) {
            throw new IllegalArgumentException(
                    "Debe ingresar una nota."
            );
        }

        if (valor.scale() > 2) {
            throw new IllegalArgumentException(
                    "La nota solo puede tener hasta dos decimales."
            );
        }

        if (
                valor.compareTo(
                        new BigDecimal("1.00")
                ) < 0
                || valor.compareTo(
                        new BigDecimal("7.00")
                ) > 0
        ) {
            throw new IllegalArgumentException(
                    "La nota debe estar entre 1,00 y 7,00."
            );
        }

        return valor.setScale(
                2,
                RoundingMode.UNNECESSARY
        );
    }

    private String normalizarAsignatura(
            String asignatura
    ) {
        if (
                asignatura == null ||
                asignatura.trim().isEmpty()
        ) {
            throw new IllegalArgumentException(
                    "Debe indicar la asignatura."
            );
        }

        return asignatura.trim();
    }

    private String normalizarDescripcion(
            String descripcion
    ) {
        if (descripcion == null) {
            return "";
        }

        String valor =
                descripcion.trim();

        if (valor.length() > 150) {
            throw new IllegalArgumentException(
                    "La descripción puede tener como máximo 150 caracteres."
            );
        }

        return valor;
    }

    private NotaResponse toResponse(
            Nota nota
    ) {
        Long alumnoId =
                nota.getAlumno() != null
                        ? nota.getAlumno().getId()
                        : null;

        Long cursoId =
                nota.getCurso() != null
                        ? nota.getCurso().getId()
                        : null;

        Long profesorId =
                nota.getProfesor() != null
                        ? nota.getProfesor().getId()
                        : null;

        return new NotaResponse(
                nota.getId(),
                alumnoId,
                cursoId,
                profesorId,
                nota.getAsignatura(),
                nota.getNota(),
                nota.getDescripcion(),
                nota.getFecha()
        );
    }
}