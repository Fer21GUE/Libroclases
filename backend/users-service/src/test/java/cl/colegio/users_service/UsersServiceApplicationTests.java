package cl.colegio.users_service;

import cl.colegio.users_service.dto.AsignarProfesorRequest;
import cl.colegio.users_service.dto.PerfilUsuarioResponse;
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
    @Mock private ApoderadoAlumnoRepository apoderadoAlumnoRepository;

    private UsuarioService usuarioService;
    private CursoService cursoService;

    @BeforeEach
    void setUp() {
        usuarioService = new UsuarioService(usuarioRepository, profesorRepository, alumnoRepository, apoderadoRepository, cursoRepository);
        cursoService = new CursoService(cursoRepository, profesorRepository, profesorCursoRepository, alumnoRepository, apoderadoAlumnoRepository);
    }

    @Test
    void crearAlumnoGuardaPerfilAlumno() {
        // Sirve para revisar que al crear un usuario alumno también se cree su registro en alumnos.
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

    @Test
    void crearProfesorGuardaEspecialidadYCodigo() {
        // Revisa que el rol profesor genere su ficha de profesor con código y especialidad.
        UsuarioCreateRequest request = new UsuarioCreateRequest();
        request.setNombre("Ana Torres");
        request.setEmail("ana@colegio.cl");
        request.setPassword("Profesor123");
        request.setRol("profesor");
        request.setCodigoProfesor("PROF-010");
        request.setEspecialidad("Historia");

        when(usuarioRepository.existsByEmailIgnoreCase("ana@colegio.cl")).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario usuario = invocation.getArgument(0);
            usuario.setId(20L);
            return usuario;
        });

        Usuario creado = usuarioService.crear(request);

        assertEquals("profesor", creado.getRol());

        ArgumentCaptor<Profesor> profesorCaptor = ArgumentCaptor.forClass(Profesor.class);
        verify(profesorRepository).save(profesorCaptor.capture());

        Profesor profesorGuardado = profesorCaptor.getValue();
        assertEquals("PROF-010", profesorGuardado.getCodigoProfesor());
        assertEquals("Historia", profesorGuardado.getEspecialidad());
        assertEquals(creado, profesorGuardado.getUsuario());
    }

    @Test
    void obtenerPerfilAlumnoDevuelveCursoYAlumnoId() {
        // Esta prueba ayuda a evitar el problema típico entre usuarioId y alumnoId.
        Usuario usuario = new Usuario();
        usuario.setId(4L);
        usuario.setNombre("Matías Rojas");
        usuario.setEmail("alumno@colegio.cl");
        usuario.setRol("alumno");

        Curso curso = new Curso();
        curso.setId(1L);
        curso.setNombre("1° Medio A");

        Alumno alumno = new Alumno();
        alumno.setId(1L);
        alumno.setUsuario(usuario);
        alumno.setCurso(curso);

        when(usuarioRepository.findById(4L)).thenReturn(Optional.of(usuario));
        when(profesorRepository.findByUsuarioId(4L)).thenReturn(Optional.empty());
        when(alumnoRepository.findByUsuarioId(4L)).thenReturn(Optional.of(alumno));
        when(apoderadoRepository.findByUsuarioId(4L)).thenReturn(Optional.empty());

        PerfilUsuarioResponse perfil = usuarioService.obtenerPerfil(4L);

        assertEquals(4L, perfil.getUsuarioId());
        assertEquals(1L, perfil.getAlumnoId());
        assertEquals(1L, perfil.getCursoId());
        assertEquals("1° Medio A", perfil.getCursoNombre());
        assertEquals("alumno", perfil.getRol());
    }

    @Test
    void asignarProfesorDefineProfesorJefeSiCursoNoTiene() {
        // Cuando un curso no tiene profesor jefe, la primera asignación lo deja asociado.
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
