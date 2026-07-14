-- =========================================================
-- USUARIOS
-- =========================================================

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(180) NOT NULL,
    nombre_persona VARCHAR(100),
    apellido_paterno VARCHAR(80),
    apellido_materno VARCHAR(80),
    rut VARCHAR(12) UNIQUE,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(30) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_usuario_rol
        CHECK (
            rol IN (
                'admin',
                'profesor',
                'alumno',
                'apoderado'
            )
        )
);

-- =========================================================
-- PROFESORES
-- =========================================================

CREATE TABLE profesores (
    id SERIAL PRIMARY KEY,
    codigo_profesor VARCHAR(20) UNIQUE NOT NULL,
    usuario_id INTEGER UNIQUE NOT NULL,
    especialidad VARCHAR(500),

    CONSTRAINT fk_profesores_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- =========================================================
-- ASIGNATURAS
-- =========================================================

CREATE TABLE asignaturas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) UNIQUE NOT NULL
);

-- =========================================================
-- PROFESOR ASIGNATURA
-- =========================================================

CREATE TABLE profesor_asignatura (
    id SERIAL PRIMARY KEY,
    profesor_id INTEGER NOT NULL,
    asignatura_id INTEGER NOT NULL,

    CONSTRAINT fk_profesor_asignatura_profesor
        FOREIGN KEY (profesor_id)
        REFERENCES profesores(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_profesor_asignatura_asignatura
        FOREIGN KEY (asignatura_id)
        REFERENCES asignaturas(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_profesor_asignatura
        UNIQUE (
            profesor_id,
            asignatura_id
        )
);

-- =========================================================
-- CURSOS
-- =========================================================

CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    nivel VARCHAR(50) NOT NULL,
    profesor_id INTEGER,

    CONSTRAINT fk_cursos_profesor
        FOREIGN KEY (profesor_id)
        REFERENCES profesores(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_curso_nivel
        CHECK (
            nivel IN (
                'Basica',
                'Media'
            )
        ),

    CONSTRAINT chk_curso_nombre
        CHECK (
            nombre ~ '^[1-8]° Basico [A-F]$'
            OR nombre ~ '^[1-4]° Medio [A-F]$'
        )
);

-- =========================================================
-- ALUMNOS
-- =========================================================

CREATE TABLE alumnos (
    id SERIAL PRIMARY KEY,
    codigo_alumno VARCHAR(20) UNIQUE NOT NULL,
    usuario_id INTEGER UNIQUE NOT NULL,
    curso_id INTEGER,
    curso VARCHAR(100),

    CONSTRAINT fk_alumnos_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_alumnos_curso
        FOREIGN KEY (curso_id)
        REFERENCES cursos(id)
        ON DELETE SET NULL
);

-- =========================================================
-- APODERADOS
-- =========================================================

CREATE TABLE apoderados (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER UNIQUE NOT NULL,
    telefono VARCHAR(9),

    CONSTRAINT fk_apoderados_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_apoderado_telefono
        CHECK (
            telefono IS NULL
            OR telefono ~ '^[0-9]{9}$'
        )
);

-- =========================================================
-- PROFESOR CURSO
-- =========================================================

CREATE TABLE profesor_curso (
    id SERIAL PRIMARY KEY,
    profesor_id INTEGER NOT NULL,
    curso_id INTEGER NOT NULL,
    asignatura VARCHAR(120) NOT NULL,

    CONSTRAINT fk_profesor_curso_profesor
        FOREIGN KEY (profesor_id)
        REFERENCES profesores(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_profesor_curso_curso
        FOREIGN KEY (curso_id)
        REFERENCES cursos(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_profesor_curso_asignatura
        UNIQUE (
            profesor_id,
            curso_id,
            asignatura
        )
);

-- =========================================================
-- APODERADO ALUMNO
-- =========================================================

CREATE TABLE apoderado_alumno (
    id SERIAL PRIMARY KEY,
    apoderado_id INTEGER NOT NULL,
    alumno_id INTEGER NOT NULL,
    parentesco VARCHAR(50),

    CONSTRAINT fk_apoderado_alumno_apoderado
        FOREIGN KEY (apoderado_id)
        REFERENCES apoderados(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_apoderado_alumno_alumno
        FOREIGN KEY (alumno_id)
        REFERENCES alumnos(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_apoderado_alumno
        UNIQUE (
            apoderado_id,
            alumno_id
        )
);

-- =========================================================
-- NOTAS
-- =========================================================

CREATE TABLE notas (
    id SERIAL PRIMARY KEY,
    alumno_id INTEGER NOT NULL,
    curso_id INTEGER,
    profesor_id INTEGER,
    asignatura VARCHAR(120) NOT NULL,
    nota NUMERIC(3,2) NOT NULL,
    descripcion VARCHAR(150),
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notas_alumno
        FOREIGN KEY (alumno_id)
        REFERENCES alumnos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_notas_curso
        FOREIGN KEY (curso_id)
        REFERENCES cursos(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_notas_profesor
        FOREIGN KEY (profesor_id)
        REFERENCES profesores(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_nota_rango
        CHECK (
            nota >= 1.00
            AND nota <= 7.00
        )
);

-- =========================================================
-- ASISTENCIAS
-- =========================================================

CREATE TABLE asistencias (
    id SERIAL PRIMARY KEY,
    alumno_id INTEGER NOT NULL,
    curso_id INTEGER,
    profesor_id INTEGER,
    fecha DATE NOT NULL,
    estado VARCHAR(30) NOT NULL,
    observacion VARCHAR(200),
    registrado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_asistencias_alumno
        FOREIGN KEY (alumno_id)
        REFERENCES alumnos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_asistencias_curso
        FOREIGN KEY (curso_id)
        REFERENCES cursos(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_asistencias_profesor
        FOREIGN KEY (profesor_id)
        REFERENCES profesores(id)
        ON DELETE SET NULL,

    CONSTRAINT uk_asistencias_alumno_fecha
        UNIQUE (
            alumno_id,
            fecha
        ),

    CONSTRAINT chk_asistencia_estado
        CHECK (
            estado IN (
                'presente',
                'ausente',
                'justificado'
            )
        )
);

-- =========================================================
-- EVALUACIONES
-- =========================================================

CREATE TABLE evaluaciones (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER NOT NULL,
    profesor_id INTEGER,
    asignatura VARCHAR(120) NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion VARCHAR(250),
    fecha DATE NOT NULL,
    hora TIME,
    tipo VARCHAR(50),
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_evaluaciones_curso
        FOREIGN KEY (curso_id)
        REFERENCES cursos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_evaluaciones_profesor
        FOREIGN KEY (profesor_id)
        REFERENCES profesores(id)
        ON DELETE SET NULL
);

-- =========================================================
-- CONVERSACIONES
-- =========================================================

CREATE TABLE conversaciones (
    id SERIAL PRIMARY KEY,
    usuario_uno_id INTEGER NOT NULL,
    usuario_dos_id INTEGER NOT NULL,
    asunto VARCHAR(150) NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_conversacion_usuario_uno
        FOREIGN KEY (usuario_uno_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_conversacion_usuario_dos
        FOREIGN KEY (usuario_dos_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_conversacion_usuarios_distintos
        CHECK (
            usuario_uno_id <> usuario_dos_id
        )
);

-- =========================================================
-- MENSAJES
-- =========================================================

CREATE TABLE mensajes (
    id SERIAL PRIMARY KEY,
    conversacion_id INTEGER NOT NULL,
    remitente_usuario_id INTEGER NOT NULL,
    destinatario_usuario_id INTEGER NOT NULL,
    contenido TEXT NOT NULL,
    leido BOOLEAN NOT NULL DEFAULT FALSE,
    enviado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_mensaje_conversacion
        FOREIGN KEY (conversacion_id)
        REFERENCES conversaciones(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_mensaje_remitente
        FOREIGN KEY (remitente_usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_mensaje_destinatario
        FOREIGN KEY (destinatario_usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_mensaje_usuarios_distintos
        CHECK (
            remitente_usuario_id
            <> destinatario_usuario_id
        ),

    CONSTRAINT chk_mensaje_contenido
        CHECK (
            LENGTH(TRIM(contenido)) > 0
        )
);

-- =========================================================
-- ÍNDICES
-- =========================================================

CREATE INDEX idx_profesor_asignatura_profesor
    ON profesor_asignatura(profesor_id);

CREATE INDEX idx_profesor_asignatura_asignatura
    ON profesor_asignatura(asignatura_id);

CREATE INDEX idx_profesor_curso_profesor
    ON profesor_curso(profesor_id);

CREATE INDEX idx_profesor_curso_curso
    ON profesor_curso(curso_id);

CREATE INDEX idx_alumnos_curso
    ON alumnos(curso_id);

CREATE INDEX idx_apoderado_alumno_apoderado
    ON apoderado_alumno(apoderado_id);

CREATE INDEX idx_apoderado_alumno_alumno
    ON apoderado_alumno(alumno_id);

CREATE INDEX idx_notas_alumno
    ON notas(alumno_id);

CREATE INDEX idx_notas_curso
    ON notas(curso_id);

CREATE INDEX idx_notas_profesor
    ON notas(profesor_id);

CREATE INDEX idx_notas_profesor_curso_asignatura
    ON notas(
        profesor_id,
        curso_id,
        asignatura
    );

CREATE INDEX idx_asistencias_alumno
    ON asistencias(alumno_id);

CREATE INDEX idx_asistencias_curso
    ON asistencias(curso_id);

CREATE INDEX idx_asistencias_profesor
    ON asistencias(profesor_id);

CREATE INDEX idx_evaluaciones_curso
    ON evaluaciones(curso_id);

CREATE INDEX idx_evaluaciones_profesor
    ON evaluaciones(profesor_id);

CREATE INDEX idx_conversaciones_usuario_uno
    ON conversaciones(usuario_uno_id);

CREATE INDEX idx_conversaciones_usuario_dos
    ON conversaciones(usuario_dos_id);

CREATE INDEX idx_conversaciones_actualizado
    ON conversaciones(actualizado_en DESC);

CREATE INDEX idx_mensajes_conversacion
    ON mensajes(conversacion_id);

CREATE INDEX idx_mensajes_destinatario
    ON mensajes(destinatario_usuario_id);

CREATE INDEX idx_mensajes_remitente
    ON mensajes(remitente_usuario_id);

CREATE INDEX idx_mensajes_no_leidos
    ON mensajes(
        destinatario_usuario_id,
        leido
    );

-- =========================================================
-- ASIGNATURAS INICIALES
-- =========================================================

INSERT INTO asignaturas (
    nombre
)
VALUES
    ('Lenguaje y Comunicación'),
    ('Matemática'),
    ('Ciencias Naturales'),
    ('Historia, Geografía y Ciencias Sociales'),
    ('Inglés'),
    ('Educación Física'),
    ('Artes Visuales'),
    ('Música'),
    ('Tecnología'),
    ('Religión'),
    ('Educación Ciudadana'),
    ('Filosofía');

-- =========================================================
-- USUARIOS INICIALES
-- =========================================================

INSERT INTO usuarios (
    nombre,
    nombre_persona,
    apellido_paterno,
    apellido_materno,
    rut,
    email,
    password,
    rol,
    activo
)
VALUES
(
    'Administrador',
    'Administrador',
    NULL,
    NULL,
    NULL,
    'admin@colegio.cl',
    'Admin123',
    'admin',
    TRUE
),
(
    'María Elena Soto Pérez',
    'María Elena',
    'Soto',
    'Pérez',
    '12.345.678-5',
    'mesotop@colegio.cl',
    'S12345678-5',
    'profesor',
    TRUE
),
(
    'Carlos Andrés Pérez Soto',
    'Carlos Andrés',
    'Pérez',
    'Soto',
    '11.111.111-1',
    'caperezs@colegio.cl',
    'P11111111-1',
    'profesor',
    TRUE
),
(
    'Matías Ignacio Rojas Díaz',
    'Matías Ignacio',
    'Rojas',
    'Díaz',
    '22.222.222-2',
    'mirojasd@colegio.cl',
    'R22222222-2',
    'alumno',
    TRUE
),
(
    'Valentina Paz Flores Soto',
    'Valentina Paz',
    'Flores',
    'Soto',
    '33.333.333-3',
    'vpfloress@colegio.cl',
    'F33333333-3',
    'alumno',
    TRUE
),
(
    'Patricia Elena González Rojas',
    'Patricia Elena',
    'González',
    'Rojas',
    '44.444.444-4',
    'pegonzalezr@colegio.cl',
    'G44444444-4',
    'apoderado',
    TRUE
);

-- =========================================================
-- PROFESORES INICIALES
-- =========================================================

INSERT INTO profesores (
    codigo_profesor,
    usuario_id,
    especialidad
)
VALUES
(
    'PROF-001',
    2,
    'Matemática | Ciencias Naturales'
),
(
    'PROF-002',
    3,
    'Lenguaje y Comunicación | Historia, Geografía y Ciencias Sociales'
);

-- =========================================================
-- PROFESOR ASIGNATURA INICIAL
-- =========================================================

INSERT INTO profesor_asignatura (
    profesor_id,
    asignatura_id
)
SELECT
    1,
    id
FROM asignaturas
WHERE nombre IN (
    'Matemática',
    'Ciencias Naturales'
);

INSERT INTO profesor_asignatura (
    profesor_id,
    asignatura_id
)
SELECT
    2,
    id
FROM asignaturas
WHERE nombre IN (
    'Lenguaje y Comunicación',
    'Historia, Geografía y Ciencias Sociales'
);

-- =========================================================
-- CURSOS INICIALES
-- =========================================================

INSERT INTO cursos (
    nombre,
    nivel,
    profesor_id
)
VALUES
(
    '1° Medio A',
    'Media',
    1
),
(
    '2° Medio B',
    'Media',
    2
);

-- =========================================================
-- ALUMNOS INICIALES
-- =========================================================

INSERT INTO alumnos (
    codigo_alumno,
    usuario_id,
    curso_id,
    curso
)
VALUES
(
    'ALU-001',
    4,
    1,
    '1° Medio A'
),
(
    'ALU-002',
    5,
    1,
    '1° Medio A'
);

-- =========================================================
-- APODERADOS INICIALES
-- =========================================================

INSERT INTO apoderados (
    usuario_id,
    telefono
)
VALUES
(
    6,
    '912345678'
);

-- =========================================================
-- PROFESOR CURSO INICIAL
-- =========================================================

INSERT INTO profesor_curso (
    profesor_id,
    curso_id,
    asignatura
)
VALUES
(
    1,
    1,
    'Matemática'
),
(
    1,
    1,
    'Ciencias Naturales'
),
(
    2,
    1,
    'Lenguaje y Comunicación'
),
(
    2,
    2,
    'Historia, Geografía y Ciencias Sociales'
);

-- =========================================================
-- APODERADO ALUMNO INICIAL
-- =========================================================

INSERT INTO apoderado_alumno (
    apoderado_id,
    alumno_id,
    parentesco
)
VALUES
(
    1,
    1,
    NULL
);

-- =========================================================
-- NOTAS INICIALES
-- =========================================================

INSERT INTO notas (
    alumno_id,
    curso_id,
    profesor_id,
    asignatura,
    nota,
    descripcion
)
VALUES
(
    1,
    1,
    1,
    'Matemática',
    6.50,
    'Prueba unidad 1'
),
(
    1,
    1,
    1,
    'Matemática',
    5.85,
    'Control de ejercicios'
),
(
    1,
    1,
    2,
    'Lenguaje y Comunicación',
    5.90,
    'Control de lectura'
),
(
    2,
    1,
    1,
    'Matemática',
    6.80,
    'Prueba unidad 1'
),
(
    2,
    1,
    1,
    'Ciencias Naturales',
    6.25,
    'Trabajo de laboratorio'
),
(
    2,
    1,
    2,
    'Lenguaje y Comunicación',
    6.10,
    'Ensayo escrito'
);

-- =========================================================
-- ASISTENCIAS INICIALES
-- =========================================================

INSERT INTO asistencias (
    alumno_id,
    curso_id,
    profesor_id,
    fecha,
    estado,
    observacion
)
VALUES
(
    1,
    1,
    1,
    CURRENT_DATE - 2,
    'presente',
    NULL
),
(
    1,
    1,
    1,
    CURRENT_DATE - 1,
    'ausente',
    'Inasistencia sin justificar'
),
(
    2,
    1,
    1,
    CURRENT_DATE - 2,
    'presente',
    NULL
),
(
    2,
    1,
    1,
    CURRENT_DATE - 1,
    'justificado',
    'Inasistencia justificada'
);

-- =========================================================
-- EVALUACIONES INICIALES
-- =========================================================

INSERT INTO evaluaciones (
    curso_id,
    profesor_id,
    asignatura,
    titulo,
    descripcion,
    fecha,
    hora,
    tipo
)
VALUES
(
    1,
    1,
    'Matemática',
    'Prueba de funciones',
    'Evaluación de funciones lineales y cuadráticas',
    CURRENT_DATE + 7,
    NULL,
    'Prueba'
),
(
    1,
    1,
    'Ciencias Naturales',
    'Informe de laboratorio',
    'Informe sobre reacciones químicas',
    CURRENT_DATE + 9,
    NULL,
    'Trabajo'
),
(
    1,
    2,
    'Lenguaje y Comunicación',
    'Control de lectura',
    'Lectura domiciliaria mensual',
    CURRENT_DATE + 10,
    NULL,
    'Control'
),
(
    2,
    2,
    'Historia, Geografía y Ciencias Sociales',
    'Prueba de formación ciudadana',
    'Evaluación sobre democracia y participación ciudadana',
    CURRENT_DATE + 12,
    NULL,
    'Prueba'
);

-- =========================================================
-- CONVERSACIONES INICIALES
-- =========================================================

INSERT INTO conversaciones (
    usuario_uno_id,
    usuario_dos_id,
    asunto,
    creado_en,
    actualizado_en
)
VALUES
(
    2,
    4,
    'Bienvenida al sistema de mensajería',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    2,
    6,
    'Información académica de Matías',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- =========================================================
-- MENSAJES INICIALES
-- =========================================================

INSERT INTO mensajes (
    conversacion_id,
    remitente_usuario_id,
    destinatario_usuario_id,
    contenido,
    leido,
    enviado_en
)
VALUES
(
    1,
    2,
    4,
    'Hola Matías, recuerda revisar tus próximas evaluaciones y mantener tus actividades al día.',
    FALSE,
    CURRENT_TIMESTAMP
),
(
    2,
    2,
    6,
    'Estimada apoderada, puede utilizar este apartado para comunicarse con los profesores.',
    FALSE,
    CURRENT_TIMESTAMP
);

-- =========================================================
-- COMPROBACIÓN DE USUARIOS
-- =========================================================

SELECT
    id,
    nombre,
    email,
    rol,
    activo
FROM usuarios
ORDER BY id;

-- =========================================================
-- COMPROBACIÓN DE ASIGNATURAS
-- =========================================================

SELECT
    id,
    nombre
FROM asignaturas
ORDER BY nombre;

-- =========================================================
-- COMPROBACIÓN DE PROFESOR ASIGNATURA
-- =========================================================

SELECT
    p.id AS profesor_id,
    u.nombre AS profesor,
    a.nombre AS asignatura
FROM profesor_asignatura pa
JOIN profesores p
    ON p.id = pa.profesor_id
JOIN usuarios u
    ON u.id = p.usuario_id
JOIN asignaturas a
    ON a.id = pa.asignatura_id
ORDER BY
    profesor,
    asignatura;

-- =========================================================
-- COMPROBACIÓN DE CURSOS
-- =========================================================

SELECT
    c.id,
    c.nombre,
    c.nivel
FROM cursos c
ORDER BY c.id;

-- =========================================================
-- COMPROBACIÓN DE PROFESOR CURSO
-- =========================================================

SELECT
    pc.id,
    u.nombre AS profesor,
    c.nombre AS curso,
    pc.asignatura
FROM profesor_curso pc
JOIN profesores p
    ON p.id = pc.profesor_id
JOIN usuarios u
    ON u.id = p.usuario_id
JOIN cursos c
    ON c.id = pc.curso_id
ORDER BY
    c.nombre,
    u.nombre,
    pc.asignatura;

-- =========================================================
-- COMPROBACIÓN DE ALUMNOS
-- =========================================================

SELECT
    a.id,
    a.codigo_alumno,
    u.nombre AS alumno,
    c.nombre AS curso
FROM alumnos a
JOIN usuarios u
    ON u.id = a.usuario_id
LEFT JOIN cursos c
    ON c.id = a.curso_id
ORDER BY a.id;

-- =========================================================
-- COMPROBACIÓN DE APODERADOS
-- =========================================================

SELECT
    ua.nombre AS apoderado,
    ue.nombre AS alumno
FROM apoderado_alumno aa
JOIN apoderados ap
    ON ap.id = aa.apoderado_id
JOIN usuarios ua
    ON ua.id = ap.usuario_id
JOIN alumnos al
    ON al.id = aa.alumno_id
JOIN usuarios ue
    ON ue.id = al.usuario_id
ORDER BY ua.nombre;

-- =========================================================
-- COMPROBACIÓN DE NOTAS
-- =========================================================

SELECT
    n.id,
    ua.nombre AS alumno,
    up.nombre AS profesor,
    c.nombre AS curso,
    n.asignatura,
    n.nota,
    n.descripcion,
    n.fecha
FROM notas n
JOIN alumnos a
    ON a.id = n.alumno_id
JOIN usuarios ua
    ON ua.id = a.usuario_id
LEFT JOIN profesores p
    ON p.id = n.profesor_id
LEFT JOIN usuarios up
    ON up.id = p.usuario_id
LEFT JOIN cursos c
    ON c.id = n.curso_id
ORDER BY
    n.asignatura,
    ua.nombre,
    n.fecha;

-- =========================================================
-- COMPROBACIÓN DE ASISTENCIAS
-- =========================================================

SELECT
    asi.id,
    u.nombre AS alumno,
    c.nombre AS curso,
    asi.fecha,
    asi.estado,
    asi.observacion
FROM asistencias asi
JOIN alumnos a
    ON a.id = asi.alumno_id
JOIN usuarios u
    ON u.id = a.usuario_id
LEFT JOIN cursos c
    ON c.id = asi.curso_id
ORDER BY
    asi.fecha,
    u.nombre;

-- =========================================================
-- COMPROBACIÓN DE EVALUACIONES
-- =========================================================

SELECT
    e.id,
    c.nombre AS curso,
    u.nombre AS profesor,
    e.asignatura,
    e.titulo,
    e.fecha,
    e.tipo
FROM evaluaciones e
JOIN cursos c
    ON c.id = e.curso_id
LEFT JOIN profesores p
    ON p.id = e.profesor_id
LEFT JOIN usuarios u
    ON u.id = p.usuario_id
ORDER BY e.fecha;

-- =========================================================
-- COMPROBACIÓN DE CONVERSACIONES
-- =========================================================

SELECT
    c.id,
    c.asunto,
    u1.nombre AS usuario_uno,
    u2.nombre AS usuario_dos,
    c.actualizado_en
FROM conversaciones c
JOIN usuarios u1
    ON u1.id = c.usuario_uno_id
JOIN usuarios u2
    ON u2.id = c.usuario_dos_id
ORDER BY c.actualizado_en DESC;

-- =========================================================
-- COMPROBACIÓN DE MENSAJES
-- =========================================================

SELECT
    m.id,
    m.conversacion_id,
    ur.nombre AS remitente,
    ud.nombre AS destinatario,
    m.contenido,
    m.leido,
    m.enviado_en
FROM mensajes m
JOIN usuarios ur
    ON ur.id = m.remitente_usuario_id
JOIN usuarios ud
    ON ud.id = m.destinatario_usuario_id
ORDER BY
    m.conversacion_id,
    m.enviado_en;