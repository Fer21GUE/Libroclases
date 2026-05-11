import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function Profesor() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('cursos');
  const [cursos, setCursos] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [anotaciones, setAnotaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [alumnosCurso, setAlumnosCurso] = useState([]);
  const [notasForm, setNotasForm] = useState({});
  const [asistenciaForm, setAsistenciaForm] = useState({});
  const [fechaAsistencia, setFechaAsistencia] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (user && token) {
      cargarDatosProfesor();
    }
  }, [user, token]);

  const cargarDatosProfesor = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [cursosRes, mensajesRes, anotacionesRes] = await Promise.all([
        axios.get(`${API_URL}/courses/profesor/${user.id}`, config),
        axios.get(`${API_URL}/messages/profesor/${user.id}`, config),
        axios.get(`${API_URL}/anotaciones/profesor/${user.id}`, config)
      ]);
      
      setCursos(cursosRes.data);
      setMensajes(mensajesRes.data);
      setAnotaciones(anotacionesRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarAlumnosPorCurso = async (cursoId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API_URL}/courses/${cursoId}/alumnos`, config);
      setAlumnosCurso(res.data);
      setSelectedCurso(cursoId);
    } catch (error) {
      console.error('Error al cargar alumnos:', error);
    }
  };

  const handleNotaChange = (alumnoId, value) => {
    setNotasForm({ ...notasForm, [alumnoId]: value });
  };

  const guardarNotas = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const promesas = Object.entries(notasForm).map(([alumnoId, nota]) =>
        axios.post(`${API_URL}/grades`, {
          alumnoId: parseInt(alumnoId),
          cursoId: selectedCurso,
          nota: parseFloat(nota),
          fecha: new Date().toISOString().split('T')[0],
          profesorId: user.id
        }, config)
      );
      await Promise.all(promesas);
      alert('Notas guardadas correctamente');
      setNotasForm({});
    } catch (error) {
      console.error('Error al guardar notas:', error);
      alert('Error al guardar notas');
    }
  };

  const handleAsistenciaChange = (alumnoId, presente) => {
    setAsistenciaForm({ ...asistenciaForm, [alumnoId]: presente });
  };

  const guardarAsistencia = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const promesas = Object.entries(asistenciaForm).map(([alumnoId, presente]) =>
        axios.post(`${API_URL}/attendance`, {
          alumnoId: parseInt(alumnoId),
          fecha: fechaAsistencia,
          presente: presente,
          profesorId: user.id
        }, config)
      );
      await Promise.all(promesas);
      alert('Asistencia guardada correctamente');
      setAsistenciaForm({});
    } catch (error) {
      console.error('Error al guardar asistencia:', error);
      alert('Error al guardar asistencia');
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

  const clasesHoy = cursos.filter(curso => {
    const hoy = new Date().getDay();
    const diasMap = { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes' };
    return curso.dia_semana === diasMap[hoy];
  });

  return (
    <div className="role-page">
      <div className="role-hero">
        <span className="hero-badge">Colegio Bernardo O'Higgins</span>
        <h1>Panel de Profesor</h1>
        <p>Bienvenido, {user.nombre}</p>
        <small className="text-light opacity-75">
          {cursos.length} cursos asignados | {clasesHoy.length} clases hoy
        </small>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="role-stat-card">
            <span>Cursos Asignados</span>
            <strong>{cursos.length}</strong>
            <small>Activos este semestre</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="role-stat-card">
            <span>Clases del Día</span>
            <strong>{clasesHoy.length}</strong>
            <small>Pendientes</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="role-stat-card">
            <span>Mensajes Nuevos</span>
            <strong>{mensajes.filter(m => !m.leido).length}</strong>
            <small>Sin revisar</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="role-stat-card">
            <span>Anotaciones</span>
            <strong>{anotaciones.length}</strong>
            <small>Esta semana</small>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'cursos' ? 'active' : ''}`} onClick={() => setActiveTab('cursos')}>
          Mis Cursos
        </button>
        <button className={`tab-btn ${activeTab === 'notas' ? 'active' : ''}`} onClick={() => setActiveTab('notas')}>
          Ingresar Notas
        </button>
        <button className={`tab-btn ${activeTab === 'asistencia' ? 'active' : ''}`} onClick={() => setActiveTab('asistencia')}>
          Tomar Asistencia
        </button>
        <button className={`tab-btn ${activeTab === 'mensajes' ? 'active' : ''}`} onClick={() => setActiveTab('mensajes')}>
          Mensajes
        </button>
      </div>

      {activeTab === 'cursos' && (
        <div className="role-card">
          <h3>Mis Cursos</h3>
          <div className="row g-4">
            {cursos.map((curso) => (
              <div key={curso.id} className="col-md-6 col-lg-4">
                <div className="curso-card" onClick={() => cargarAlumnosPorCurso(curso.id)}>
                  <div className="curso-header">
                    <span className="curso-nivel">{curso.nivel} {curso.letra}</span>
                    <span className="curso-anio">{curso.anio}</span>
                  </div>
                  <div className="curso-body">
                    <p><strong>Horario:</strong> {curso.dia_semana} {curso.horario}</p>
                    <p><strong>Sala:</strong> {curso.sala}</p>
                    <p><strong>Alumnos:</strong> {curso.total_alumnos || 0}</p>
                  </div>
                  <div className="curso-footer">
                    <button className="btn-small" onClick={(e) => { e.stopPropagation(); setActiveTab('notas'); setSelectedCurso(curso.id); }}>Ingresar Notas</button>
                    <button className="btn-small" onClick={(e) => { e.stopPropagation(); setActiveTab('asistencia'); setSelectedCurso(curso.id); }}>Tomar Asistencia</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'notas' && selectedCurso && (
        <div className="role-card">
          <h3>Ingresar Notas - {cursos.find(c => c.id === selectedCurso)?.nombre}</h3>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Alumno</th>
                  <th>RUT</th>
                  <th>Nota</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {alumnosCurso.map((alumno) => (
                  <tr key={alumno.id}>
                    <td>{alumno.nombre}</td>
                    <td>{alumno.rut || '-'}</td>
                    <td>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="7"
                        className="form-control"
                        style={{ width: '100px' }}
                        value={notasForm[alumno.id] || ''}
                        onChange={(e) => handleNotaChange(alumno.id, e.target.value)}
                      />
                    </td>
                    <td>
                      <button className="btn-small" onClick={() => guardarNotas(alumno.id)}>Guardar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn-primary-small mt-3" onClick={guardarNotas}>Guardar Todas las Notas</button>
        </div>
      )}

      {activeTab === 'asistencia' && selectedCurso && (
        <div className="role-card">
          <h3>Tomar Asistencia - {cursos.find(c => c.id === selectedCurso)?.nombre}</h3>
          <div className="mb-3">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              className="form-control"
              style={{ width: '200px' }}
              value={fechaAsistencia}
              onChange={(e) => setFechaAsistencia(e.target.value)}
            />
          </div>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Alumno</th>
                  <th>RUT</th>
                  <th>Presente</th>
                  <th>Ausente</th>
                </tr>
              </thead>
              <tbody>
                {alumnosCurso.map((alumno) => (
                  <tr key={alumno.id}>
                    <td>{alumno.nombre}</td>
                    <td>{alumno.rut || '-'}</td>
                    <td>
                      <input
                        type="radio"
                        name={`asistencia-${alumno.id}`}
                        checked={asistenciaForm[alumno.id] === true}
                        onChange={() => handleAsistenciaChange(alumno.id, true)}
                      />
                    </td>
                    <td>
                      <input
                        type="radio"
                        name={`asistencia-${alumno.id}`}
                        checked={asistenciaForm[alumno.id] === false}
                        onChange={() => handleAsistenciaChange(alumno.id, false)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn-primary-small mt-3" onClick={guardarAsistencia}>Guardar Asistencia</button>
        </div>
      )}

      {activeTab === 'mensajes' && (
        <div className="role-card">
          <h3>Mensajes Recibidos</h3>
          {mensajes.length > 0 ? (
            <div className="mensajes-list">
              {mensajes.map((mensaje) => (
                <div key={mensaje.id} className={`mensaje-item ${!mensaje.leido ? 'no-leido' : ''}`}>
                  <div className="mensaje-header">
                    <span className="mensaje-emisor">De: {mensaje.emisor_nombre}</span>
                    <span className="mensaje-fecha">{new Date(mensaje.created_at).toLocaleDateString('es-CL')}</span>
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
        .role-card {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          border: 1px solid #e5e7eb;
        }
        .curso-card {
          background: #f8f9fa;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .curso-card:hover {
          transform: translateY(-4px);
        }
        .curso-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
        }
        .curso-nivel {
          font-weight: 700;
          font-size: 1.1rem;
        }
        .curso-body {
          padding: 1rem;
        }
        .curso-footer {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 0.5rem;
        }
        .btn-small {
          background: white;
          border: 1px solid #667eea;
          color: #667eea;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.8rem;
        }
        .btn-small:hover {
          background: #667eea;
          color: white;
        }
        .btn-primary-small {
          background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
          color: #0b2b40;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        .form-control {
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }
        .mensajes-list {
          max-height: 500px;
          overflow-y: auto;
        }
        .mensaje-item {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          position: relative;
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
        }
        @media (max-width: 768px) {
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