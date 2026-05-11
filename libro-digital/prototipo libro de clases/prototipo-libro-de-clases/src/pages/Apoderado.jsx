import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function Apoderado() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('notas');
  const [alumnos, setAlumnos] = useState([]);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [notas, setNotas] = useState([]);
  const [asistencia, setAsistencia] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promedioGeneral, setPromedioGeneral] = useState(0);
  const [porcentajeAsistencia, setPorcentajeAsistencia] = useState(0);

  useEffect(() => {
    if (user && token) {
      cargarDatosApoderado();
    }
  }, [user, token]);

  const cargarDatosApoderado = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const alumnosRes = await axios.get(`${API_URL}/apoderado/${user.id}/alumnos`, config);
      const mensajesRes = await axios.get(`${API_URL}/messages/apoderado/${user.id}`, config);
      const solicitudesRes = await axios.get(`${API_URL}/solicitudes/apoderado/${user.id}`, config);
      
      setAlumnos(alumnosRes.data);
      setMensajes(mensajesRes.data);
      setSolicitudes(solicitudesRes.data);
      
      if (alumnosRes.data.length > 0) {
        setSelectedAlumno(alumnosRes.data[0]);
        cargarDatosAlumno(alumnosRes.data[0].id);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarDatosAlumno = async (alumnoId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const notasRes = await axios.get(`${API_URL}/grades/alumno/${alumnoId}`, config);
      const asistenciaRes = await axios.get(`${API_URL}/attendance/alumno/${alumnoId}`, config);
      
      setNotas(notasRes.data);
      setAsistencia(asistenciaRes.data);
      
      if (notasRes.data.length > 0) {
        const suma = notasRes.data.reduce((acc, n) => acc + Number(n.nota), 0);
        setPromedioGeneral((suma / notasRes.data.length).toFixed(1));
      } else {
        setPromedioGeneral(0);
      }
      
      if (asistenciaRes.data.length > 0) {
        const presentes = asistenciaRes.data.filter(a => a.presente).length;
        setPorcentajeAsistencia(((presentes / asistenciaRes.data.length) * 100).toFixed(1));
      } else {
        setPorcentajeAsistencia(0);
      }
    } catch (error) {
      console.error('Error al cargar datos del alumno:', error);
    }
  };

  const handleAlumnoChange = (alumnoId) => {
    const alumno = alumnos.find(a => a.id === alumnoId);
    setSelectedAlumno(alumno);
    cargarDatosAlumno(alumnoId);
  };

  if (loading) {
    return (
      <div className="role-page">
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando tu información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="role-page">
      <div className="role-hero">
        <span className="hero-badge">Colegio Bernardo O'Higgins</span>
        <h1>Panel de Apoderado</h1>
        <p>Bienvenido, {user?.nombre}</p>
        <small className="text-light opacity-75">
          {alumnos.length} {alumnos.length === 1 ? 'hijo' : 'hijos'} registrados
        </small>
      </div>

      {alumnos.length > 1 && (
        <div className="mb-4">
          <label className="form-label fw-bold">Seleccionar Hijo</label>
          <select 
            className="form-control" 
            style={{ maxWidth: '300px' }}
            onChange={(e) => handleAlumnoChange(parseInt(e.target.value))}
            value={selectedAlumno?.id || ''}
          >
            {alumnos.map(alumno => (
              <option key={alumno.id} value={alumno.id}>
                {alumno.nombre} - {alumno.curso_nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedAlumno && (
        <>
          <div className="student-info-card">
            <div className="student-avatar">
              <span style={{ fontSize: '3rem' }}>👨‍🎓</span>
            </div>
            <div className="student-details">
              <h3>{selectedAlumno.nombre}</h3>
              <p className="student-course">Curso: {selectedAlumno.curso_nombre || 'No asignado'}</p>
              <div className="student-badges">
                <span className="badge">📚 Matrícula {new Date().getFullYear()}</span>
                <span className="badge">✅ Alumno regular</span>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="role-stat-card">
                <span>Promedio del Alumno</span>
                <strong>{promedioGeneral || '-'}</strong>
                <small>{notas.length} evaluaciones</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="role-stat-card">
                <span>Asistencia</span>
                <strong>{porcentajeAsistencia}%</strong>
                <small>Asistencia acumulada</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="role-stat-card">
                <span>Mensajes</span>
                <strong>{mensajes.filter(m => !m.leido).length}</strong>
                <small>No leídos</small>
              </div>
            </div>
          </div>

          <div className="tabs-container">
            <button className={`tab-btn ${activeTab === 'notas' ? 'active' : ''}`} onClick={() => setActiveTab('notas')}>
              Notas del Alumno
            </button>
            <button className={`tab-btn ${activeTab === 'asistencia' ? 'active' : ''}`} onClick={() => setActiveTab('asistencia')}>
              Asistencia
            </button>
            <button className={`tab-btn ${activeTab === 'mensajes' ? 'active' : ''}`} onClick={() => setActiveTab('mensajes')}>
              Mensajes
            </button>
            <button className={`tab-btn ${activeTab === 'solicitudes' ? 'active' : ''}`} onClick={() => setActiveTab('solicitudes')}>
              Solicitudes
            </button>
          </div>

          {activeTab === 'notas' && (
            <div className="role-card">
              <h3>Boletín de Notas - {selectedAlumno.nombre}</h3>
              {notas.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-dark">
                      <tr>
                        <th>Asignatura</th>
                        <th>Nota</th>
                        <th>Tipo</th>
                        <th>Fecha</th>
                        <th>Periodo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notas.map((nota) => (
                        <tr key={nota.id}>
                          <td>{nota.asignatura}</td>
                          <td>
                            <strong className={nota.nota >= 5 ? 'text-success' : 'text-danger'}>
                              {nota.nota}
                            </strong>
                          </td>
                          <td>{nota.tipo}</td>
                          <td>{new Date(nota.fecha).toLocaleDateString('es-CL')}</td>
                          <td>{nota.periodo}° Periodo</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No hay notas registradas aún.</p>
              )}
            </div>
          )}

          {activeTab === 'asistencia' && (
            <div className="role-card">
              <h3>Registro de Asistencia - {selectedAlumno.nombre}</h3>
              <div className="mb-4">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${porcentajeAsistencia}%` }}>
                    {porcentajeAsistencia}% Asistencia
                  </div>
                </div>
              </div>
              {asistencia.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-dark">
                      <tr>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Justificación</th>
                        <th>Profesor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asistencia.map((reg) => (
                        <tr key={reg.id}>
                          <td>{new Date(reg.fecha).toLocaleDateString('es-CL')}</td>
                          <td>
                            {reg.presente ? (
                              <span className="badge bg-success">Presente</span>
                            ) : (
                              <span className="badge bg-danger">Ausente</span>
                            )}
                          </td>
                          <td>{reg.justificacion || '-'}</td>
                          <td>{reg.profesor_nombre || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No hay registros de asistencia.</p>
              )}
            </div>
          )}

          {activeTab === 'mensajes' && (
            <div className="role-card">
              <h3>Bandeja de Mensajes</h3>
              {mensajes.length > 0 ? (
                <div className="mensajes-list">
                  {mensajes.map((mensaje) => (
                    <div key={mensaje.id} className={`mensaje-item ${!mensaje.leido ? 'no-leido' : ''}`}>
                      <div className="mensaje-header">
                        <span className="mensaje-emisor">De: {mensaje.emisor_nombre}</span>
                        <span className="mensaje-fecha">
                          {new Date(mensaje.created_at).toLocaleDateString('es-CL')}
                        </span>
                      </div>
                      <h4 className="mensaje-asunto">{mensaje.asunto}</h4>
                      <p className="mensaje-texto">{mensaje.mensaje}</p>
                      {!mensaje.leido && <span className="nuevo-badge">Nuevo</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No tienes mensajes.</p>
              )}
            </div>
          )}

          {activeTab === 'solicitudes' && (
            <div className="role-card">
              <h3>Solicitudes Realizadas</h3>
              <div className="mb-4">
                <button className="btn-primary-small">
                  + Nueva Solicitud
                </button>
              </div>
              {solicitudes.length > 0 ? (
                <div className="solicitudes-list">
                  {solicitudes.map((solicitud) => (
                    <div key={solicitud.id} className="solicitud-item">
                      <div className="solicitud-header">
                        <span className="solicitud-tipo">
                          {solicitud.tipo === 'reunion' ? '📞 Solicitud de Reunión' : 
                           solicitud.tipo === 'justificacion' ? '📄 Justificación' : 
                           '📋 Otra Solicitud'}
                        </span>
                        <span className={`solicitud-estado ${solicitud.estado === 'pendiente' ? 'en-revision' : 
                          solicitud.estado === 'aprobada' ? 'aprobada' : 'completada'}`}>
                          {solicitud.estado === 'pendiente' ? 'En revisión' :
                           solicitud.estado === 'aprobada' ? 'Aprobada' : 'Completada'}
                        </span>
                      </div>
                      <p className="solicitud-detalle">{solicitud.mensaje}</p>
                      <div className="solicitud-footer">
                        <span className="solicitud-fecha">
                          📅 {new Date(solicitud.created_at).toLocaleDateString('es-CL')}
                        </span>
                        {solicitud.respuesta && (
                          <span className="solicitud-respuesta">Respuesta: {solicitud.respuesta}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No tienes solicitudes realizadas.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}