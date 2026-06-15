package cl.colegio.users_service.service;

import cl.colegio.users_service.dto.PerfilUsuarioResponse;
import cl.colegio.users_service.dto.UsuarioCreateRequest;
import cl.colegio.users_service.entity.*;
import cl.colegio.users_service.repository.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final ProfesorRepository profesorRepository;
    private final AlumnoRepository alumnoRepository;
    private final ApoderadoRepository apoderadoRepository;
    private final CursoRepository cursoRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioService(UsuarioRepository usuarioRepository, ProfesorRepository profesorRepository, AlumnoRepository alumnoRepository, ApoderadoRepository apoderadoRepository, CursoRepository cursoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.profesorRepository = profesorRepository;
        this.alumnoRepository = alumnoRepository;
        this.apoderadoRepository = apoderadoRepository;
        this.cursoRepository = cursoRepository;
    }

    public List<Usuario> listar() { return usuarioRepository.findAll(); }

    public PerfilUsuarioResponse obtenerPerfil(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));

        Profesor profesor = profesorRepository.findByUsuarioId(usuarioId).orElse(null);
        Alumno alumno = alumnoRepository.findByUsuarioId(usuarioId).orElse(null);
        Apoderado apoderado = apoderadoRepository.findByUsuarioId(usuarioId).orElse(null);

        Long profesorId = profesor != null ? profesor.getId() : null;
        Long alumnoId = alumno != null ? alumno.getId() : null;
        Long apoderadoId = apoderado != null ? apoderado.getId() : null;
        Long cursoId = alumno != null && alumno.getCurso() != null ? alumno.getCurso().getId() : null;
        String cursoNombre = alumno != null && alumno.getCurso() != null ? alumno.getCurso().getNombre() : null;
        String especialidad = profesor != null ? profesor.getEspecialidad() : null;

        return new PerfilUsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol(),
                profesorId,
                alumnoId,
                apoderadoId,
                cursoId,
                cursoNombre,
                especialidad
        );
    }

    @Transactional
    public Usuario crear(UsuarioCreateRequest request) {
        if (usuarioRepository.existsByEmailIgnoreCase(request.getEmail())) throw new IllegalArgumentException("Ya existe un usuario con ese correo.");
        String rol = request.getRol().trim().toLowerCase();

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre().trim());
        usuario.setEmail(request.getEmail().trim().toLowerCase());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rol);
        usuario.setActivo(true);

        Usuario saved = usuarioRepository.save(usuario);

        if ("profesor".equals(rol)) {
            Profesor profesor = new Profesor();
            profesor.setUsuario(saved);
            profesor.setCodigoProfesor(nonBlank(request.getCodigoProfesor(), "PROF-" + saved.getId()));
            profesor.setEspecialidad(request.getEspecialidad());
            profesorRepository.save(profesor);
        } else if ("alumno".equals(rol)) {
            Alumno alumno = new Alumno();
            alumno.setUsuario(saved);
            alumno.setCodigoAlumno(nonBlank(request.getCodigoAlumno(), "ALU-" + saved.getId()));
            if (request.getCursoId() != null) {
                Curso curso = cursoRepository.findById(request.getCursoId()).orElseThrow(() -> new IllegalArgumentException("Curso no encontrado."));
                alumno.setCurso(curso);
                alumno.setCursoTexto(curso.getNombre());
            }
            alumnoRepository.save(alumno);
        } else if ("apoderado".equals(rol)) {
            Apoderado apoderado = new Apoderado();
            apoderado.setUsuario(saved);
            apoderado.setTelefono(request.getTelefono());
            apoderadoRepository.save(apoderado);
        }

        return saved;
    }

    private String nonBlank(String value, String fallback) { return value == null || value.isBlank() ? fallback : value.trim(); }
}
