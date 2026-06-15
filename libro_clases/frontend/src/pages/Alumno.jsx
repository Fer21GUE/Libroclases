import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getAlumnoDashboard, marcarMensajeLeido } from '../api/bffApi.js';
import { agruparNotasPorAsignatura, calcularPromedioGeneralAsignaturas } from '../utils/gradeHelpers.js';

export default function Alumno() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('notas');
  const [notas, setNotas] = useState([]);
  const [asistencia, setAsistencia] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [proximasEvaluaciones, setProximasEvaluaciones] = useState([]);
  const [porcentajeAsistencia, setPorcentajeAsistencia] = useState(0);
  const [perfil, setPerfil] = useState(null);
  const [asignaturaAbierta, setAsignaturaAbierta] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) cargarDatosAlumno();
  }, [user]);

  const cargarDatosAlumno = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAlumnoDashboard(user.id);
      setPerfil(data.alumno);
      setNotas(data.notas || []);
      setAsistencia(data.asistencia || []);
      setMensajes(data.mensajes || []);
      setProximasEvaluaciones(data.proximasEvaluaciones || []);
      setPorcentajeAsistencia(data.porcentajeAsistencia || 0);
    } catch (e) {
      setError(e.message || 'Error al cargar el panel del alumno.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarLeido = async (mensajeId) => {
    try {
      await marcarMensajeLeido(mensajeId);
      setMensajes(mensajes.map((m) => (m.id === mensajeId ? { ...m, leido: true } : m)));
    } catch (e) {
      console.error('Error al marcar mensaje:', e);
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
        <h1>Panel de Alumno</h1>
        <p>Bienvenido, {user?.nombre}</p>
        <small className="text-light opacity-75">Curso: {perfil?.cursoNombre || 'No asignado'}</small>
      </div>

      {error && <div className="form-error mb-3">{error}</div>}

      <div className="row g-4 mb-4">
        <div className="col-md-3"><div className="role-stat-card"><span>Promedio General</span><strong>{promedioGeneral || '-'}</strong><small>{notasPorAsignatura.length} asignaturas</small></div></div>
        <div className="col-md-3"><div className="role-stat-card"><span>Asistencia</span><strong>{porcentajeAsistencia}%</strong><small>{asistencia.length} registros</small></div></div>
        <div className="col-md-3"><div className="role-stat-card"><span>Mensajes</span><strong>{mensajes.filter((m) => !m.leido).length}</strong><small>No leídos</small></div></div>
        <div className="col-md-3"><div className="role-stat-card"><span>Evaluaciones</span><strong>{proximasEvaluaciones.length}</strong><small>Próximas</small></div></div>
      </div>

      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'notas' ? 'active' : ''}`} onClick={() => setActiveTab('notas')}>Mis Notas</button>
        <button className={`tab-btn ${activeTab === 'asistencia' ? 'active' : ''}`} onClick={() => setActiveTab('asistencia')}>Asistencia</button>
        <button className={`tab-btn ${activeTab === 'mensajes' ? 'active' : ''}`} onClick={() => setActiveTab('mensajes')}>Mensajes</button>
        <button className={`tab-btn ${activeTab === 'evaluaciones' ? 'active' : ''}`} onClick={() => setActiveTab('evaluaciones')}>Evaluaciones</button>
      </div>

      {activeTab === 'notas' && (
        <div className="role-card">
          <h3>Mis Notas</h3>
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

      {activeTab === 'asistencia' && <div className="role-card"><h3>Mi Asistencia</h3>{asistencia.length > 0 ? <div className="table-responsive"><table className="table table-bordered"><thead className="table-dark"><tr><th>Fecha</th><th>Estado</th><th>Curso</th><th>Profesor</th><th>Observación</th></tr></thead><tbody>{asistencia.map((a) => <tr key={a.id}><td>{formatoFecha(a.fecha)}</td><td className="text-capitalize">{a.estado}</td><td>{a.cursoNombre || '-'}</td><td>{a.profesorNombre || '-'}</td><td>{a.observacion || '-'}</td></tr>)}</tbody></table></div> : <p className="text-muted">No hay asistencia registrada aún.</p>}</div>}

      {activeTab === 'mensajes' && <div className="role-card"><h3>Mensajes</h3>{mensajes.length > 0 ? <div className="mensajes-list">{mensajes.map((mensaje) => <div key={mensaje.id} className={`mensaje-item ${!mensaje.leido ? 'no-leido' : ''}`}><div className="mensaje-header"><span>De: {mensaje.emisorNombre}</span><span>{mensaje.createdAt ? new Date(mensaje.createdAt).toLocaleDateString('es-CL') : '-'}</span></div><h4>{mensaje.asunto}</h4><p>{mensaje.mensaje}</p>{!mensaje.leido && <button className="btn-small" onClick={() => handleMarcarLeido(mensaje.id)}>Marcar como leído</button>}</div>)}</div> : <p className="text-muted">No tienes mensajes.</p>}</div>}

      {activeTab === 'evaluaciones' && <div className="role-card"><h3>Próximas Evaluaciones</h3>{proximasEvaluaciones.length > 0 ? <div className="table-responsive"><table className="table table-bordered"><thead className="table-dark"><tr><th>Fecha</th><th>Asignatura</th><th>Título</th><th>Tipo</th><th>Descripción</th></tr></thead><tbody>{proximasEvaluaciones.map((ev) => <tr key={ev.id}><td>{formatoFecha(ev.fecha)}</td><td>{ev.asignatura}</td><td>{ev.titulo}</td><td>{ev.tipo || '-'}</td><td>{ev.descripcion || '-'}</td></tr>)}</tbody></table></div> : <p className="text-muted">No hay evaluaciones programadas.</p>}</div>}
    </div>
  );
}
