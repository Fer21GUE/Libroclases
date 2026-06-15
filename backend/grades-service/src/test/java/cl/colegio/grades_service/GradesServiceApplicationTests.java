package cl.colegio.grades_service;

import cl.colegio.grades_service.dto.EvaluacionCreateRequest;
import cl.colegio.grades_service.dto.EvaluacionResponse;
import cl.colegio.grades_service.dto.NotaCreateRequest;
import cl.colegio.grades_service.dto.NotaResponse;
import cl.colegio.grades_service.entity.Alumno;
import cl.colegio.grades_service.entity.Curso;
import cl.colegio.grades_service.entity.Evaluacion;
import cl.colegio.grades_service.entity.Nota;
import cl.colegio.grades_service.entity.Profesor;
import cl.colegio.grades_service.repository.AlumnoRepository;
import cl.colegio.grades_service.repository.CursoRepository;
import cl.colegio.grades_service.repository.EvaluacionRepository;
import cl.colegio.grades_service.repository.NotaRepository;
import cl.colegio.grades_service.repository.ProfesorRepository;
import cl.colegio.grades_service.service.EvaluacionService;
import cl.colegio.grades_service.service.NotaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GradesServiceApplicationTests {
    @Mock private NotaRepository notaRepository;
    @Mock private AlumnoRepository alumnoRepository;
    @Mock private CursoRepository cursoRepository;
    @Mock private ProfesorRepository profesorRepository;
    @Mock private EvaluacionRepository evaluacionRepository;

    private NotaService notaService;
    private EvaluacionService evaluacionService;

    @BeforeEach
    void setUp() {
        notaService = new NotaService(notaRepository, alumnoRepository, cursoRepository, profesorRepository);
        evaluacionService = new EvaluacionService(evaluacionRepository, cursoRepository, profesorRepository, alumnoRepository);
    }

    @Test
    void crearNotaGuardaDescripcionCursoYProfesor() {
        // Verifica que la descripción escrita por el profesor no se pierda al guardar la nota.
        NotaCreateRequest request = new NotaCreateRequest();
        request.setAlumnoId(1L);
        request.setCursoId(1L);
        request.setProfesorId(2L);
        request.setAsignatura("Matemática");
        request.setNota(new BigDecimal("6.4"));
        request.setDescripcion("Prueba unidad 2");

        Alumno alumno = new Alumno();
        alumno.setId(1L);
        Curso curso = new Curso();
        curso.setId(1L);
        curso.setNombre("1° Medio A");
        Profesor profesor = new Profesor();
        profesor.setId(2L);

        when(alumnoRepository.findById(1L)).thenReturn(Optional.of(alumno));
        when(cursoRepository.findById(1L)).thenReturn(Optional.of(curso));
        when(profesorRepository.findById(2L)).thenReturn(Optional.of(profesor));
        when(notaRepository.save(any(Nota.class))).thenAnswer(invocation -> {
            Nota nota = invocation.getArgument(0);
            nota.setId(15L);
            return nota;
        });

        NotaResponse response = notaService.crear(request);

        assertEquals(15L, response.getId());
        assertEquals(1L, response.getAlumnoId());
        assertEquals(1L, response.getCursoId());
        assertEquals(2L, response.getProfesorId());
        assertEquals("Matemática", response.getAsignatura());
        assertEquals("Prueba unidad 2", response.getDescripcion());
        assertEquals(new BigDecimal("6.4"), response.getNota());
    }

    @Test
    void crearEvaluacionGuardaCursoFechaYAsignatura() {
        // Sirve para asegurar que el calendario recibe curso, fecha y datos principales.
        EvaluacionCreateRequest request = new EvaluacionCreateRequest();
        request.setCursoId(1L);
        request.setProfesorId(2L);
        request.setAsignatura("Lenguaje");
        request.setTitulo("Control de lectura");
        request.setDescripcion("Lectura domiciliaria");
        request.setFecha(LocalDate.of(2026, 7, 10));
        request.setTipo("Control");

        Curso curso = new Curso();
        curso.setId(1L);
        curso.setNombre("1° Medio A");
        Profesor profesor = new Profesor();
        profesor.setId(2L);

        when(cursoRepository.findById(1L)).thenReturn(Optional.of(curso));
        when(profesorRepository.findById(2L)).thenReturn(Optional.of(profesor));
        when(evaluacionRepository.save(any(Evaluacion.class))).thenAnswer(invocation -> {
            Evaluacion evaluacion = invocation.getArgument(0);
            evaluacion.setId(7L);
            return evaluacion;
        });

        EvaluacionResponse response = evaluacionService.crear(request);

        assertEquals(7L, response.getId());
        assertEquals(1L, response.getCursoId());
        assertEquals("1° Medio A", response.getCursoNombre());
        assertEquals(2L, response.getProfesorId());
        assertEquals("Lenguaje", response.getAsignatura());
        assertEquals("Control de lectura", response.getTitulo());
        assertEquals(LocalDate.of(2026, 7, 10), response.getFecha());
        assertEquals("Control", response.getTipo());
    }
}
