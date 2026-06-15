import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { crearEvaluacionProfesor, crearNotaProfesor, getCursoAlumnos, getProfesorDashboard, registrarAsistenciaProfesor } from '../api/bffApi.js';

export default function Profesor() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('cursos');
  const [activeCourseAction, setActiveCourseAction] = useState('');
  const [cursos, setCursos] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [anotaciones, setAnotaciones] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [alumnosCurso, setAlumnosCurso] = useState([]);
  const [notasForm, setNotasForm] = useState({});
  const [asistenciaForm, setAsistenciaForm] = useState({});
  const [fechaAsistencia, setFechaAsistencia] = useState(new Date().toISOString().split('T')[0]);
  const [evaluacionForm, setEvaluacionForm] = useState({ cursoId: '', titulo: '', fecha: '', tipo: 'Prueba', descripcion: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) cargarDatosProfesor();
  }, [user]);

  const cargarDatosProfesor = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProfesorDashboard(user.id);
      setCursos(data.cursos || []);
      setMensajes(data.mensajes || []);
      setAnotaciones(data.anotaciones || []);
      setEvaluaciones(data.proximasEvaluaciones || []);
    } catch (e) {
      setError(e.message || 'Error al cargar el panel del profesor.');
    } finally {
      setLoading(false);
    }
  };

  const cargarAlumnosPorCurso = async (cursoId) => {
    setSelectedCurso(cursoId);
    setError('');
    try {
      setAlumnosCurso(await getCursoAlumnos(cursoId));
    } catch (e) {
      setError(e.message || 'Error al cargar alumnos del curso.');
    }
  };

  const abrirAccionCurso = async (cursoId, action) => {
    setActiveTab('cursos');
    setActiveCourseAction(action);
    await cargarAlumnosPorCurso(cursoId);
  };

  const abrirCalendarioCurso = async (cursoId) => {
    setActiveCourseAction('');
    setSelectedCurso(cursoId);
    setEvaluacionForm((prev) => ({ ...prev, cursoId: String(cursoId) }));
    setActiveTab('evaluaciones');
  };

  const seleccionarCursoEvaluacion = (cursoId) => {
    setSelectedCurso(cursoId ? Number(cursoId) : null);
    setEvaluacionForm((prev) => ({ ...prev, cursoId }));
  };

  const cursoActual = cursos.find((c) => c.id === selectedCurso);

  const actualizarNotaForm = (alumnoId, campo, valor) => {
    setNotasForm((prev) => ({
      ...prev,
      [alumnoId]: {
        ...(prev[alumnoId] || {}),
        [campo]: valor
      }
    }));
  };

  const actualizarAsistenciaForm = (alumnoId, campo, valor) => {
    setAsistenciaForm((prev) => ({
      ...prev,
      [alumnoId]: {
        ...(prev[alumnoId] || {}),
        [campo]: valor
      }
    }));
  };

  const guardarNotas = async () => {
    const entradas = Object.entries(notasForm).filter(([, datos]) => datos?.nota !== '' && datos?.nota !== null && datos?.nota !== undefined);
    if (!selectedCurso || entradas.length === 0) return;

    try {
      await Promise.all(entradas.map(([alumnoId, datos]) => crearNotaProfesor({
        alumnoId: Number(alumnoId),
        cursoId: selectedCurso,
        profesorUsuarioId: user.id,
        asignatura: cursoActual?.asignatura || 'Sin asignatura',
        nota: Number(datos.nota),
        descripcion: datos.descripcion || ''
      })));
      alert('Notas guardadas correctamente');
      setNotasForm({});
      await cargarDatosProfesor();
    } catch (e) {
      alert(e.message || 'Error al guardar notas');
    }
  };

  const guardarAsistencia = async () => {
    const entradas = Object.entries(asistenciaForm).filter(([, datos]) => datos?.estado);
    if (!selectedCurso || entradas.length === 0) return;

    try {
      await Promise.all(entradas.map(([alumnoId, datos]) => registrarAsistenciaProfesor({
        alumnoId: Number(alumnoId),
        cursoId: selectedCurso,
        fecha: fechaAsistencia,
        estado: datos.estado,
        presente: datos.estado === 'presente' || datos.estado === 'justificado',
        observacion: datos.observacion || '',
        profesorUsuarioId: user.id
      })));
      alert('Asistencia guardada correctamente');
      setAsistenciaForm({});
      await cargarDatosProfesor();
    } catch (e) {
      alert(e.message || 'Error al guardar asistencia');
    }
  };

  const guardarEvaluacion = async () => {
    const cursoId = Number(evaluacionForm.cursoId || selectedCurso);
    const cursoEvaluacion = cursos.find((curso) => curso.id === cursoId);
    if (!cursoId || !evaluacionForm.titulo || !evaluacionForm.fecha) return;

    try {
      await crearEvaluacionProfesor({
        cursoId,
        profesorUsuarioId: user.id,
        asignatura: cursoEvaluacion?.asignatura || 'Sin asignatura',
        titulo: evaluacionForm.titulo,
        descripcion: evaluacionForm.descripcion,
        fecha: evaluacionForm.fecha,
        hora: null,
        tipo: evaluacionForm.tipo || 'Evaluación'
      });
      alert('Evaluación programada correctamente');
      setEvaluacionForm({ cursoId: String(cursoId), titulo: '', fecha: '', tipo: 'Prueba', descripcion: '' });
      setSelectedCurso(cursoId);
      await cargarDatosProfesor();
    } catch (e) {
      alert(e.message || 'Error al programar evaluación');
    }
  };

  const formatoFecha = (fecha) => (fecha ? new Date(`${fecha}T00:00:00`).toLocaleDateString('es-CL') : '-');

  if (loading) {
    return <div className="role-page"><div className="text-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div><p className="mt-2">Cargando tu información...</p></div></div>;
  }

  return (
    <div className="role-page">
      <div className="role-hero">
        <span className="hero-badge">Colegio Bernardo O&apos;Higgins</span>
        <h1>Panel de Profesor</h1>
        <p>Bienvenido, {user?.nombre}</p>
        <small className="text-light opacity-75">{cursos.length} cursos asignados</small>
      </div>

      {error && <div className="form-error mb-3">{error}</div>}

      <div className="row g-4 mb-4">
        <div className="col-md-6"><div className="role-stat-card"><span>Cursos Asignados</span><strong>{cursos.length}</strong><small>Activos este semestre</small></div></div>
        <div className="col-md-6"><div className="role-stat-card"><span>Evaluaciones</span><strong>{evaluaciones.length}</strong><small>Fechas programadas</small></div></div>
      </div>

      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'cursos' ? 'active' : ''}`} onClick={() => setActiveTab('cursos')}>Mis Cursos</button>
        <button className={`tab-btn ${activeTab === 'evaluaciones' ? 'active' : ''}`} onClick={() => { setActiveCourseAction(''); setActiveTab('evaluaciones'); }}>Calendario de Evaluaciones</button>
        <button className={`tab-btn ${activeTab === 'mensajes' ? 'active' : ''}`} onClick={() => { setActiveCourseAction(''); setActiveTab('mensajes'); }}>Mensajes</button>
      </div>

      {activeTab === 'cursos' && (
        <div className="role-card">
          <h3>Mis Cursos</h3>
          <div className="row g-4">
            {cursos.map((curso) => (
              <div key={curso.id} className="col-md-6 col-lg-4">
                <div className={`curso-card ${selectedCurso === curso.id ? 'curso-card-active' : ''}`}>
                  <div className="curso-header"><span className="curso-nivel">{curso.nivel || 'Nivel no definido'}</span><span className="curso-anio">{curso.anio}</span></div>
                  <div className="curso-body">
                    <h4>{curso.nombre}</h4>
                    <p><strong>Asignatura:</strong> {curso.asignatura || '-'}</p>
                    <p><strong>Alumnos:</strong> {curso.totalAlumnos || 0}</p>
                  </div>
                  <div className="curso-footer">
                    <button className="btn-small" onClick={() => abrirAccionCurso(curso.id, 'notas')}>Ingresar Notas</button>
                    <button className="btn-small" onClick={() => abrirAccionCurso(curso.id, 'asistencia')}>Tomar Asistencia</button>
                    <button className="btn-small" onClick={() => abrirCalendarioCurso(curso.id)}>Programar Evaluación</button>
                  </div>
                </div>
              </div>
            ))}
            {cursos.length === 0 && <p className="text-muted">No tienes cursos asignados.</p>}
          </div>

          {selectedCurso && activeCourseAction === 'notas' && (
            <div className="course-action-panel mt-4">
              <div className="course-action-header">
                <div>
                  <span className="course-action-label">Ingresar notas</span>
                  <h4>{cursoActual?.nombre || 'Curso seleccionado'}</h4>
                </div>
                <button className="btn-small" onClick={() => setActiveCourseAction('')}>Cerrar</button>
              </div>
              {alumnosCurso.length > 0 ? <div className="table-responsive"><table className="table table-bordered"><thead className="table-dark"><tr><th>Alumno</th><th>Correo</th><th>Nota</th><th>Descripción</th></tr></thead><tbody>{alumnosCurso.map((alumno) => <tr key={alumno.id}><td>{alumno.nombre}</td><td>{alumno.email || '-'}</td><td><input type="number" step="0.1" min="1" max="7" className="form-control" style={{ width: '120px' }} value={notasForm[alumno.id]?.nota || ''} onChange={(e) => actualizarNotaForm(alumno.id, 'nota', e.target.value)} /></td><td><input className="form-control" value={notasForm[alumno.id]?.descripcion || ''} onChange={(e) => actualizarNotaForm(alumno.id, 'descripcion', e.target.value)} placeholder="Descripción de la evaluación" /></td></tr>)}</tbody></table></div> : <p className="text-muted">No hay alumnos en este curso.</p>}
              {alumnosCurso.length > 0 && <button className="btn-primary-small mt-3" onClick={guardarNotas}>Guardar Notas</button>}
            </div>
          )}

          {selectedCurso && activeCourseAction === 'asistencia' && (
            <div className="course-action-panel mt-4">
              <div className="course-action-header">
                <div>
                  <span className="course-action-label">Tomar asistencia</span>
                  <h4>{cursoActual?.nombre || 'Curso seleccionado'}</h4>
                </div>
                <button className="btn-small" onClick={() => setActiveCourseAction('')}>Cerrar</button>
              </div>
              <div className="mb-3"><label className="form-label">Fecha</label><input type="date" className="form-control" style={{ width: '220px' }} value={fechaAsistencia} onChange={(e) => setFechaAsistencia(e.target.value)} /></div>
              {alumnosCurso.length > 0 ? <div className="table-responsive"><table className="table table-bordered"><thead className="table-dark"><tr><th>Alumno</th><th>Presente</th><th>Ausente</th><th>Justificado</th><th>Observación</th></tr></thead><tbody>{alumnosCurso.map((alumno) => <tr key={alumno.id}><td>{alumno.nombre}</td>{['presente', 'ausente', 'justificado'].map((estado) => <td key={estado}><input type="radio" name={`asistencia-${alumno.id}`} checked={asistenciaForm[alumno.id]?.estado === estado} onChange={() => actualizarAsistenciaForm(alumno.id, 'estado', estado)} /></td>)}<td><input className="form-control" value={asistenciaForm[alumno.id]?.observacion || ''} onChange={(e) => actualizarAsistenciaForm(alumno.id, 'observacion', e.target.value)} placeholder="Observación" /></td></tr>)}</tbody></table></div> : <p className="text-muted">No hay alumnos en este curso.</p>}
              {alumnosCurso.length > 0 && <button className="btn-primary-small mt-3" onClick={guardarAsistencia}>Guardar Asistencia</button>}
            </div>
          )}
        </div>
      )}

      {activeTab === 'evaluaciones' && (
        <div className="role-card">
          <h3>Calendario de Evaluaciones</h3>
          <div className="row g-3 mb-4">
            <div className="col-md-4"><label className="form-label">Curso</label><select className="form-control" value={evaluacionForm.cursoId} onChange={(e) => seleccionarCursoEvaluacion(e.target.value)}><option value="">Seleccionar curso</option>{cursos.map((curso) => <option key={curso.id} value={curso.id}>{curso.nombre} - {curso.asignatura || 'Sin asignatura'}</option>)}</select></div>
            <div className="col-md-4"><label className="form-label">Título</label><input className="form-control" value={evaluacionForm.titulo} onChange={(e) => setEvaluacionForm({ ...evaluacionForm, titulo: e.target.value })} /></div>
            <div className="col-md-4"><label className="form-label">Fecha</label><input type="date" className="form-control" value={evaluacionForm.fecha} onChange={(e) => setEvaluacionForm({ ...evaluacionForm, fecha: e.target.value })} /></div>
            <div className="col-md-4"><label className="form-label">Tipo</label><input className="form-control" value={evaluacionForm.tipo} onChange={(e) => setEvaluacionForm({ ...evaluacionForm, tipo: e.target.value })} /></div>
            <div className="col-md-8"><label className="form-label">Descripción</label><input className="form-control" value={evaluacionForm.descripcion} onChange={(e) => setEvaluacionForm({ ...evaluacionForm, descripcion: e.target.value })} /></div>
            <div className="col-md-12"><button className="btn-primary-small" onClick={guardarEvaluacion}>Programar Evaluación</button></div>
          </div>
          <h4>Evaluaciones Programadas</h4>
          {evaluaciones.length > 0 ? <div className="table-responsive"><table className="table table-bordered"><thead className="table-dark"><tr><th>Curso</th><th>Asignatura</th><th>Título</th><th>Fecha</th><th>Tipo</th></tr></thead><tbody>{evaluaciones.map((ev) => <tr key={ev.id}><td>{ev.cursoNombre || ev.cursoId}</td><td>{ev.asignatura}</td><td>{ev.titulo}</td><td>{formatoFecha(ev.fecha)}</td><td>{ev.tipo || '-'}</td></tr>)}</tbody></table></div> : <p className="text-muted">No hay evaluaciones programadas.</p>}
        </div>
      )}

      {activeTab === 'mensajes' && <div className="role-card"><h3>Mensajes</h3><p className="text-muted">No tienes mensajes nuevos.</p></div>}
    </div>
  );
}
