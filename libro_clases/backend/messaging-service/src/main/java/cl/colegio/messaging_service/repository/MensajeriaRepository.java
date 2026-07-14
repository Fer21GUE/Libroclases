package cl.colegio.messaging_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class MensajeriaRepository {

    private final JdbcTemplate jdbcTemplate;

    public MensajeriaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<Map<String, Object>> buscarUsuario(Long usuarioId) {
        List<Map<String, Object>> resultado = jdbcTemplate.queryForList(
                """
                SELECT id, nombre, email, rol, activo
                FROM usuarios
                WHERE id = ?
                """,
                usuarioId
        );

        return resultado.stream().findFirst();
    }

    public List<Map<String, Object>> listarDestinatariosProfesor(Long usuarioId) {
        return jdbcTemplate.queryForList(
                """
                SELECT DISTINCT
                    u.id AS "usuarioId",
                    u.nombre AS nombre,
                    u.email AS email,
                    u.rol AS rol,
                    c.nombre AS "cursoNombre"
                FROM profesores p
                JOIN profesor_curso pc ON pc.profesor_id = p.id
                JOIN cursos c ON c.id = pc.curso_id
                JOIN alumnos a ON a.curso_id = c.id
                JOIN usuarios u ON u.id = a.usuario_id
                WHERE p.usuario_id = ?
                  AND u.activo = TRUE

                UNION

                SELECT DISTINCT
                    u.id AS "usuarioId",
                    u.nombre AS nombre,
                    u.email AS email,
                    u.rol AS rol,
                    c.nombre AS "cursoNombre"
                FROM profesores p
                JOIN profesor_curso pc ON pc.profesor_id = p.id
                JOIN cursos c ON c.id = pc.curso_id
                JOIN alumnos a ON a.curso_id = c.id
                JOIN apoderado_alumno aa ON aa.alumno_id = a.id
                JOIN apoderados ap ON ap.id = aa.apoderado_id
                JOIN usuarios u ON u.id = ap.usuario_id
                WHERE p.usuario_id = ?
                  AND u.activo = TRUE

                ORDER BY rol, nombre
                """,
                usuarioId,
                usuarioId
        );
    }

    public List<Map<String, Object>> listarDestinatariosAlumno(Long usuarioId) {
        return jdbcTemplate.queryForList(
                """
                SELECT DISTINCT
                    u.id AS "usuarioId",
                    u.nombre AS nombre,
                    u.email AS email,
                    u.rol AS rol,
                    c.nombre AS "cursoNombre"
                FROM alumnos a
                JOIN cursos c ON c.id = a.curso_id
                JOIN profesor_curso pc ON pc.curso_id = c.id
                JOIN profesores p ON p.id = pc.profesor_id
                JOIN usuarios u ON u.id = p.usuario_id
                WHERE a.usuario_id = ?
                  AND u.activo = TRUE
                ORDER BY u.nombre
                """,
                usuarioId
        );
    }

    public List<Map<String, Object>> listarDestinatariosApoderado(Long usuarioId) {
        return jdbcTemplate.queryForList(
                """
                SELECT DISTINCT
                    u.id AS "usuarioId",
                    u.nombre AS nombre,
                    u.email AS email,
                    u.rol AS rol,
                    c.nombre AS "cursoNombre"
                FROM apoderados ap
                JOIN apoderado_alumno aa ON aa.apoderado_id = ap.id
                JOIN alumnos a ON a.id = aa.alumno_id
                JOIN cursos c ON c.id = a.curso_id
                JOIN profesor_curso pc ON pc.curso_id = c.id
                JOIN profesores p ON p.id = pc.profesor_id
                JOIN usuarios u ON u.id = p.usuario_id
                WHERE ap.usuario_id = ?
                  AND u.activo = TRUE
                ORDER BY u.nombre
                """,
                usuarioId
        );
    }

    public Long crearConversacion(Long usuarioUnoId, Long usuarioDosId, String asunto) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(
                connection -> {
                    PreparedStatement statement = connection.prepareStatement(
                            """
                            INSERT INTO conversaciones (
                                usuario_uno_id,
                                usuario_dos_id,
                                asunto
                            )
                            VALUES (?, ?, ?)
                            """,
                            Statement.RETURN_GENERATED_KEYS
                    );

                    statement.setLong(1, usuarioUnoId);
                    statement.setLong(2, usuarioDosId);
                    statement.setString(3, asunto);
                    return statement;
                },
                keyHolder
        );

        Number id = keyHolder.getKey();
        if (id == null) {
            throw new IllegalStateException("No se pudo crear la conversación.");
        }

        return id.longValue();
    }

    public Long crearMensaje(
            Long conversacionId,
            Long remitenteId,
            Long destinatarioId,
            String contenido
    ) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(
                connection -> {
                    PreparedStatement statement = connection.prepareStatement(
                            """
                            INSERT INTO mensajes (
                                conversacion_id,
                                remitente_usuario_id,
                                destinatario_usuario_id,
                                contenido
                            )
                            VALUES (?, ?, ?, ?)
                            """,
                            Statement.RETURN_GENERATED_KEYS
                    );

                    statement.setLong(1, conversacionId);
                    statement.setLong(2, remitenteId);
                    statement.setLong(3, destinatarioId);
                    statement.setString(4, contenido);
                    return statement;
                },
                keyHolder
        );

        actualizarConversacion(conversacionId);

        Number id = keyHolder.getKey();
        if (id == null) {
            throw new IllegalStateException("No se pudo enviar el mensaje.");
        }

        return id.longValue();
    }

    public void actualizarConversacion(Long conversacionId) {
        jdbcTemplate.update(
                """
                UPDATE conversaciones
                SET actualizado_en = CURRENT_TIMESTAMP
                WHERE id = ?
                """,
                conversacionId
        );
    }

    public List<Map<String, Object>> listarConversaciones(Long usuarioId) {
        return jdbcTemplate.queryForList(
                """
                SELECT
                    c.id,
                    c.asunto,
                    c.actualizado_en AS "actualizadoEn",
                    CASE
                        WHEN c.usuario_uno_id = ? THEN u2.id
                        ELSE u1.id
                    END AS "otroUsuarioId",
                    CASE
                        WHEN c.usuario_uno_id = ? THEN u2.nombre
                        ELSE u1.nombre
                    END AS "otroUsuarioNombre",
                    CASE
                        WHEN c.usuario_uno_id = ? THEN u2.rol
                        ELSE u1.rol
                    END AS "otroUsuarioRol",
                    (
                        SELECT m.contenido
                        FROM mensajes m
                        WHERE m.conversacion_id = c.id
                        ORDER BY m.enviado_en DESC, m.id DESC
                        LIMIT 1
                    ) AS "ultimoMensaje",
                    (
                        SELECT COUNT(*)
                        FROM mensajes m
                        WHERE m.conversacion_id = c.id
                          AND m.destinatario_usuario_id = ?
                          AND m.leido = FALSE
                    ) AS "noLeidos"
                FROM conversaciones c
                JOIN usuarios u1 ON u1.id = c.usuario_uno_id
                JOIN usuarios u2 ON u2.id = c.usuario_dos_id
                WHERE c.usuario_uno_id = ?
                   OR c.usuario_dos_id = ?
                ORDER BY c.actualizado_en DESC, c.id DESC
                """,
                usuarioId,
                usuarioId,
                usuarioId,
                usuarioId,
                usuarioId,
                usuarioId
        );
    }

    public Optional<Map<String, Object>> buscarConversacion(Long conversacionId) {
        List<Map<String, Object>> resultado = jdbcTemplate.queryForList(
                """
                SELECT
                    id,
                    usuario_uno_id AS "usuarioUnoId",
                    usuario_dos_id AS "usuarioDosId",
                    asunto,
                    creado_en AS "creadoEn",
                    actualizado_en AS "actualizadoEn"
                FROM conversaciones
                WHERE id = ?
                """,
                conversacionId
        );

        return resultado.stream().findFirst();
    }

    public List<Map<String, Object>> listarMensajesConversacion(Long conversacionId) {
        return jdbcTemplate.queryForList(
                """
                SELECT
                    m.id,
                    m.conversacion_id AS "conversacionId",
                    m.remitente_usuario_id AS "remitenteUsuarioId",
                    remitente.nombre AS "remitenteNombre",
                    m.destinatario_usuario_id AS "destinatarioUsuarioId",
                    destinatario.nombre AS "destinatarioNombre",
                    m.contenido,
                    m.leido,
                    m.enviado_en AS "enviadoEn"
                FROM mensajes m
                JOIN usuarios remitente ON remitente.id = m.remitente_usuario_id
                JOIN usuarios destinatario ON destinatario.id = m.destinatario_usuario_id
                WHERE m.conversacion_id = ?
                ORDER BY m.enviado_en ASC, m.id ASC
                """,
                conversacionId
        );
    }

    public void marcarConversacionLeida(Long conversacionId, Long usuarioId) {
        jdbcTemplate.update(
                """
                UPDATE mensajes
                SET leido = TRUE
                WHERE conversacion_id = ?
                  AND destinatario_usuario_id = ?
                  AND leido = FALSE
                """,
                conversacionId,
                usuarioId
        );
    }

    public int contarNoLeidos(Long usuarioId) {
        Integer cantidad = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM mensajes
                WHERE destinatario_usuario_id = ?
                  AND leido = FALSE
                """,
                Integer.class,
                usuarioId
        );

        return cantidad == null ? 0 : cantidad;
    }
}
