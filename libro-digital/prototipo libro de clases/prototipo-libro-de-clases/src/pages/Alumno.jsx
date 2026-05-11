import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function Alumno() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('notas');
  const [notas, setNotas] = useState([]);
  const [asistencia, setAsistencia] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [promedioGeneral, setPromedioGeneral] = useState(0);
  const [porcentajeAsistencia, setPorcentajeAsistencia] = useState(0);
  const [loading, setLoading] = useState(true);
  const [evaluacionesProximas, setEvaluacionesProximas] = useState([]);

  useEffect(() => {
    if (user && token) {
      cargarDatosAlumno();
    }
  }, [user, token]);

  const cargarDatosAlumno = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [notasRes, asistenciaRes, mensajesRes, evaluacionesRes] = await Promise.all([
        axios.get(`${API_URL}/grades/alumno/${user.id}`, config),
        axios.get(`${API_URL}/attendance/alumno/${user.id}`, config),
        axios.get(`${API_URL}/messages/alumno/${user.id}`, config),
        axios.get(`${API_URL}/grades/proximas-evaluaciones/${user.id}`, config)
      ]);

      setNotas(notasRes.data);
      setAsistencia(asistenciaRes.data);
      setMensajes(mensajesRes.data);
      setEvaluacionesProximas(evaluacionesRes.data);

      if (notasRes.data.length > 0) {
        const suma = notasRes.data.reduce((acc, n) => acc + Number(n.nota), 0);
        setPromedioGeneral((suma / notasRes.data.length).toFixed(1));
      }

      if (asistenciaRes.data.length > 0) {
        const presentes = asistenciaRes.data.filter(a => a.presente).length;
        setPorcentajeAsistencia(((presentes / asistenciaRes.data.length) * 100).toFixed(1));
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const marcarMensajeLeido = async (mensajeId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.put(`${API_URL}/messages/${mensajeId}/leer`, {}, config);
      setMensajes(mensajes.map(m => 
        m.id === mensajeId ? { ...m, leido: true } : m
      ));
    } catch (error) {
      console.error('Error al marcar mensaje:', error);
    }
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
        <h1>Panel de Alumno</h1>
        <p>Bienvenido, {user.nombre}</p>
        <small className="text-light opacity-75">Curso: {user.curso_nombre || 'No asignado'}</small>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="role-stat-card">
            <span>Promedio General</span>
            <strong>{promedioGeneral || '-'}</strong>
            <small>{notas.length} evaluaciones</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="role-stat-card">
            <span>Asistencia</span>
            <strong>{porcentajeAsistencia}%</strong>
            <small>Asistencia acumulada</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="role-stat-card">
            <span>Mensajes</span>
            <strong>{mensajes.filter(m => !m.leido).length}</strong>
            <small>No leídos</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="role-stat-card">
            <span>Próxima Evaluación</span>
            <strong>{evaluacionesProximas[0]?.fecha || 'Sin fecha'}</strong>
            <small>{evaluacionesProximas[0]?.asignatura || '---'}</small>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'notas' ? 'active' : ''}`}
          onClick={() => setActiveTab('notas')}
        >
          Mis Notas
        </button>
        <button 
          className={`tab-btn ${activeTab === 'asistencia' ? 'active' : ''}`}
          onClick={() => setActiveTab('asistencia')}
        >
          Mi Asistencia
        </button>
        <button 
          className={`tab-btn ${activeTab === 'mensajes' ? 'active' : ''}`}
          onClick={() => setActiveTab('mensajes')}
        >
          Mis Mensajes
        </button>
        <button 
          className={`tab-btn ${activeTab === 'evaluaciones' ? 'active' : ''}`}
          onClick={() => setActiveTab('evaluaciones')}
        >
          Próximas Evaluaciones
        </button>
      </div>

      {activeTab === 'notas' && (
        <div className="role-card">
          <h3>Historial de Notas</h3>
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
          <h3>Registro de Asistencia</h3>
          <div className="mb-4">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${porcentajeAsistencia}%` }}
              >
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
                    <th>Registrado por</th>
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
                <div 
                  key={mensaje.id} 
                  className={`mensaje-item ${!mensaje.leido ? 'no-leido' : ''}`}
                  onClick={() => !mensaje.leido && marcarMensajeLeido(mensaje.id)}
                >
                  <div className="mensaje-header">
                    <span className="mensaje-emisor">{mensaje.emisor_nombre}</span>
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

      {activeTab === 'evaluaciones' && (
        <div className="role-card">
          <h3>Próximas Evaluaciones</h3>
          {evaluacionesProximas.length > 0 ? (
            <div className="row g-4">
              {evaluacionesProximas.map((evalucion) => (
                <div key={evalucion.id} className="col-md-4">
                  <div className="evaluacion-card">
                    <div className="evaluacion-fecha">
                      <span className="dia">{new Date(evalucion.fecha).getDate()}</span>
                      <span className="mes">
                        {new Date(evalucion.fecha).toLocaleString('es', { month: 'short' })}
                      </span>
                    </div>
                    <div className="evaluacion-info">
                      <h4>{evalucion.asignatura}</h4>
                      <p>{evalucion.contenido}</p>
                      <small className="text-muted">Tipo: {evalucion.tipo}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No hay evaluaciones próximas.</p>
          )}
        </div>
      )}

      <style>{`
        .role-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          color: white;
          border-radius: 24px;
          padding: 2rem;
          margin-bottom: 1.5rem;
        }
        .role-hero h1 {
          margin: 0.5rem 0;
          font-size: 1.8rem;
        }
        .role-stat-card {
          background: white;
          border-radius: 16px;
          padding: 1.25rem;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          border: 1px solid #e5e7eb;
        }
        .role-stat-card span {
          display: block;
          color: #6c757d;
          font-size: 0.85rem;
        }
        .role-stat-card strong {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #0b2b40;
        }
        .role-stat-card small {
          font-size: 0.75rem;
          color: #adb5bd;
        }
        .tabs-container {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid #e5e7eb;
          flex-wrap: wrap;
        }
        .tab-btn {
          background: none;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          color: #6c757d;
          transition: all 0.2s;
          border-radius: 8px 8px 0 0;
        }
        .tab-btn.active {
          color: #ffc107;
          font-weight: 600;
          border-bottom: 2px solid #ffc107;
          margin-bottom: -2px;
        }
        .tab-btn:hover {
          background: #f8f9fa;
        }
        .role-card {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          border: 1px solid #e5e7eb;
        }
        .progress-bar {
          background: #e5e7eb;
          border-radius: 10px;
          height: 30px;
          overflow: hidden;
        }
        .progress-fill {
          background: #10b981;
          height: 100%;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .mensajes-list {
          max-height: 500px;
          overflow-y: auto;
        }
        .mensaje-item {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          cursor: pointer;
          transition: background 0.2s;
          position: relative;
        }
        .mensaje-item:hover {
          background: #f8f9fa;
        }
        .mensaje-item.no-leido {
          background: #f0f9ff;
        }
        .mensaje-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .mensaje-emisor {
          font-weight: 600;
          color: #0b2b40;
        }
        .mensaje-fecha {
          font-size: 0.75rem;
          color: #6c757d;
        }
        .mensaje-asunto {
          font-size: 1rem;
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }
        .mensaje-texto {
          color: #6c757d;
          margin: 0;
          font-size: 0.9rem;
        }
        .nuevo-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #dc2626;
          color: white;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
        }
        .evaluacion-card {
          background: #f8f9fa;
          border-radius: 16px;
          padding: 1rem;
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .evaluacion-fecha {
          text-align: center;
          min-width: 60px;
        }
        .evaluacion-fecha .dia {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffc107;
        }
        .evaluacion-fecha .mes {
          font-size: 0.7rem;
          color: #6c757d;
        }
        .evaluacion-info {
          flex: 1;
        }
        .evaluacion-info h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
        }
        .badge {
          padding: 0.25rem 0.5rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
        }
        .badge.bg-success {
          background: #d1fae5;
          color: #065f46;
        }
        .badge.bg-danger {
          background: #fee2e2;
          color: #dc2626;
        }
        .text-success {
          color: #10b981;
        }
        .text-danger {
          color: #dc2626;
        }
        @media (max-width: 768px) {
          .role-hero {
            padding: 1.5rem;
          }
          .role-stat-card strong {
            font-size: 1.5rem;
          }
          .tab-btn {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}