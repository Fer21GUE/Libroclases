import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  useAuth
} from '../contexts/AuthContext.jsx';

import {
  crearEvaluacionProfesor,
  crearNotaProfesor,
  getCursoAlumnos,
  getProfesorDashboard,
  registrarAsistenciaProfesor
} from '../api/bffApi.js';

import {
  getNotasProfesorCurso,
  updateNotaProfesor
} from '../api/gradesApi.js';

import MessagesPanel
  from '../components/messages/MessagesPanel.jsx';

const notaPattern =
  /^(?:[1-6](?:[.,]\d{0,2})?|7(?:[.,]0{0,2})?)$/;

const limpiarNota = (valor) => {
  return valor
    .replace(/[^\d.,]/g, '')
    .replace(',', '.')
    .slice(0, 4);
};

const notaValida = (valor) => {
  if (!notaPattern.test(valor)) {
    return false;
  }

  const numero = Number(
    valor.replace(',', '.')
  );

  return (
    Number.isFinite(numero) &&
    numero >= 1 &&
    numero <= 7
  );
};

const formatearNotaEntrada = (
  valor
) => {
  if (
    valor === null ||
    valor === undefined
  ) {
    return '';
  }

  return String(valor)
    .replace('.', ',');
};

export default function Profesor() {
  const { user } = useAuth();

  const [
    activeTab,
    setActiveTab
  ] = useState('cursos');

  const [
    activeCourseAction,
    setActiveCourseAction
  ] = useState('');

  const [cursos, setCursos] =
    useState([]);

  const [
    evaluaciones,
    setEvaluaciones
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    selectedCurso,
    setSelectedCurso
  ] = useState(null);

  const [
    selectedAsignatura,
    setSelectedAsignatura
  ] = useState('');

  const [
    alumnosCurso,
    setAlumnosCurso
  ] = useState([]);

  const [
    notasForm,
    setNotasForm
  ] = useState({});

  const [
    notasRegistradas,
    setNotasRegistradas
  ] = useState([]);

  const [
    editarNotaId,
    setEditarNotaId
  ] = useState(null);

  const [
    editarNotaForm,
    setEditarNotaForm
  ] = useState({
    nota: '',
    descripcion: ''
  });

  const [
    cargandoNotas,
    setCargandoNotas
  ] = useState(false);

  const [
    guardandoNotaId,
    setGuardandoNotaId
  ] = useState(null);

  const [
    asistenciaForm,
    setAsistenciaForm
  ] = useState({});

  const [
    fechaAsistencia,
    setFechaAsistencia
  ] = useState(
    new Date()
      .toISOString()
      .split('T')[0]
  );

  const [
    evaluacionForm,
    setEvaluacionForm
  ] = useState({
    cursoId: '',
    titulo: '',
    fecha: '',
    tipo: 'Prueba',
    descripcion: ''
  });

  const [error, setError] =
    useState('');

  const [
    notasError,
    setNotasError
  ] = useState('');

  useEffect(() => {
    if (user) {
      cargarDatosProfesor();
    }
  }, [user]);

  const cursoActual = useMemo(
    () =>
      cursos.find(
        (curso) =>
          curso.id === selectedCurso &&
          curso.asignatura ===
            selectedAsignatura
      ) ||
      cursos.find(
        (curso) =>
          curso.id === selectedCurso
      ),
    [
      cursos,
      selectedCurso,
      selectedAsignatura
    ]
  );

  const notasPorAlumno = useMemo(
    () =>
      notasRegistradas.reduce(
        (resultado, nota) => {
          if (
            !resultado[nota.alumnoId]
          ) {
            resultado[nota.alumnoId] =
              [];
          }

          resultado[
            nota.alumnoId
          ].push(nota);

          return resultado;
        },
        {}
      ),
    [notasRegistradas]
  );

  const cargarDatosProfesor =
    async () => {
      setLoading(true);
      setError('');

      try {
        const data =
          await getProfesorDashboard(
            user.id
          );

        setCursos(
          data.cursos || []
        );

        setEvaluaciones(
          data.proximasEvaluaciones ||
            []
        );
      } catch (e) {
        setError(
          e.message ||
          'Error al cargar el panel del profesor.'
        );
      } finally {
        setLoading(false);
      }
    };

  const cargarAlumnosPorCurso =
    async (cursoId) => {
      const data =
        await getCursoAlumnos(
          cursoId
        );

      setAlumnosCurso(
        data || []
      );
    };

  const cargarNotasRegistradas =
    async (
      cursoId,
      asignatura
    ) => {
      setCargandoNotas(true);
      setNotasError('');

      try {
        const data =
          await getNotasProfesorCurso(
            user.id,
            cursoId,
            asignatura
          );

        setNotasRegistradas(
          data || []
        );
      } catch (e) {
        setNotasRegistradas([]);

        setNotasError(
          e.message ||
          'Error al cargar las notas registradas.'
        );
      } finally {
        setCargandoNotas(false);
      }
    };

  const abrirAccionCurso = async (
    curso,
    action
  ) => {
    setActiveTab('cursos');
    setActiveCourseAction(action);
    setSelectedCurso(curso.id);

    setSelectedAsignatura(
      curso.asignatura || ''
    );

    setNotasForm({});
    setEditarNotaId(null);
    setNotasError('');
    setError('');

    try {
      await cargarAlumnosPorCurso(
        curso.id
      );

      if (action === 'notas') {
        await cargarNotasRegistradas(
          curso.id,
          curso.asignatura || ''
        );
      }
    } catch (e) {
      setError(
        e.message ||
        'Error al cargar los datos del curso.'
      );
    }
  };

  const abrirCalendarioCurso = (
    curso
  ) => {
    setActiveCourseAction('');
    setSelectedCurso(curso.id);

    setSelectedAsignatura(
      curso.asignatura || ''
    );

    setEvaluacionForm(
      (prev) => ({
        ...prev,
        cursoId: String(curso.id)
      })
    );

    setActiveTab('evaluaciones');
  };

  const seleccionarCursoEvaluacion = (
    valor
  ) => {
    const [
      cursoIdTexto,
      asignatura
    ] = valor.split('|');

    const cursoId =
      cursoIdTexto
        ? Number(cursoIdTexto)
        : null;

    setSelectedCurso(cursoId);
    setSelectedAsignatura(
      asignatura || ''
    );

    setEvaluacionForm(
      (prev) => ({
        ...prev,
        cursoId: valor
      })
    );
  };

  const actualizarNotaForm = (
    alumnoId,
    campo,
    valor
  ) => {
    const nuevoValor =
      campo === 'nota'
        ? limpiarNota(valor)
        : valor.slice(0, 150);

    setNotasForm(
      (prev) => ({
        ...prev,
        [alumnoId]: {
          ...(prev[alumnoId] ||
            {}),
          [campo]: nuevoValor
        }
      })
    );

    setNotasError('');
  };

  const guardarNotas = async () => {
    const entradas =
      Object.entries(notasForm)
        .filter(
          ([, datos]) =>
            datos?.nota !== '' &&
            datos?.nota !== null &&
            datos?.nota !==
              undefined
        );

    if (
      !selectedCurso ||
      entradas.length === 0
    ) {
      setNotasError(
        'Ingrese al menos una nota.'
      );

      return;
    }

    const notaIncorrecta =
      entradas.find(
        ([, datos]) =>
          !notaValida(datos.nota)
      );

    if (notaIncorrecta) {
      setNotasError(
        'Las notas deben estar entre 1,00 y 7,00 y pueden tener como máximo dos decimales.'
      );

      return;
    }

    try {
      await Promise.all(
        entradas.map(
          ([alumnoId, datos]) =>
            crearNotaProfesor({
              alumnoId:
                Number(alumnoId),

              cursoId:
                selectedCurso,

              profesorUsuarioId:
                user.id,

              asignatura:
                selectedAsignatura,

              nota:
                Number(
                  datos.nota.replace(
                    ',',
                    '.'
                  )
                ),

              descripcion:
                datos.descripcion?.trim() ||
                ''
            })
        )
      );

      setNotasForm({});

      await cargarNotasRegistradas(
        selectedCurso,
        selectedAsignatura
      );

      await cargarDatosProfesor();

      alert(
        'Notas guardadas correctamente.'
      );
    } catch (e) {
      setNotasError(
        e.message ||
        'Error al guardar las notas.'
      );
    }
  };

  const comenzarEdicion = (
    nota
  ) => {
    setEditarNotaId(nota.id);

    setEditarNotaForm({
      nota:
        formatearNotaEntrada(
          nota.nota
        ),

      descripcion:
        nota.descripcion || ''
    });

    setNotasError('');
  };

  const cancelarEdicion = () => {
    setEditarNotaId(null);

    setEditarNotaForm({
      nota: '',
      descripcion: ''
    });
  };

  const guardarEdicion = async (
    notaId
  ) => {
    if (
      !notaValida(
        editarNotaForm.nota
      )
    ) {
      setNotasError(
        'La nota debe estar entre 1,00 y 7,00 y puede tener como máximo dos decimales.'
      );

      return;
    }

    setGuardandoNotaId(notaId);
    setNotasError('');

    try {
      await updateNotaProfesor(
        notaId,
        {
          profesorUsuarioId:
            user.id,

          nota: Number(
            editarNotaForm.nota.replace(
              ',',
              '.'
            )
          ),

          descripcion:
            editarNotaForm
              .descripcion
              .trim()
        }
      );

      cancelarEdicion();

      await cargarNotasRegistradas(
        selectedCurso,
        selectedAsignatura
      );
    } catch (e) {
      setNotasError(
        e.message ||
        'Error al modificar la nota.'
      );
    } finally {
      setGuardandoNotaId(null);
    }
  };

  const actualizarAsistenciaForm = (
    alumnoId,
    campo,
    valor
  ) => {
    setAsistenciaForm(
      (prev) => ({
        ...prev,
        [alumnoId]: {
          ...(prev[alumnoId] ||
            {}),
          [campo]: valor
        }
      })
    );
  };

  const guardarAsistencia =
    async () => {
      const entradas =
        Object.entries(
          asistenciaForm
        ).filter(
          ([, datos]) =>
            datos?.estado
        );

      if (
        !selectedCurso ||
        entradas.length === 0
      ) {
        return;
      }

      try {
        await Promise.all(
          entradas.map(
            ([alumnoId, datos]) =>
              registrarAsistenciaProfesor(
                {
                  alumnoId:
                    Number(
                      alumnoId
                    ),

                  cursoId:
                    selectedCurso,

                  fecha:
                    fechaAsistencia,

                  estado:
                    datos.estado,

                  presente:
                    datos.estado ===
                      'presente' ||
                    datos.estado ===
                      'justificado',

                  observacion:
                    datos.observacion ||
                    '',

                  profesorUsuarioId:
                    user.id
                }
              )
          )
        );

        setAsistenciaForm({});

        alert(
          'Asistencia guardada correctamente.'
        );
      } catch (e) {
        alert(
          e.message ||
          'Error al guardar asistencia.'
        );
      }
    };

  const guardarEvaluacion =
    async () => {
      const cursoId =
        selectedCurso;

      if (
        !cursoId ||
        !evaluacionForm.titulo ||
        !evaluacionForm.fecha
      ) {
        return;
      }

      try {
        await crearEvaluacionProfesor(
          {
            cursoId,

            profesorUsuarioId:
              user.id,

            asignatura:
              selectedAsignatura ||
              'Sin asignatura',

            titulo:
              evaluacionForm.titulo,

            descripcion:
              evaluacionForm
                .descripcion,

            fecha:
              evaluacionForm.fecha,

            hora: null,

            tipo:
              evaluacionForm.tipo ||
              'Evaluación'
          }
        );

        setEvaluacionForm({
          cursoId:
            `${cursoId}|${selectedAsignatura}`,

          titulo: '',
          fecha: '',
          tipo: 'Prueba',
          descripcion: ''
        });

        await cargarDatosProfesor();

        alert(
          'Evaluación programada correctamente.'
        );
      } catch (e) {
        alert(
          e.message ||
          'Error al programar evaluación.'
        );
      }
    };

  const formatoFecha = (
    fecha
  ) => {
    if (!fecha) {
      return '-';
    }

    return new Date(
      fecha
    ).toLocaleDateString(
      'es-CL'
    );
  };

  if (loading) {
    return (
      <div className="role-page">
        <div className="text-center mt-5">
          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Cargando...
            </span>
          </div>

          <p className="mt-2">
            Cargando tu información...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="role-page">
      <div className="role-hero">
        <span className="hero-badge">
          Colegio Bernardo O&apos;Higgins
        </span>

        <h1>
          Panel de Profesor
        </h1>

        <p>
          Bienvenido, {user?.nombre}
        </p>

        <small className="text-light opacity-75">
          {cursos.length}{' '}
          cursos asignados
        </small>
      </div>

      {error && (
        <div className="form-error mb-3">
          {error}
        </div>
      )}

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="role-stat-card">
            <span>
              Cursos Asignados
            </span>

            <strong>
              {cursos.length}
            </strong>

            <small>
              Activos este semestre
            </small>
          </div>
        </div>

        <div className="col-md-6">
          <div className="role-stat-card">
            <span>
              Evaluaciones
            </span>

            <strong>
              {evaluaciones.length}
            </strong>

            <small>
              Fechas programadas
            </small>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <button
          className={
            `tab-btn ${
              activeTab === 'cursos'
                ? 'active'
                : ''
            }`
          }
          onClick={() =>
            setActiveTab('cursos')
          }
        >
          Mis Cursos
        </button>

        <button
          className={
            `tab-btn ${
              activeTab ===
              'evaluaciones'
                ? 'active'
                : ''
            }`
          }
          onClick={() => {
            setActiveCourseAction('');
            setActiveTab(
              'evaluaciones'
            );
          }}
        >
          Calendario de Evaluaciones
        </button>

        <button
          className={
            `tab-btn ${
              activeTab === 'mensajes'
                ? 'active'
                : ''
            }`
          }
          onClick={() => {
            setActiveCourseAction('');
            setActiveTab('mensajes');
          }}
        >
          Mensajes
        </button>
      </div>

      {activeTab === 'cursos' && (
        <div className="role-card">
          <h3>
            Mis Cursos
          </h3>

          <div className="row g-4">
            {cursos.map(
              (curso, index) => (
                <div
                  key={
                    `${curso.id}-${curso.asignatura}-${index}`
                  }
                  className="col-md-6 col-lg-4"
                >
                  <div
                    className={
                      `curso-card ${
                        selectedCurso ===
                          curso.id &&
                        selectedAsignatura ===
                          curso.asignatura
                          ? 'curso-card-active'
                          : ''
                      }`
                    }
                  >
                    <div className="curso-header">
                      <span className="curso-nivel">
                        {curso.nivel ||
                          'Nivel no definido'}
                      </span>

                      <span className="curso-anio">
                        {curso.anio}
                      </span>
                    </div>

                    <div className="curso-body">
                      <h4>
                        {curso.nombre}
                      </h4>

                      <p>
                        <strong>
                          Asignatura:
                        </strong>{' '}
                        {curso.asignatura ||
                          '-'}
                      </p>

                      <p>
                        <strong>
                          Alumnos:
                        </strong>{' '}
                        {curso.totalAlumnos ||
                          0}
                      </p>
                    </div>

                    <div className="curso-footer">
                      <button
                        className="btn-small"
                        onClick={() =>
                          abrirAccionCurso(
                            curso,
                            'notas'
                          )
                        }
                      >
                        Ingresar Notas
                      </button>

                      <button
                        className="btn-small"
                        onClick={() =>
                          abrirAccionCurso(
                            curso,
                            'asistencia'
                          )
                        }
                      >
                        Tomar Asistencia
                      </button>

                      <button
                        className="btn-small"
                        onClick={() =>
                          abrirCalendarioCurso(
                            curso
                          )
                        }
                      >
                        Programar Evaluación
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}

            {cursos.length === 0 && (
              <p className="text-muted">
                No tienes cursos asignados.
              </p>
            )}
          </div>

          {selectedCurso &&
            activeCourseAction ===
              'notas' && (
            <div className="course-action-panel mt-4">
              <div className="course-action-header">
                <div>
                  <span className="course-action-label">
                    Ingresar y administrar notas
                  </span>

                  <h4>
                    {cursoActual?.nombre ||
                      'Curso seleccionado'}
                  </h4>

                  <p className="mb-0 text-muted">
                    {selectedAsignatura}
                  </p>
                </div>

                <button
                  className="btn-small"
                  onClick={() =>
                    setActiveCourseAction(
                      ''
                    )
                  }
                >
                  Cerrar
                </button>
              </div>

              {notasError && (
                <div className="form-error mb-3">
                  {notasError}
                </div>
              )}

              {alumnosCurso.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-dark">
                      <tr>
                        <th>Alumno</th>
                        <th>Correo</th>
                        <th>Nueva nota</th>
                        <th>Descripción</th>
                      </tr>
                    </thead>

                    <tbody>
                      {alumnosCurso.map(
                        (alumno) => (
                          <tr key={alumno.id}>
                            <td>
                              {alumno.nombre}
                            </td>

                            <td>
                              {alumno.email ||
                                '-'}
                            </td>

                            <td>
                              <input
                                type="text"
                                inputMode="decimal"
                                className="form-control"
                                style={{
                                  width:
                                    '120px'
                                }}
                                placeholder="1,00 a 7,00"
                                value={
                                  notasForm[
                                    alumno.id
                                  ]?.nota ||
                                  ''
                                }
                                onChange={(e) =>
                                  actualizarNotaForm(
                                    alumno.id,
                                    'nota',
                                    e.target
                                      .value
                                  )
                                }
                              />
                            </td>

                            <td>
                              <input
                                className="form-control"
                                maxLength={150}
                                value={
                                  notasForm[
                                    alumno.id
                                  ]
                                    ?.descripcion ||
                                  ''
                                }
                                onChange={(e) =>
                                  actualizarNotaForm(
                                    alumno.id,
                                    'descripcion',
                                    e.target
                                      .value
                                  )
                                }
                                placeholder="Descripción de la evaluación"
                              />
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">
                  No hay alumnos en este curso.
                </p>
              )}

              {alumnosCurso.length > 0 && (
                <button
                  className="btn-primary-small mt-3"
                  onClick={guardarNotas}
                >
                  Guardar nuevas notas
                </button>
              )}

              <hr className="my-4" />

              <h4>
                Notas registradas
              </h4>

              {cargandoNotas ? (
                <p className="text-muted">
                  Cargando notas...
                </p>
              ) : notasRegistradas.length >
                0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-dark">
                      <tr>
                        <th>Alumno</th>
                        <th>Nota</th>
                        <th>Descripción</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {alumnosCurso.flatMap(
                        (alumno) =>
                          (
                            notasPorAlumno[
                              alumno.id
                            ] || []
                          ).map((nota) => {
                            const editando =
                              editarNotaId ===
                              nota.id;

                            return (
                              <tr
                                key={
                                  nota.id
                                }
                              >
                                <td>
                                  {
                                    alumno.nombre
                                  }
                                </td>

                                <td>
                                  {editando ? (
                                    <input
                                      type="text"
                                      inputMode="decimal"
                                      className="form-control"
                                      style={{
                                        width:
                                          '110px'
                                      }}
                                      value={
                                        editarNotaForm.nota
                                      }
                                      onChange={(e) =>
                                        setEditarNotaForm(
                                          (
                                            prev
                                          ) => ({
                                            ...prev,
                                            nota:
                                              limpiarNota(
                                                e
                                                  .target
                                                  .value
                                              )
                                          })
                                        )
                                      }
                                    />
                                  ) : (
                                    Number(
                                      nota.nota
                                    ).toLocaleString(
                                      'es-CL',
                                      {
                                        minimumFractionDigits:
                                          1,
                                        maximumFractionDigits:
                                          2
                                      }
                                    )
                                  )}
                                </td>

                                <td>
                                  {editando ? (
                                    <input
                                      className="form-control"
                                      maxLength={
                                        150
                                      }
                                      value={
                                        editarNotaForm.descripcion
                                      }
                                      onChange={(e) =>
                                        setEditarNotaForm(
                                          (
                                            prev
                                          ) => ({
                                            ...prev,
                                            descripcion:
                                              e
                                                .target
                                                .value
                                          })
                                        )
                                      }
                                    />
                                  ) : (
                                    nota.descripcion ||
                                    '-'
                                  )}
                                </td>

                                <td>
                                  {formatoFecha(
                                    nota.fecha
                                  )}
                                </td>

                                <td>
                                  {editando ? (
                                    <div className="d-flex gap-2">
                                      <button
                                        type="button"
                                        className="btn btn-success btn-sm"
                                        disabled={
                                          guardandoNotaId ===
                                          nota.id
                                        }
                                        onClick={() =>
                                          guardarEdicion(
                                            nota.id
                                          )
                                        }
                                      >
                                        {guardandoNotaId ===
                                        nota.id
                                          ? 'Guardando...'
                                          : 'Guardar'}
                                      </button>

                                      <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        onClick={
                                          cancelarEdicion
                                        }
                                      >
                                        Cancelar
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-sm"
                                      onClick={() =>
                                        comenzarEdicion(
                                          nota
                                        )
                                      }
                                    >
                                      Editar
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">
                  Todavía no existen notas registradas por este profesor para esta asignatura.
                </p>
              )}
            </div>
          )}

          {selectedCurso &&
            activeCourseAction ===
              'asistencia' && (
            <div className="course-action-panel mt-4">
              <div className="course-action-header">
                <div>
                  <span className="course-action-label">
                    Tomar asistencia
                  </span>

                  <h4>
                    {cursoActual?.nombre ||
                      'Curso seleccionado'}
                  </h4>
                </div>

                <button
                  className="btn-small"
                  onClick={() =>
                    setActiveCourseAction(
                      ''
                    )
                  }
                >
                  Cerrar
                </button>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Fecha
                </label>

                <input
                  type="date"
                  className="form-control"
                  style={{
                    width: '220px'
                  }}
                  value={fechaAsistencia}
                  onChange={(e) =>
                    setFechaAsistencia(
                      e.target.value
                    )
                  }
                />
              </div>

              {alumnosCurso.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-dark">
                      <tr>
                        <th>Alumno</th>
                        <th>Presente</th>
                        <th>Ausente</th>
                        <th>Justificado</th>
                        <th>Observación</th>
                      </tr>
                    </thead>

                    <tbody>
                      {alumnosCurso.map(
                        (alumno) => (
                          <tr key={alumno.id}>
                            <td>
                              {alumno.nombre}
                            </td>

                            {[
                              'presente',
                              'ausente',
                              'justificado'
                            ].map(
                              (estado) => (
                                <td
                                  key={
                                    estado
                                  }
                                >
                                  <input
                                    type="radio"
                                    name={
                                      `asistencia-${alumno.id}`
                                    }
                                    checked={
                                      asistenciaForm[
                                        alumno.id
                                      ]?.estado ===
                                      estado
                                    }
                                    onChange={() =>
                                      actualizarAsistenciaForm(
                                        alumno.id,
                                        'estado',
                                        estado
                                      )
                                    }
                                  />
                                </td>
                              )
                            )}

                            <td>
                              <input
                                className="form-control"
                                value={
                                  asistenciaForm[
                                    alumno.id
                                  ]
                                    ?.observacion ||
                                  ''
                                }
                                onChange={(e) =>
                                  actualizarAsistenciaForm(
                                    alumno.id,
                                    'observacion',
                                    e.target
                                      .value
                                  )
                                }
                                placeholder="Observación"
                              />
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">
                  No hay alumnos en este curso.
                </p>
              )}

              {alumnosCurso.length > 0 && (
                <button
                  className="btn-primary-small mt-3"
                  onClick={
                    guardarAsistencia
                  }
                >
                  Guardar Asistencia
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab ===
        'evaluaciones' && (
        <div className="role-card">
          <h3>
            Calendario de Evaluaciones
          </h3>

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label">
                Curso
              </label>

              <select
                className="form-control"
                value={
                  evaluacionForm.cursoId
                }
                onChange={(e) =>
                  seleccionarCursoEvaluacion(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Seleccionar curso
                </option>

                {cursos.map(
                  (curso, index) => (
                    <option
                      key={
                        `${curso.id}-${curso.asignatura}-${index}`
                      }
                      value={
                        `${curso.id}|${curso.asignatura || ''}`
                      }
                    >
                      {curso.nombre} -{' '}
                      {curso.asignatura ||
                        'Sin asignatura'}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">
                Título
              </label>

              <input
                className="form-control"
                value={
                  evaluacionForm.titulo
                }
                onChange={(e) =>
                  setEvaluacionForm({
                    ...evaluacionForm,
                    titulo:
                      e.target.value
                  })
                }
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">
                Fecha
              </label>

              <input
                type="date"
                className="form-control"
                value={
                  evaluacionForm.fecha
                }
                onChange={(e) =>
                  setEvaluacionForm({
                    ...evaluacionForm,
                    fecha:
                      e.target.value
                  })
                }
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">
                Tipo
              </label>

              <input
                className="form-control"
                value={
                  evaluacionForm.tipo
                }
                onChange={(e) =>
                  setEvaluacionForm({
                    ...evaluacionForm,
                    tipo:
                      e.target.value
                  })
                }
              />
            </div>

            <div className="col-md-8">
              <label className="form-label">
                Descripción
              </label>

              <input
                className="form-control"
                value={
                  evaluacionForm
                    .descripcion
                }
                onChange={(e) =>
                  setEvaluacionForm({
                    ...evaluacionForm,
                    descripcion:
                      e.target.value
                  })
                }
              />
            </div>

            <div className="col-md-12">
              <button
                className="btn-primary-small"
                onClick={
                  guardarEvaluacion
                }
              >
                Programar Evaluación
              </button>
            </div>
          </div>

          <h4>
            Evaluaciones Programadas
          </h4>

          {evaluaciones.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Curso</th>
                    <th>Asignatura</th>
                    <th>Título</th>
                    <th>Fecha</th>
                    <th>Tipo</th>
                  </tr>
                </thead>

                <tbody>
                  {evaluaciones.map(
                    (evaluacion) => (
                      <tr
                        key={
                          evaluacion.id
                        }
                      >
                        <td>
                          {
                            evaluacion
                              .cursoNombre ||
                            evaluacion
                              .cursoId
                          }
                        </td>

                        <td>
                          {
                            evaluacion
                              .asignatura
                          }
                        </td>

                        <td>
                          {
                            evaluacion
                              .titulo
                          }
                        </td>

                        <td>
                          {formatoFecha(
                            evaluacion
                              .fecha
                          )}
                        </td>

                        <td>
                          {
                            evaluacion
                              .tipo ||
                            '-'
                          }
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">
              No hay evaluaciones programadas.
            </p>
          )}
        </div>
      )}

      {activeTab === 'mensajes' && (
        <MessagesPanel
          usuarioId={user.id}
        />
      )}
    </div>
  );
}