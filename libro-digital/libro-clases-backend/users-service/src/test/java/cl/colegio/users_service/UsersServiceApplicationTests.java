package cl.colegio.users_service;

import cl.colegio.users_service.dto.AsignarProfesorRequest;
import cl.colegio.users_service.dto.UsuarioCreateRequest;
import cl.colegio.users_service.entity.*;
import cl.colegio.users_service.repository.*;
import cl.colegio.users_service.service.CursoService;
import cl.colegio.users_service.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsersServiceApplicationTests {
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private ProfesorRepository profesorRepository;
    @Mock private AlumnoRepository alumnoRepository;
    @Mock private ApoderadoRepository apoderadoRepository;
    @Mock private CursoRepository cursoRepository;
    @Mock private ProfesorCursoRepository profesorCursoRepository;

    private UsuarioService usuarioService;
    private CursoService cursoService;

    @BeforeEach
    void setUp() {
        usuarioService = new UsuarioService(usuarioRepository, profesorRepository, alumnoRepository, apoderadoRepository, cursoRepository);
        cursoService = new CursoService(cursoRepository, profesorRepository, profesorCursoRepository);
    }

    // Verifica que al crear un alumno se guarde el usuario principal y su registro asociado como alumno.
    @Test
    void crearAlumno() {
        UsuarioCreateRequest request = new UsuarioCreateRequest();
        request.setNombre("Juan Perez");
        request.setEmail("juan@colegio.cl");
        request.setPassword("Alumno123");
        request.setRol("alumno");
        request.setCodigoAlumno("ALU-100");
        request.setCursoId(1L);

        Curso curso = new Curso();
        curso.setId(1L);
        curso.setNombre("1° Medio A");

        when(usuarioRepository.existsByEmailIgnoreCase("juan@colegio.cl")).thenReturn(false);
        when(cursoRepository.findById(1L)).thenReturn(Optional.of(curso));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario usuario = invocation.getArgument(0);
            usuario.setId(10L);
            return usuario;
        });

        Usuario creado = usuarioService.crear(request);

        assertEquals(10L, creado.getId());
        assertEquals("Juan Perez", creado.getNombre());
        assertEquals("juan@colegio.cl", creado.getEmail());
        assertEquals("alumno", creado.getRol());
        assertTrue(creado.getActivo());
        assertNotEquals("Alumno123", creado.getPassword());

        ArgumentCaptor<Alumno> alumnoCaptor = ArgumentCaptor.forClass(Alumno.class);
        verify(alumnoRepository).save(alumnoCaptor.capture());

        Alumno alumnoGuardado = alumnoCaptor.getValue();
        assertEquals("ALU-100", alumnoGuardado.getCodigoAlumno());
        assertEquals(creado, alumnoGuardado.getUsuario());
        assertEquals(curso, alumnoGuardado.getCurso());
        assertEquals("1° Medio A", alumnoGuardado.getCursoTexto());
    }

    // Verifica que al eliminar un usuario existente se llame correctamente al repositorio para borrarlo por ID.
    @Test
    void eliminarUsuario() {
        when(usuarioRepository.existsById(5L)).thenReturn(true);

        usuarioService.eliminar(5L);

        verify(usuarioRepository).deleteById(5L);
    }

    // Verifica que al asignar un profesor a un curso se cree la asignación y el curso quede actualizado.
    @Test
    void asignarProfesor() {
        AsignarProfesorRequest request = new AsignarProfesorRequest();
        request.setProfesorId(3L);
        request.setCursoId(5L);
        request.setAsignatura("Inglés");

        Usuario usuario = new Usuario();
        usuario.setNombre("Fernando Guerrero");

        Profesor profesor = new Profesor();
        profesor.setId(3L);
        profesor.setUsuario(usuario);

        Curso curso = new Curso();
        curso.setId(5L);
        curso.setNombre("2° Medio C");
        curso.setNivel("Media");
        curso.setProfesorJefe(null);

        when(profesorRepository.findById(3L)).thenReturn(Optional.of(profesor));
        when(cursoRepository.findById(5L)).thenReturn(Optional.of(curso));
        when(profesorCursoRepository.save(any(ProfesorCurso.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProfesorCurso asignacion = cursoService.asignarProfesor(request);

        assertEquals(profesor, asignacion.getProfesor());
        assertEquals(curso, asignacion.getCurso());
        assertEquals("Inglés", asignacion.getAsignatura());
        assertEquals(profesor, curso.getProfesorJefe());

        verify(cursoRepository).save(curso);
        verify(profesorCursoRepository).save(asignacion);
    }
}