DROP TABLE IF EXISTS evaluaciones CASCADE;
DROP TABLE IF EXISTS asistencias CASCADE;
DROP TABLE IF EXISTS notas CASCADE;
DROP TABLE IF EXISTS apoderado_alumno CASCADE;
DROP TABLE IF EXISTS profesor_curso CASCADE;
DROP TABLE IF EXISTS apoderados CASCADE;
DROP TABLE IF EXISTS alumnos CASCADE;
DROP TABLE IF EXISTS cursos CASCADE;
DROP TABLE IF EXISTS profesores CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(30) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profesores (
    id SERIAL PRIMARY KEY,
    codigo_profesor VARCHAR(20) UNIQUE NOT NULL,
    usuario_id INTEGER UNIQUE NOT NULL,
    especialidad VARCHAR(100),
    CONSTRAINT fk_profesores_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    nivel VARCHAR(50),
    profesor_id INTEGER,
    CONSTRAINT fk_cursos_profesor
        FOREIGN KEY (profesor_id)
        REFERENCES profesores(id)
        ON DELETE SET NULL
);

CREATE TABLE alumnos (
    id SERIAL PRIMARY KEY,
    codigo_alumno VARCHAR(20) UNIQUE NOT NULL,
    usuario_id INTEGER UNIQUE NOT NULL,
    curso_id INTEGER,
    curso VARCHAR(50),
    CONSTRAINT fk_alumnos_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_alumnos_curso
        FOREIGN KEY (curso_id)
        REFERENCES cursos(id)
        ON DELETE SET NULL
);

CREATE TABLE apoderados (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER UNIQUE NOT NULL,
    telefono VARCHAR(20),
    CONSTRAINT fk_apoderados_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

CREATE TABLE profesor_curso (
    id SERIAL PRIMARY KEY,
    profesor_id INTEGER NOT NULL,
    curso_id INTEGER NOT NULL,
    asignatura VARCHAR(100) NOT NULL,
    CONSTRAINT fk_profesor_curso_profesor
        FOREIGN KEY (profesor_id)
        REFERENCES profesores(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_profesor_curso_curso
        FOREIGN KEY (curso_id)
        REFERENCES cursos(id)
        ON DELETE CASCADE,
    CONSTRAINT uk_profesor_curso_asignatura
        UNIQUE (profesor_id, curso_id, asignatura)
);

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
        UNIQUE (apoderado_id, alumno_id)
);

CREATE TABLE notas (
    id SERIAL PRIMARY KEY,
    alumno_id INTEGER NOT NULL,
    curso_id INTEGER,
    profesor_id INTEGER,
    asignatura VARCHAR(100) NOT NULL,
    nota NUMERIC(3,1) NOT NULL,
    descripcion VARCHAR(150),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
        CHECK (nota >= 1.0 AND nota <= 7.0)
);

CREATE TABLE asistencias (
    id SERIAL PRIMARY KEY,
    alumno_id INTEGER NOT NULL,
    curso_id INTEGER,
    profesor_id INTEGER,
    fecha DATE NOT NULL,
    estado VARCHAR(30) NOT NULL,
    observacion VARCHAR(200),
    registrado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
        UNIQUE (alumno_id, fecha)
);

CREATE TABLE evaluaciones (
    id SERIAL PRIMARY KEY,
    curso_id INTEGER NOT NULL,
    profesor_id INTEGER,
    asignatura VARCHAR(100) NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion VARCHAR(250),
    fecha DATE NOT NULL,
    hora TIME,
    tipo VARCHAR(50),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evaluaciones_curso
        FOREIGN KEY (curso_id)
        REFERENCES cursos(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_evaluaciones_profesor
        FOREIGN KEY (profesor_id)
        REFERENCES profesores(id)
        ON DELETE SET NULL
);

INSERT INTO usuarios(nombre, email, password, rol, activo)
VALUES
('Administrador', 'admin@colegio.cl', 'Admin123', 'admin', TRUE),
('María Soto', 'profesor@colegio.cl', 'Profesor123', 'profesor', TRUE),
('Carlos Pérez', 'profesor2@colegio.cl', 'Profesor123', 'profesor', TRUE),
('Matías Rojas', 'alumno@colegio.cl', 'Alumno123', 'alumno', TRUE),
('Valentina Flores', 'alumno2@colegio.cl', 'Alumno123', 'alumno', TRUE),
('Patricia González', 'apoderado@colegio.cl', 'Apoderado123', 'apoderado', TRUE);

INSERT INTO profesores(codigo_profesor, usuario_id, especialidad)
VALUES
('PROF-001', 2, 'Matemática'),
('PROF-002', 3, 'Lenguaje');

INSERT INTO cursos(nombre, nivel, profesor_id)
VALUES
('1° Medio A', 'Media', 1),
('2° Medio B', 'Media', 2);

INSERT INTO alumnos(codigo_alumno, usuario_id, curso_id, curso)
VALUES
('ALU-001', 4, 1, '1° Medio A'),
('ALU-002', 5, 1, '1° Medio A');

INSERT INTO apoderados(usuario_id, telefono)
VALUES
(6, '+56912345678');

INSERT INTO apoderado_alumno(apoderado_id, alumno_id, parentesco)
VALUES
(1, 1, 'Madre');

INSERT INTO profesor_curso(profesor_id, curso_id, asignatura)
VALUES
(1, 1, 'Matemática'),
(2, 1, 'Lenguaje');

INSERT INTO notas(alumno_id, curso_id, profesor_id, asignatura, nota, descripcion)
VALUES
(1, 1, 1, 'Matemática', 6.5, 'Prueba unidad 1'),
(1, 1, 2, 'Lenguaje', 5.9, 'Control de lectura'),
(2, 1, 1, 'Matemática', 6.8, 'Prueba unidad 1');

INSERT INTO asistencias(alumno_id, curso_id, profesor_id, fecha, estado, observacion)
VALUES
(1, 1, 1, CURRENT_DATE - INTERVAL '2 day', 'presente', NULL),
(1, 1, 1, CURRENT_DATE - INTERVAL '1 day', 'ausente', 'Inasistencia sin justificar'),
(2, 1, 1, CURRENT_DATE - INTERVAL '2 day', 'presente', NULL),
(2, 1, 1, CURRENT_DATE - INTERVAL '1 day', 'justificado', 'Inasistencia justificada');

INSERT INTO evaluaciones(curso_id, profesor_id, asignatura, titulo, descripcion, fecha, tipo)
VALUES
(1, 1, 'Matemática', 'Prueba de funciones', 'Evaluación de funciones lineales y cuadráticas', CURRENT_DATE + INTERVAL '7 day', 'Prueba'),
(1, 2, 'Lenguaje', 'Control de lectura', 'Lectura domiciliaria mensual', CURRENT_DATE + INTERVAL '10 day', 'Control');

SELECT * FROM usuarios;
SELECT * FROM profesores;
SELECT * FROM cursos;
SELECT * FROM alumnos;
SELECT * FROM apoderados;
SELECT * FROM apoderado_alumno;
SELECT * FROM profesor_curso;
SELECT * FROM notas;
SELECT * FROM asistencias;
SELECT * FROM evaluaciones;
