package cl.colegio.attendance_service;

import cl.colegio.attendance_service.dto.AsistenciaCreateRequest;
import cl.colegio.attendance_service.dto.AsistenciaResponse;
import cl.colegio.attendance_service.entity.Alumno;
import cl.colegio.attendance_service.entity.Asistencia;
import cl.colegio.attendance_service.entity.Curso;
import cl.colegio.attendance_service.entity.Profesor;
import cl.colegio.attendance_service.entity.Usuario;
import cl.colegio.attendance_service.repository.AlumnoRepository;
import cl.colegio.attendance_service.repository.AsistenciaRepository;
import cl.colegio.attendance_service.repository.CursoRepository;
import cl.colegio.attendance_service.repository.ProfesorRepository;
import cl.colegio.attendance_service.service.AsistenciaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceApplicationTests {
    @Mock private AsistenciaRepository asistenciaRepository;
    @Mock private AlumnoRepository alumnoRepository;
    @Mock private CursoRepository cursoRepository;
    @Mock private ProfesorRepository profesorRepository;

    private AsistenciaService asistenciaService;

    @BeforeEach
    void setUp() {
        asistenciaService = new AsistenciaService(asistenciaRepository, alumnoRepository, cursoRepository, profesorRepository);
    }

    @Test
    void registrarAsistenciaPresenteConObservacion() {
        // Revisa el caso común: profesor marca presente y deja una observación corta.
        LocalDate fecha = LocalDate.of(2026, 6, 15);
        AsistenciaCreateRequest request = new AsistenciaCreateRequest();
        request.setAlumnoId(1L);
        request.setCursoId(1L);
        request.setProfesorId(2L);
        request.setFecha(fecha);
        request.setEstado("presente");
        request.setObservacion("Participó en clases");

        Alumno alumno = alumnoConCurso(1L, "Matías Rojas");
        Curso curso = alumno.getCurso();
        Profesor profesor = profesor(2L, "María Soto");

        when(alumnoRepository.findById(1L)).thenReturn(Optional.of(alumno));
        when(cursoRepository.findById(1L)).thenReturn(Optional.of(curso));
        when(profesorRepository.findById(2L)).thenReturn(Optional.of(profesor));
        when(asistenciaRepository.findByAlumnoIdAndFecha(1L, fecha)).thenReturn(Optional.empty());
        when(asistenciaRepository.save(any(Asistencia.class))).thenAnswer(invocation -> {
            Asistencia asistencia = invocation.getArgument(0);
            asistencia.setId(30L);
            return asistencia;
        });

        AsistenciaResponse response = asistenciaService.registrar(request);

        assertEquals(30L, response.getId());
        assertEquals("presente", response.getEstado());
        assertTrue(response.getPresente());
        assertEquals("Participó en clases", response.getObservacion());
        assertEquals("Matías Rojas", response.getAlumnoNombre());
        assertEquals("María Soto", response.getProfesorNombre());
    }

    @Test
    void registrarAsistenciaAusenteCuandoPresenteEsFalso() {
        // Si no llega estado escrito y presente viene en false, se guarda como ausente.
        LocalDate fecha = LocalDate.of(2026, 6, 16);
        AsistenciaCreateRequest request = new AsistenciaCreateRequest();
        request.setAlumnoId(1L);
        request.setFecha(fecha);
        request.setPresente(false);

        Alumno alumno = alumnoConCurso(1L, "Matías Rojas");

        when(alumnoRepository.findById(1L)).thenReturn(Optional.of(alumno));
        when(asistenciaRepository.findByAlumnoIdAndFecha(1L, fecha)).thenReturn(Optional.empty());
        when(asistenciaRepository.save(any(Asistencia.class))).thenAnswer(invocation -> {
            Asistencia asistencia = invocation.getArgument(0);
            asistencia.setId(31L);
            return asistencia;
        });

        AsistenciaResponse response = asistenciaService.registrar(request);

        assertEquals("ausente", response.getEstado());
        assertFalse(response.getPresente());
        assertEquals(1L, response.getCursoId());
        assertEquals("1° Medio A", response.getCursoNombre());
        verify(cursoRepository, never()).findById(any());
    }

    private Alumno alumnoConCurso(Long id, String nombre) {
        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);

        Curso curso = new Curso();
        curso.setId(1L);
        curso.setNombre("1° Medio A");

        Alumno alumno = new Alumno();
        alumno.setId(id);
        alumno.setUsuario(usuario);
        alumno.setCurso(curso);
        return alumno;
    }

    private Profesor profesor(Long id, String nombre) {
        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);

        Profesor profesor = new Profesor();
        profesor.setId(id);
        profesor.setUsuario(usuario);
        return profesor;
    }
}
