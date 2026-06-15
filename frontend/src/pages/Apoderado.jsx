import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getApoderadoDashboard, getDetalleAlumnoApoderado } from '../api/bffApi.js';
import { agruparNotasPorAsignatura, calcularPromedioGeneralAsignaturas } from '../utils/gradeHelpers.js';

export default function Apoderado() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('notas');
  const [alumnos, setAlumnos] = useState([]);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [notas, setNotas] = useState([]);
  const [asistencia, setAsistencia] = useState([]);
  const [proximasEvaluaciones, setProximasEvaluaciones] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [porcentajeAsistencia, setPorcentajeAsistencia] = useState(0);
  const [asignaturaAbierta, setAsignaturaAbierta] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagoMensaje, setPagoMensaje] = useState('');

  useEffect(() => {
    if (user) cargarDatosApoderado();
  }, [user]);

  const cargarDatosApoderado = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getApoderadoDashboard(user.id);
      setAlumnos(data.alumnos || []);
      setMensajes(data.mensajes || []);
      setSolicitudes(data.solicitudes || []);
      aplicarDetalle(data.alumnoSeleccionado);
    } catch (e) {
      setError(e.message || 'Error al cargar el panel del apoderado.');
    } finally {
      setLoading(false);
    }
  };

  const aplicarDetalle = (detalle) => {
    setAsignaturaAbierta('');
    if (!detalle) {
      setSelectedAlumno(null);
      setNotas([]);
      setAsistencia([]);
      setProximasEvaluaciones([]);
      setPorcentajeAsistencia(0);
      return;
    }
    setSelectedAlumno(detalle.alumno);
    setNotas(detalle.notas || []);
    setAsistencia(detalle.asistencia || []);
    setProximasEvaluaciones(detalle.proximasEvaluaciones || []);
    setPorcentajeAsistencia(detalle.porcentajeAsistencia || 0);
  };

  const handleAlumnoChange = async (alumnoId) => {
    const alumno = alumnos.find((a) => a.id === Number(alumnoId));
    setSelectedAlumno(alumno);
    setError('');
    try {
      aplicarDetalle(await getDetalleAlumnoApoderado(user.id, alumnoId));
    } catch (e) {
      setNotas([]);
      setAsistencia([]);
      setProximasEvaluaciones([]);
      setPorcentajeAsistencia(0);
      setError(e.message || 'Error al cargar detalle del alumno.');
    }
  };

  const formatoFecha = (fecha) => (fecha ? new Date(`${fecha}T00:00:00`).toLocaleDateString('es-CL') : '-');
  const notasPorAsignatura = agruparNotasPorAsignatura(notas);
  const promedioGeneral = calcularPromedioGeneralAsignaturas(notasPorAsignatura);

  if (loading) {
    return <div className="role-page"><div className="text-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div><p className="mt-2">Cargando tu información...</p></div></div>;
  }

  return (
    <div className="role-page">
      <div className="role-hero">
        <span className="hero-badge">Colegio Bernardo O&apos;Higgins</span>
        <h1>Panel de Apoderado</h1>
        <p>Bienvenido, {user?.nombre}</p>
        <small className="text-light opacity-75">{alumnos.length} {alumnos.length === 1 ? 'estudiante asociado' : 'estudiantes asociados'}</small>
      </div>

      {error && <div className="form-error mb-3">{error}</div>}

      {alumnos.length === 0 && <div className="role-card"><h3>Sin alumnos asociados</h3><p className="text-muted">No hay estudiantes asociados a este apoderado.</p></div>}

      {alumnos.length > 1 && <div className="mb-4"><label className="form-label fw-bold">Seleccionar estudiante</label><select className="form-control" style={{ maxWidth: '340px' }} onChange={(e) => handleAlumnoChange(e.target.value)} value={selectedAlumno?.id || ''}>{alumnos.map((alumno) => <option key={alumno.id} value={alumno.id}>{alumno.nombre} - {alumno.cursoNombre || 'Sin curso'}</option>)}</select></div>}

      {selectedAlumno && <>
        <div className="student-info-card student-info-card-simple"><div className="student-details"><h3>Alumno: {selectedAlumno.nombre}</h3><p className="student-course">Curso: {selectedAlumno.cursoNombre || 'No asignado'}</p><div className="student-badges"><span className="badge">Matrícula {new Date().getFullYear()}</span><span className="badge">Alumno regular</span></div></div></div>

        <div className="row g-4 mb-4"><div className="col-md-3"><div className="role-stat-card"><span>Promedio</span><strong>{promedioGeneral || '-'}</strong><small>{notasPorAsignatura.length} asignaturas</small></div></div><div className="col-md-3"><div className="role-stat-card"><span>Asistencia</span><strong>{porcentajeAsistencia}%</strong><small>{asistencia.length} registros</small></div></div><div className="col-md-3"><div className="role-stat-card"><span>Evaluaciones</span><strong>{proximasEvaluaciones.length}</strong><small>Próximas</small></div></div><div className="col-md-3"><div className="role-stat-card"><span>Mensajes</span><strong>{mensajes.filter((m) => !m.leido).length}</strong><small>No leídos</small></div></div></div>

        <div className="tabs-container"><button className={`tab-btn ${activeTab === 'notas' ? 'active' : ''}`} onClick={() => setActiveTab('notas')}>Notas del Alumno</button><button className={`tab-btn ${activeTab === 'asistencia' ? 'active' : ''}`} onClick={() => setActiveTab('asistencia')}>Asistencia</button><button className={`tab-btn ${activeTab === 'evaluaciones' ? 'active' : ''}`} onClick={() => setActiveTab('evaluaciones')}>Evaluaciones</button><button className={`tab-btn ${activeTab === 'mensajes' ? 'active' : ''}`} onClick={() => setActiveTab('mensajes')}>Mensajes</button><button className={`tab-btn ${activeTab === 'solicitudes' ? 'active' : ''}`} onClick={() => setActiveTab('solicitudes')}>Solicitudes</button></div>

        {activeTab === 'notas' && (
          <div className="role-card">
            <h3>Boletín de Notas - {selectedAlumno.nombre}</h3>
            {notasPorAsignatura.length > 0 ? (
              <div className="subject-grade-list">
                {notasPorAsignatura.map((grupo) => (
                  <div key={grupo.asignatura} className="subject-grade-card">
                    <button className="subject-grade-header" onClick={() => setAsignaturaAbierta(asignaturaAbierta === grupo.asignatura ? '' : grupo.asignatura)}>
                      <div>
                        <strong>{grupo.asignatura}</strong>
                        <span>{grupo.notas.length} {grupo.notas.length === 1 ? 'nota' : 'notas'}</span>
                      </div>
                      <div className="subject-grade-summary">
                        <span>Promedio: {grupo.promedio || '-'}</span>
                        <span>{asignaturaAbierta === grupo.asignatura ? 'Ocultar' : 'Ver notas'}</span>
                      </div>
                    </button>
                    {asignaturaAbierta === grupo.asignatura && (
                      <div className="table-responsive mt-3">
                        <table className="table table-bordered">
                          <thead className="table-dark"><tr><th>Nota</th><th>Descripción</th><th>Fecha</th></tr></thead>
                          <tbody>{grupo.notas.map((nota) => <tr key={nota.id}><td><strong className={Number(nota.nota) >= 5 ? 'text-success' : 'text-danger'}>{nota.nota}</strong></td><td>{nota.descripcion || '-'}</td><td>{nota.fecha ? new Date(nota.fecha).toLocaleDateString('es-CL') : '-'}</td></tr>)}</tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : <p className="text-muted">No hay notas registradas aún.</p>}
          </div>
        )}

        {activeTab === 'asistencia' && <div className="role-card"><h3>Registro de Asistencia</h3>{asistencia.length > 0 ? <div className="table-responsive"><table className="table table-bordered"><thead className="table-dark"><tr><th>Fecha</th><th>Estado</th><th>Curso</th><th>Profesor</th><th>Observación</th></tr></thead><tbody>{asistencia.map((a) => <tr key={a.id}><td>{formatoFecha(a.fecha)}</td><td className="text-capitalize">{a.estado}</td><td>{a.cursoNombre || '-'}</td><td>{a.profesorNombre || '-'}</td><td>{a.observacion || '-'}</td></tr>)}</tbody></table></div> : <p className="text-muted">No hay asistencia registrada aún.</p>}</div>}

        {activeTab === 'evaluaciones' && <div className="role-card"><h3>Próximas Evaluaciones</h3>{proximasEvaluaciones.length > 0 ? <div className="table-responsive"><table className="table table-bordered"><thead className="table-dark"><tr><th>Fecha</th><th>Asignatura</th><th>Título</th><th>Tipo</th><th>Descripción</th></tr></thead><tbody>{proximasEvaluaciones.map((ev) => <tr key={ev.id}><td>{formatoFecha(ev.fecha)}</td><td>{ev.asignatura}</td><td>{ev.titulo}</td><td>{ev.tipo || '-'}</td><td>{ev.descripcion || '-'}</td></tr>)}</tbody></table></div> : <p className="text-muted">No hay evaluaciones programadas.</p>}</div>}

        {activeTab === 'mensajes' && <div className="role-card"><h3>Bandeja de Mensajes</h3><p className="text-muted">No tienes mensajes nuevos.</p></div>}
        {activeTab === 'solicitudes' && (
          <div className="role-card">
            <h3>Solicitudes y Pagos</h3>
            <div className="payment-option-card">
              <div>
                <span className="payment-label">Pago arancel</span>
                <strong>$150.000</strong>
                <p>Alumno: {selectedAlumno.nombre}</p>
                <p>Curso: {selectedAlumno.cursoNombre || 'No asignado'}</p>
              </div>
              <button className="btn-base btn-secondary-custom" type="button" onClick={() => setPagoMensaje('El pago con Webpay será habilitado próximamente.')}>Pagar con Webpay</button>
            </div>
            {pagoMensaje && <div className="info-message mt-3">{pagoMensaje}</div>}
            <div className="mt-4">
              <h4>Solicitudes Realizadas</h4>
              {solicitudes.length > 0 ? solicitudes.map((s) => <p key={s.id}>{s.mensaje}</p>) : <p className="text-muted">No tienes solicitudes realizadas.</p>}
            </div>
          </div>
        )}
      </>}
    </div>
  );
}
