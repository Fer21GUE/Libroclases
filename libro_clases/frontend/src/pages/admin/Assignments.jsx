import React, {
  useEffect,
  useState
} from 'react';

import AdminPageLayout
  from '../../components/AdminLayout.jsx';

import {
  asignarAlumno,
  asignarApoderado,
  asignarProfesor,
  getAlumnos,
  getApoderados,
  getAsignaciones,
  getAsignacionesAlumnos,
  getAsignacionesApoderados,
  getAsignaturasPorProfesor,
  getCourses,
  getProfesores
} from '../../api/coursesApi.js';

const initialProfesorForm = {
  profesorId: '',
  cursoId: '',
  asignaturaId: ''
};

const initialAlumnoForm = {
  alumnoId: '',
  cursoId: ''
};

const initialApoderadoForm = {
  apoderadoId: '',
  alumnoId: ''
};

export default function Assignments() {
  const [courses, setCourses] =
    useState([]);

  const [profesores, setProfesores] =
    useState([]);

  const [alumnos, setAlumnos] =
    useState([]);

  const [apoderados, setApoderados] =
    useState([]);

  const [
    asignaturasProfesor,
    setAsignaturasProfesor
  ] = useState([]);

  const [
    cargandoAsignaturas,
    setCargandoAsignaturas
  ] = useState(false);

  const [
    asignacionesProfesores,
    setAsignacionesProfesores
  ] = useState([]);

  const [
    asignacionesAlumnos,
    setAsignacionesAlumnos
  ] = useState([]);

  const [
    asignacionesApoderados,
    setAsignacionesApoderados
  ] = useState([]);

  const [
    profesorForm,
    setProfesorForm
  ] = useState(initialProfesorForm);

  const [
    alumnoForm,
    setAlumnoForm
  ] = useState(initialAlumnoForm);

  const [
    apoderadoForm,
    setApoderadoForm
  ] = useState(initialApoderadoForm);

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');

  const loadData = async () => {
    const [
      coursesData,
      profesoresData,
      alumnosData,
      apoderadosData,
      profesoresAsignadosData,
      alumnosAsignadosData,
      apoderadosAsignadosData
    ] = await Promise.all([
      getCourses(),
      getProfesores(),
      getAlumnos(),
      getApoderados(),
      getAsignaciones(),
      getAsignacionesAlumnos(),
      getAsignacionesApoderados()
    ]);

    setCourses(coursesData);
    setProfesores(profesoresData);
    setAlumnos(alumnosData);
    setApoderados(apoderadosData);

    setAsignacionesProfesores(
      profesoresAsignadosData
    );

    setAsignacionesAlumnos(
      alumnosAsignadosData
    );

    setAsignacionesApoderados(
      apoderadosAsignadosData
    );
  };

  useEffect(() => {
    loadData().catch((e) => {
      setError(e.message);
    });
  }, []);

  const limpiarMensajes = () => {
    setMessage('');
    setError('');
  };

  const cambiarProfesor = async (
    profesorId
  ) => {
    setProfesorForm((prev) => ({
      ...prev,
      profesorId,
      asignaturaId: ''
    }));

    setAsignaturasProfesor([]);
    limpiarMensajes();

    if (!profesorId) {
      return;
    }

    setCargandoAsignaturas(true);

    try {
      const data =
        await getAsignaturasPorProfesor(
          profesorId
        );

      setAsignaturasProfesor(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargandoAsignaturas(false);
    }
  };

  const submitProfesor = async (e) => {
    e.preventDefault();
    limpiarMensajes();

    try {
      await asignarProfesor({
        profesorId: Number(
          profesorForm.profesorId
        ),

        cursoId: Number(
          profesorForm.cursoId
        ),

        asignaturaId: Number(
          profesorForm.asignaturaId
        )
      });

      setProfesorForm(
        initialProfesorForm
      );

      setAsignaturasProfesor([]);

      setMessage(
        'Profesor asignado correctamente.'
      );

      await loadData();
    } catch (e) {
      setError(e.message);
    }
  };

  const submitAlumno = async (e) => {
    e.preventDefault();
    limpiarMensajes();

    try {
      await asignarAlumno({
        alumnoId: Number(
          alumnoForm.alumnoId
        ),

        cursoId: Number(
          alumnoForm.cursoId
        )
      });

      setAlumnoForm(initialAlumnoForm);

      setMessage(
        'Alumno asignado correctamente.'
      );

      await loadData();
    } catch (e) {
      setError(e.message);
    }
  };

  const submitApoderado = async (e) => {
    e.preventDefault();
    limpiarMensajes();

    try {
      await asignarApoderado({
        apoderadoId: Number(
          apoderadoForm.apoderadoId
        ),

        alumnoId: Number(
          apoderadoForm.alumnoId
        )
      });

      setApoderadoForm(
        initialApoderadoForm
      );

      setMessage(
        'Apoderado asignado correctamente.'
      );

      await loadData();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <AdminPageLayout title="Asignación de cursos">
      <div className="content-section">
        <h2>Asignar profesor a curso</h2>

        <form
          onSubmit={submitProfesor}
          className="role-card"
          style={{
            background: '#111827',
            border:
              '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <div className="row g-3">
            <div className="col-md-4">
              <select
                className="form-control"
                value={
                  profesorForm.profesorId
                }
                onChange={(e) =>
                  cambiarProfesor(
                    e.target.value
                  )
                }
                required
              >
                <option value="">
                  Seleccione profesor
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

            <div className="col-md-4">
              <select
                className="form-control"
                value={
                  profesorForm.cursoId
                }
                onChange={(e) =>
                  setProfesorForm({
                    ...profesorForm,
                    cursoId:
                      e.target.value
                  })
                }
                required
              >
                <option value="">
                  Seleccione curso
                </option>

                {courses.map((course) => (
                  <option
                    key={course.id}
                    value={course.id}
                  >
                    {course.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <select
                className="form-control"
                value={
                  profesorForm.asignaturaId
                }
                onChange={(e) =>
                  setProfesorForm({
                    ...profesorForm,
                    asignaturaId:
                      e.target.value
                  })
                }
                disabled={
                  !profesorForm.profesorId ||
                  cargandoAsignaturas
                }
                required
              >
                <option value="">
                  {cargandoAsignaturas
                    ? 'Cargando asignaturas...'
                    : !profesorForm.profesorId
                      ? 'Seleccione primero un profesor'
                      : asignaturasProfesor.length ===
                          0
                        ? 'Profesor sin asignaturas'
                        : 'Seleccione asignatura'}
                </option>

                {asignaturasProfesor.map(
                  (asignatura) => (
                    <option
                      key={asignatura.id}
                      value={asignatura.id}
                    >
                      {asignatura.nombre}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="col-12">
              <button
                className="btn-base btn-primary"
                type="submit"
                disabled={
                  !profesorForm.asignaturaId
                }
              >
                Guardar asignación
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="content-section">
        <h2>Asignar alumno a curso</h2>

        <form
          onSubmit={submitAlumno}
          className="role-card"
          style={{
            background: '#111827',
            border:
              '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <div className="row g-3">
            <div className="col-md-6">
              <select
                className="form-control"
                value={alumnoForm.alumnoId}
                onChange={(e) =>
                  setAlumnoForm({
                    ...alumnoForm,
                    alumnoId:
                      e.target.value
                  })
                }
                required
              >
                <option value="">
                  Seleccione alumno
                </option>

                {alumnos.map((alumno) => (
                  <option
                    key={alumno.id}
                    value={alumno.id}
                  >
                    {alumno.codigoAlumno} -{' '}
                    {alumno.usuario?.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <select
                className="form-control"
                value={alumnoForm.cursoId}
                onChange={(e) =>
                  setAlumnoForm({
                    ...alumnoForm,
                    cursoId:
                      e.target.value
                  })
                }
                required
              >
                <option value="">
                  Seleccione curso
                </option>

                {courses.map((course) => (
                  <option
                    key={course.id}
                    value={course.id}
                  >
                    {course.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <button
                className="btn-base btn-primary"
                type="submit"
              >
                Guardar asignación
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="content-section">
        <h2>Asignar apoderado a alumno</h2>

        <form
          onSubmit={submitApoderado}
          className="role-card"
          style={{
            background: '#111827',
            border:
              '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <div className="row g-3">
            <div className="col-md-6">
              <select
                className="form-control"
                value={
                  apoderadoForm.apoderadoId
                }
                onChange={(e) =>
                  setApoderadoForm({
                    ...apoderadoForm,
                    apoderadoId:
                      e.target.value
                  })
                }
                required
              >
                <option value="">
                  Seleccione apoderado
                </option>

                {apoderados.map(
                  (apoderado) => (
                    <option
                      key={apoderado.id}
                      value={apoderado.id}
                    >
                      {
                        apoderado.usuario
                          ?.nombre
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="col-md-6">
              <select
                className="form-control"
                value={
                  apoderadoForm.alumnoId
                }
                onChange={(e) =>
                  setApoderadoForm({
                    ...apoderadoForm,
                    alumnoId:
                      e.target.value
                  })
                }
                required
              >
                <option value="">
                  Seleccione alumno
                </option>

                {alumnos.map((alumno) => (
                  <option
                    key={alumno.id}
                    value={alumno.id}
                  >
                    {alumno.codigoAlumno} -{' '}
                    {alumno.usuario?.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <button
                className="btn-base btn-primary"
                type="submit"
              >
                Guardar asignación
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
        <h2>Asignaciones de profesores</h2>

        <div className="table-responsive">
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>Profesor</th>
                <th>Curso</th>
                <th>Asignatura</th>
              </tr>
            </thead>

            <tbody>
              {asignacionesProfesores.map(
                (asignacion) => (
                  <tr key={asignacion.id}>
                    <td>
                      {
                        asignacion.profesor
                          ?.usuario?.nombre
                      }
                    </td>

                    <td>
                      {
                        asignacion.curso
                          ?.nombre
                      }
                    </td>

                    <td>
                      {asignacion.asignatura}
                    </td>
                  </tr>
                )
              )}

              {asignacionesProfesores.length ===
                0 && (
                <tr>
                  <td colSpan="3">
                    No existen asignaciones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section">
        <h2>Asignaciones de alumnos</h2>

        <div className="table-responsive">
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>Código</th>
                <th>Alumno</th>
                <th>Curso</th>
              </tr>
            </thead>

            <tbody>
              {asignacionesAlumnos.map(
                (asignacion) => (
                  <tr
                    key={
                      asignacion.alumnoId
                    }
                  >
                    <td>
                      {
                        asignacion.codigoAlumno
                      }
                    </td>

                    <td>
                      {
                        asignacion.alumnoNombre
                      }
                    </td>

                    <td>
                      {
                        asignacion.cursoNombre
                      }
                    </td>
                  </tr>
                )
              )}

              {asignacionesAlumnos.length ===
                0 && (
                <tr>
                  <td colSpan="3">
                    No existen asignaciones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section">
        <h2>Asignaciones de apoderados</h2>

        <div className="table-responsive">
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>Apoderado</th>
                <th>Código alumno</th>
                <th>Alumno</th>
              </tr>
            </thead>

            <tbody>
              {asignacionesApoderados.map(
                (asignacion) => (
                  <tr key={asignacion.id}>
                    <td>
                      {
                        asignacion.apoderadoNombre
                      }
                    </td>

                    <td>
                      {
                        asignacion.codigoAlumno
                      }
                    </td>

                    <td>
                      {
                        asignacion.alumnoNombre
                      }
                    </td>
                  </tr>
                )
              )}

              {asignacionesApoderados.length ===
                0 && (
                <tr>
                  <td colSpan="3">
                    No existen asignaciones.
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