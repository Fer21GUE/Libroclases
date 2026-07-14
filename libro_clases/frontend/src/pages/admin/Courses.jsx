import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import AdminPageLayout
  from '../../components/AdminLayout.jsx';

import {
  createCourse,
  deleteCourse,
  getCourses,
  getProfesores
} from '../../api/coursesApi.js';

const initialForm = {
  nivel: 'Basica',
  grado: '1',
  letra: 'A',
  profesorJefeId: ''
};

const letrasCurso = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F'
];

export default function Courses() {
  const [courses, setCourses] =
    useState([]);

  const [profesores, setProfesores] =
    useState([]);

  const [form, setForm] =
    useState(initialForm);

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');

  const [deletingId, setDeletingId] =
    useState(null);

  const gradosDisponibles = useMemo(
    () => {
      const cantidad =
        form.nivel === 'Basica'
          ? 8
          : 4;

      return Array.from(
        {
          length: cantidad
        },
        (_, index) =>
          String(index + 1)
      );
    },
    [form.nivel]
  );

  const nombreCurso = useMemo(
    () => {
      const tipo =
        form.nivel === 'Basica'
          ? 'Basico'
          : 'Medio';

      return `${form.grado}° ${tipo} ${form.letra}`;
    },
    [
      form.nivel,
      form.grado,
      form.letra
    ]
  );

  const loadData = async () => {
    const [
      coursesData,
      profesoresData
    ] = await Promise.all([
      getCourses(),
      getProfesores()
    ]);

    setCourses(coursesData);
    setProfesores(profesoresData);
  };

  useEffect(() => {
    loadData().catch((e) => {
      setError(e.message);
    });
  }, []);

  const cambiarNivel = (nivel) => {
    setForm((prev) => ({
      ...prev,
      nivel,
      grado: '1'
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    const payload = {
      nombre: nombreCurso,
      nivel: form.nivel,

      profesorJefeId:
        form.profesorJefeId
          ? Number(
              form.profesorJefeId
            )
          : null
    };

    try {
      await createCourse(payload);

      setForm(initialForm);

      setMessage(
        'Curso creado correctamente.'
      );

      await loadData();
    } catch (e) {
      setError(e.message);
    }
  };

  const eliminar = async (
    curso
  ) => {
    const confirmar =
      window.confirm(
        `¿Desea eliminar el curso ${curso.nombre}?`
      );

    if (!confirmar) {
      return;
    }

    setMessage('');
    setError('');
    setDeletingId(curso.id);

    try {
      await deleteCourse(curso.id);

      setCourses((prev) =>
        prev.filter(
          (item) =>
            item.id !== curso.id
        )
      );

      setMessage(
        'Curso eliminado correctamente.'
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminPageLayout title="Gestión de cursos">
      <div className="content-section">
        <h2>Crear curso</h2>

        <form
          onSubmit={onSubmit}
          className="role-card"
          style={{
            background: '#111827',
            border:
              '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <div className="row g-3">
            <div className="col-md-3">
              <select
                className="form-control"
                value={form.nivel}
                onChange={(e) =>
                  cambiarNivel(
                    e.target.value
                  )
                }
                required
              >
                <option value="Basica">
                  Basica
                </option>

                <option value="Media">
                  Media
                </option>
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-control"
                value={form.grado}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    grado:
                      e.target.value
                  }))
                }
                required
              >
                {gradosDisponibles.map(
                  (grado) => (
                    <option
                      key={grado}
                      value={grado}
                    >
                      {grado}°
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-control"
                value={form.letra}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    letra:
                      e.target.value
                  }))
                }
                required
              >
                {letrasCurso.map(
                  (letra) => (
                    <option
                      key={letra}
                      value={letra}
                    >
                      {letra}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="col-md-5">
              <select
                className="form-control"
                value={
                  form.profesorJefeId
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    profesorJefeId:
                      e.target.value
                  }))
                }
              >
                <option value="">
                  Sin profesor asignado
                </option>

                {profesores.map(
                  (profesor) => (
                    <option
                      key={profesor.id}
                      value={profesor.id}
                    >
                      {
                        profesor.usuario
                          ?.nombre
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="col-md-12">
              <input
                className="form-control"
                value={nombreCurso}
                readOnly
              />
            </div>

            <div className="col-12">
              <button
                className="btn-base btn-primary"
                type="submit"
              >
                Crear curso
              </button>
            </div>
          </div>
        </form>

        {message && (
          <div className="form-success">
            {message}
          </div>
        )}

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}
      </div>

      <div className="content-section">
        <h2>Cursos creados</h2>

        <div className="table-responsive">
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Curso</th>
                <th>Nivel</th>
                <th>
                  Profesores asignados
                </th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.id}</td>

                  <td>{course.nombre}</td>

                  <td>{course.nivel}</td>

                  <td>
                    {course.profesoresAsignados
                      ?.length > 0
                      ? course
                          .profesoresAsignados
                          .join(', ')
                      : 'Sin profesores asignados'}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        eliminar(course)
                      }
                      disabled={
                        deletingId ===
                        course.id
                      }
                    >
                      {deletingId ===
                      course.id
                        ? 'Eliminando...'
                        : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))}

              {courses.length === 0 && (
                <tr>
                  <td colSpan="5">
                    No existen cursos creados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPageLayout>
  );
}