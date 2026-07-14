package cl.colegio.users_service.service;

import cl.colegio.users_service.dto.PerfilUsuarioResponse;
import cl.colegio.users_service.dto.UsuarioCreateRequest;
import cl.colegio.users_service.dto.UsuarioListadoResponse;
import cl.colegio.users_service.entity.*;
import cl.colegio.users_service.repository.*;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.regex.Pattern;

@Service
public class UsuarioService {

    private static final String DOMINIO_CORREO =
            "@colegio.cl";

    private static final Pattern DIACRITICOS =
            Pattern.compile("\\p{M}+");

    private final UsuarioRepository usuarioRepository;
    private final ProfesorRepository profesorRepository;
    private final AlumnoRepository alumnoRepository;
    private final ApoderadoRepository apoderadoRepository;
    private final CursoRepository cursoRepository;
    private final AsignaturaRepository asignaturaRepository;
    private final ProfesorAsignaturaRepository
            profesorAsignaturaRepository;

    private final PasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            ProfesorRepository profesorRepository,
            AlumnoRepository alumnoRepository,
            ApoderadoRepository apoderadoRepository,
            CursoRepository cursoRepository,
            AsignaturaRepository asignaturaRepository,
            ProfesorAsignaturaRepository
                    profesorAsignaturaRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.profesorRepository = profesorRepository;
        this.alumnoRepository = alumnoRepository;
        this.apoderadoRepository = apoderadoRepository;
        this.cursoRepository = cursoRepository;
        this.asignaturaRepository =
                asignaturaRepository;
        this.profesorAsignaturaRepository =
                profesorAsignaturaRepository;
    }

    public List<UsuarioListadoResponse> listar() {
        return usuarioRepository
                .findAll()
                .stream()
                .map(this::crearRespuestaListado)
                .toList();
    }

    public PerfilUsuarioResponse obtenerPerfil(
            Long usuarioId
    ) {
        Usuario usuario = usuarioRepository
                .findById(usuarioId)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Usuario no encontrado."
                        )
                );

        Profesor profesor = profesorRepository
                .findByUsuarioId(usuarioId)
                .orElse(null);

        Alumno alumno = alumnoRepository
                .findByUsuarioId(usuarioId)
                .orElse(null);

        Apoderado apoderado = apoderadoRepository
                .findByUsuarioId(usuarioId)
                .orElse(null);

        Long profesorId =
                profesor != null
                        ? profesor.getId()
                        : null;

        Long alumnoId =
                alumno != null
                        ? alumno.getId()
                        : null;

        Long apoderadoId =
                apoderado != null
                        ? apoderado.getId()
                        : null;

        Long cursoId =
                alumno != null &&
                alumno.getCurso() != null
                        ? alumno.getCurso().getId()
                        : null;

        String cursoNombre =
                alumno != null &&
                alumno.getCurso() != null
                        ? alumno.getCurso().getNombre()
                        : null;

        String especialidad =
                profesor != null
                        ? profesor.getEspecialidad()
                        : null;

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
    public Usuario crear(
            UsuarioCreateRequest request
    ) {
        String rol = limpiarTexto(request.getRol())
                .toLowerCase(Locale.ROOT);

        validarRol(rol);

        List<Long> asignaturaIds =
                limpiarAsignaturaIds(
                        request.getAsignaturaIds()
                );

        List<Asignatura> asignaturas =
                validarYObtenerAsignaturas(
                        rol,
                        asignaturaIds
                );

        DatosUsuario datos;

        if ("admin".equals(rol)) {
            datos = crearDatosAdministrador(request);
        } else {
            datos = crearDatosPersona(request);
        }

        if (usuarioRepository.existsByEmailIgnoreCase(
                datos.email()
        )) {
            throw new IllegalArgumentException(
                    "Ya existe un usuario con el correo generado: "
                            + datos.email()
            );
        }

        if (
                datos.rut() != null &&
                usuarioRepository.existsByRut(datos.rut())
        ) {
            throw new IllegalArgumentException(
                    "Ya existe un usuario con ese RUT."
            );
        }

        Usuario usuario = new Usuario();

        usuario.setNombre(datos.nombreCompleto());
        usuario.setNombrePersona(datos.nombrePersona());
        usuario.setApellidoPaterno(
                datos.apellidoPaterno()
        );
        usuario.setApellidoMaterno(
                datos.apellidoMaterno()
        );
        usuario.setRut(datos.rut());
        usuario.setEmail(datos.email());

        usuario.setPassword(
                passwordEncoder.encode(datos.password())
        );

        usuario.setRol(rol);
        usuario.setActivo(true);

        Usuario saved =
                usuarioRepository.save(usuario);

        if ("profesor".equals(rol)) {
            crearProfesor(
                    saved,
                    request,
                    asignaturas
            );
        } else if ("alumno".equals(rol)) {
            crearAlumno(saved, request);
        } else if ("apoderado".equals(rol)) {
            crearApoderado(saved, request);
        }

        return saved;
    }

    private UsuarioListadoResponse crearRespuestaListado(
            Usuario usuario
    ) {
        String codigoUsuario = "-";

        if ("profesor".equalsIgnoreCase(
                usuario.getRol()
        )) {
            codigoUsuario = profesorRepository
                    .findByUsuarioId(usuario.getId())
                    .map(Profesor::getCodigoProfesor)
                    .orElse("-");
        } else if ("alumno".equalsIgnoreCase(
                usuario.getRol()
        )) {
            codigoUsuario = alumnoRepository
                    .findByUsuarioId(usuario.getId())
                    .map(Alumno::getCodigoAlumno)
                    .orElse("-");
        }

        return new UsuarioListadoResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol(),
                codigoUsuario,
                usuario.getActivo()
        );
    }

    private DatosUsuario crearDatosAdministrador(
            UsuarioCreateRequest request
    ) {
        String nombre =
                limpiarTexto(request.getNombre());

        String email =
                limpiarTexto(request.getEmail())
                        .toLowerCase(Locale.ROOT);

        String password =
                limpiarTexto(request.getPassword());

        if (nombre.isBlank()) {
            throw new IllegalArgumentException(
                    "Debe ingresar el nombre del administrador."
            );
        }

        if (email.isBlank()) {
            throw new IllegalArgumentException(
                    "Debe ingresar el correo del administrador."
            );
        }

        if (password.isBlank()) {
            throw new IllegalArgumentException(
                    "Debe ingresar la contraseña del administrador."
            );
        }

        return new DatosUsuario(
                nombre,
                nombre,
                null,
                null,
                null,
                email,
                password
        );
    }

    private DatosUsuario crearDatosPersona(
            UsuarioCreateRequest request
    ) {
        String nombres =
                normalizarEspacios(request.getNombre());

        String apellidos =
                normalizarEspacios(request.getApellidos());

        String rut =
                normalizarRut(request.getRut());

        if (nombres.isBlank()) {
            throw new IllegalArgumentException(
                    "Debe ingresar el nombre o nombres."
            );
        }

        if (apellidos.isBlank()) {
            throw new IllegalArgumentException(
                    "Debe ingresar los dos apellidos."
            );
        }

        String[] partesApellidos =
                apellidos.split("\\s+");

        if (partesApellidos.length < 2) {
            throw new IllegalArgumentException(
                    "Debe ingresar el apellido paterno y el apellido materno."
            );
        }

        String apellidoPaterno =
                partesApellidos[0];

        String apellidoMaterno =
                unirDesdeIndice(
                        partesApellidos,
                        1
                );

        if (!rutValido(rut)) {
            throw new IllegalArgumentException(
                    "El RUT ingresado no es válido."
            );
        }

        String emailBase =
                generarBaseCorreo(
                        nombres,
                        apellidoPaterno,
                        apellidoMaterno
                );

        String email =
                generarCorreoDisponible(emailBase);

        String password =
                generarPasswordInicial(
                        apellidoPaterno,
                        rut
                );

        String nombreCompleto =
                nombres
                        + " "
                        + apellidoPaterno
                        + " "
                        + apellidoMaterno;

        return new DatosUsuario(
                nombreCompleto,
                nombres,
                apellidoPaterno,
                apellidoMaterno,
                rut,
                email,
                password
        );
    }

    private void crearProfesor(
            Usuario usuario,
            UsuarioCreateRequest request,
            List<Asignatura> asignaturas
    ) {
        Profesor profesor = new Profesor();

        profesor.setUsuario(usuario);

        String codigo = nonBlank(
                request.getCodigoProfesor(),
                String.format(
                        "PROF-%03d",
                        usuario.getId()
                )
        );

        profesor.setCodigoProfesor(codigo);

        String especialidad = asignaturas
                .stream()
                .map(Asignatura::getNombre)
                .sorted()
                .reduce(
                        (primera, siguiente) ->
                                primera
                                + " | "
                                + siguiente
                )
                .orElse(null);

        profesor.setEspecialidad(especialidad);

        Profesor profesorGuardado =
                profesorRepository.save(profesor);

        for (Asignatura asignatura : asignaturas) {
            ProfesorAsignatura relacion =
                    new ProfesorAsignatura();

            relacion.setProfesor(profesorGuardado);
            relacion.setAsignatura(asignatura);

            profesorAsignaturaRepository
                    .save(relacion);
        }
    }

    private void crearAlumno(
            Usuario usuario,
            UsuarioCreateRequest request
    ) {
        Alumno alumno = new Alumno();

        alumno.setUsuario(usuario);

        String codigo = nonBlank(
                request.getCodigoAlumno(),
                String.format(
                        "ALU-%03d",
                        usuario.getId()
                )
        );

        alumno.setCodigoAlumno(codigo);

        if (request.getCursoId() != null) {
            Curso curso = cursoRepository
                    .findById(request.getCursoId())
                    .orElseThrow(
                            () ->
                                    new IllegalArgumentException(
                                            "Curso no encontrado."
                                    )
                    );

            alumno.setCurso(curso);
            alumno.setCursoTexto(
                    curso.getNombre()
            );
        }

        alumnoRepository.save(alumno);
    }

    private void crearApoderado(
            Usuario usuario,
            UsuarioCreateRequest request
    ) {
        Apoderado apoderado = new Apoderado();

        apoderado.setUsuario(usuario);

        apoderado.setTelefono(
                limpiarTexto(request.getTelefono())
        );

        apoderadoRepository.save(apoderado);
    }

    private List<Long> limpiarAsignaturaIds(
            List<Long> asignaturaIds
    ) {
        if (asignaturaIds == null) {
            return List.of();
        }

        return asignaturaIds
                .stream()
                .filter(Objects::nonNull)
                .distinct()
                .toList();
    }

    private List<Asignatura>
            validarYObtenerAsignaturas(
                    String rol,
                    List<Long> asignaturaIds
            ) {

        if (!"profesor".equals(rol)) {
            return List.of();
        }

        if (asignaturaIds.isEmpty()) {
            throw new IllegalArgumentException(
                    "Debe seleccionar al menos una asignatura para el profesor."
            );
        }

        List<Asignatura> asignaturas =
                asignaturaRepository
                        .findAllById(asignaturaIds);

        if (
                asignaturas.size()
                != asignaturaIds.size()
        ) {
            throw new IllegalArgumentException(
                    "Una o más asignaturas seleccionadas no existen."
            );
        }

        return asignaturas;
    }

    private void validarRol(String rol) {
        if (
                !"admin".equals(rol) &&
                !"profesor".equals(rol) &&
                !"alumno".equals(rol) &&
                !"apoderado".equals(rol)
        ) {
            throw new IllegalArgumentException(
                    "El rol ingresado no es válido."
            );
        }
    }

    private String generarBaseCorreo(
            String nombres,
            String apellidoPaterno,
            String apellidoMaterno
    ) {
        String[] partesNombre =
                nombres.split("\\s+");

        String inicialesNombre;

        if (partesNombre.length >= 2) {
            inicialesNombre =
                    primeraLetra(partesNombre[0])
                    + primeraLetra(partesNombre[1]);
        } else {
            String nombreNormalizado =
                    normalizarParaCorreo(
                            partesNombre[0]
                    );

            inicialesNombre =
                    nombreNormalizado.length() >= 2
                            ? nombreNormalizado
                                    .substring(0, 2)
                            : nombreNormalizado;
        }

        return normalizarParaCorreo(
                inicialesNombre
                + apellidoPaterno
                + primeraLetra(apellidoMaterno)
        );
    }

    private String generarCorreoDisponible(
            String base
    ) {
        String correo =
                base + DOMINIO_CORREO;

        if (
                !usuarioRepository
                        .existsByEmailIgnoreCase(correo)
        ) {
            return correo;
        }

        int numero = 2;

        while (
                usuarioRepository
                        .existsByEmailIgnoreCase(
                                base
                                + numero
                                + DOMINIO_CORREO
                        )
        ) {
            numero++;
        }

        return base
                + numero
                + DOMINIO_CORREO;
    }

    private String generarPasswordInicial(
            String apellidoPaterno,
            String rut
    ) {
        String inicial =
                normalizarParaCorreo(
                        primeraLetra(apellidoPaterno)
                )
                .toUpperCase(Locale.ROOT);

        return inicial + rut;
    }

    private boolean rutValido(String rut) {
        if (
                rut == null ||
                !rut.matches("\\d{7,8}-[0-9K]")
        ) {
            return false;
        }

        String[] partes = rut.split("-");

        String numero = partes[0];
        char dvIngresado = partes[1].charAt(0);

        int suma = 0;
        int multiplicador = 2;

        for (
                int i = numero.length() - 1;
                i >= 0;
                i--
        ) {
            suma += Character.getNumericValue(
                    numero.charAt(i)
            ) * multiplicador;

            multiplicador++;

            if (multiplicador > 7) {
                multiplicador = 2;
            }
        }

        int resultado =
                11 - (suma % 11);

        char dvCalculado;

        if (resultado == 11) {
            dvCalculado = '0';
        } else if (resultado == 10) {
            dvCalculado = 'K';
        } else {
            dvCalculado =
                    Character.forDigit(
                            resultado,
                            10
                    );
        }

        return dvIngresado == dvCalculado;
    }

    private String normalizarRut(String rut) {
        if (rut == null) {
            return "";
        }

        String limpio = rut
                .trim()
                .toUpperCase(Locale.ROOT)
                .replace(".", "")
                .replace(" ", "");

        if (!limpio.contains("-")) {
            if (limpio.length() < 2) {
                return limpio;
            }

            limpio =
                    limpio.substring(
                            0,
                            limpio.length() - 1
                    )
                    + "-"
                    + limpio.charAt(
                            limpio.length() - 1
                    );
        }

        return limpio;
    }

    private String normalizarParaCorreo(
            String texto
    ) {
        String normalizado =
                Normalizer.normalize(
                        texto,
                        Normalizer.Form.NFD
                );

        normalizado =
                DIACRITICOS
                        .matcher(normalizado)
                        .replaceAll("");

        return normalizado
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]", "");
    }

    private String primeraLetra(String texto) {
        String limpio = limpiarTexto(texto);

        if (limpio.isBlank()) {
            return "";
        }

        return limpio.substring(0, 1);
    }

    private String unirDesdeIndice(
            String[] partes,
            int indiceInicial
    ) {
        StringBuilder resultado =
                new StringBuilder();

        for (
                int i = indiceInicial;
                i < partes.length;
                i++
        ) {
            if (resultado.length() > 0) {
                resultado.append(" ");
            }

            resultado.append(partes[i]);
        }

        return resultado.toString();
    }

    private String normalizarEspacios(
            String valor
    ) {
        return limpiarTexto(valor)
                .replaceAll("\\s+", " ");
    }

    private String limpiarTexto(String valor) {
        return valor == null
                ? ""
                : valor.trim();
    }

    private String nonBlank(
            String value,
            String fallback
    ) {
        return value == null || value.isBlank()
                ? fallback
                : value.trim();
    }

    private record DatosUsuario(
            String nombreCompleto,
            String nombrePersona,
            String apellidoPaterno,
            String apellidoMaterno,
            String rut,
            String email,
            String password
    ) {
    }
@Transactional
public UsuarioListadoResponse cambiarEstado(
        Long usuarioId,
        Boolean activo
) {
    Usuario usuario = usuarioRepository
            .findById(usuarioId)
            .orElseThrow(
                    () -> new IllegalArgumentException(
                            "Usuario no encontrado."
                    )
            );

    usuario.setActivo(activo);

    Usuario actualizado =
            usuarioRepository.save(usuario);

    return crearRespuestaListado(actualizado);
}

public Boolean consultarEstado(
        Long usuarioId
) {
    Usuario usuario = usuarioRepository
            .findById(usuarioId)
            .orElseThrow(
                    () -> new IllegalArgumentException(
                            "Usuario no encontrado."
                    )
            );

    return Boolean.TRUE.equals(
            usuario.getActivo()
    );
}
}