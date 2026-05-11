import React, { useState } from 'react';
import RoleLayout from './roles/RoleLayout.jsx';

export default function Profesor() {
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [activeTab, setActiveTab] = useState('cursos');

  const cursosAsignados = [
    { id: 1, nombre: 'Matemáticas 8° Básico', horario: 'Lun/Mié/Vie 08:00-09:30', alumnos: 32, sala: 'A-101' },
    { id: 2, nombre: 'Matemáticas 7° Básico', horario: 'Mar/Jue 10:00-11:30', alumnos: 30, sala: 'A-102' },
    { id: 3, nombre: 'Álgebra I° Medio', horario: 'Lun/Mié 14:00-15:30', alumnos: 28, sala: 'B-203' },
    { id: 4, nombre: 'Geometría II° Medio', horario: 'Mar/Vie 09:00-10:30', alumnos: 26, sala: 'B-204' },
    { id: 5, nombre: 'Precálculo III° Medio', horario: 'Jue 15:00-16:30', alumnos: 24, sala: 'C-305' },
    { id: 6, nombre: 'Cálculo IV° Medio', horario: 'Lun/Vie 11:00-12:30', alumnos: 22, sala: 'C-306' }
  ];

  const mensajes = [
    { id: 1, fecha: '2026-05-14', emisor: 'Coordinación', asunto: 'Reunión de departamento', leido: false, tipo: 'institucional' },
    { id: 2, fecha: '2026-05-13', emisor: 'Apoderado Pérez', asunto: 'Consulta sobre notas', leido: false, tipo: 'apoderado' },
    { id: 3, fecha: '2026-05-12', emisor: 'Dirección', asunto: 'Actualización de planificaciones', leido: true, tipo: 'institucional' },
    { id: 4, fecha: '2026-05-11', emisor: 'Apoderado González', asunto: 'Justificación inasistencia', leido: true, tipo: 'apoderado' }
  ];

  const anotaciones = [
    { id: 1, fecha: '2026-05-14', alumno: 'Matías Rojas', tipo: 'Positiva', descripcion: 'Excelente participación en clases', curso: '8° Básico' },
    { id: 2, fecha: '2026-05-13', alumno: 'Valentina López', tipo: 'Amonestación', descripcion: 'No trajo materiales', curso: '7° Básico' },
    { id: 3, fecha: '2026-05-12', alumno: 'Benjamín Torres', tipo: 'Positiva', descripcion: 'Mejoró su rendimiento', curso: 'I° Medio' },
    { id: 4, fecha: '2026-05-11', alumno: 'Camila Soto', tipo: 'Citación', descripcion: 'Conversar con apoderado', curso: 'II° Medio' }
  ];

  const clasesHoy = [
    { hora: '08:00 - 09:30', curso: 'Matemáticas 8° Básico', sala: 'A-101', asistencia: 28 },
    { hora: '10:00 - 11:30', curso: 'Matemáticas 7° Básico', sala: 'A-102', asistencia: 26 },
    { hora: '14:00 - 15:30', curso: 'Álgebra I° Medio', sala: 'B-203', asistencia: 25 }
  ];

  return (
    <RoleLayout
      title="Panel de profesor"
      subtitle="Vista del libro digital usuario profesor."
      summaryCards={[
        { label: 'Cursos asignados', value: '6', helper: 'Activos este semestre' },
        { label: 'Clases del día', value: '3', helper: 'Pendientes' },
        { label: 'Mensajes nuevos', value: '2', helper: 'Sin leer' },
        { label: 'Anotaciones', value: '8', helper: 'Esta semana' }
      ]}
    >
      <div className="clases-hoy-card">
        <h3>📅 Clases de hoy</h3>
        <div className="clases-list">
          {clasesHoy.map((clase, idx) => (
            <div key={idx} className="clase-item">
              <div className="clase-hora">{clase.hora}</div>
              <div className="clase-info">
                <span className="clase-curso">{clase.curso}</span>
                <span className="clase-sala">Sala: {clase.sala}</span>
              </div>
              <div className="clase-asistencia">
                <span>✅ {clase.asistencia}/{clase.asistencia + 4} presentes</span>
              </div>
              <button className="btn-small">Tomar asistencia</button>
            </div>
          ))}
        </div>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'cursos' ? 'active' : ''}`}
          onClick={() => setActiveTab('cursos')}
        >
          📚 Mis Cursos
        </button>
        <button 
          className={`tab-btn ${activeTab === 'notas' ? 'active' : ''}`}
          onClick={() => setActiveTab('notas')}
        >
          ✏️ Libro de Notas
        </button>
        <button 
          className={`tab-btn ${activeTab === 'asistencia' ? 'active' : ''}`}
          onClick={() => setActiveTab('asistencia')}
        >
          📋 Registrar Asistencia
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'cursos' && (
          <div className="role-card">
            <h3>📚 Cursos asignados - {new Date().getFullYear()}</h3>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Curso</th>
                    <th>Horario</th>
                    <th>N° Alumnos</th>
                    <th>Sala</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cursosAsignados.map((curso, idx) => (
                    <tr key={curso.id}>
                      <td>{idx + 1}</td>
                      <td><strong>{curso.nombre}</strong></td>
                      <td>{curso.horario}</td>
                      <td>{curso.alumnos}</td>
                      <td>{curso.sala}</td>
                      <td>
                        <button className="btn-small" style={{ marginRight: '0.5rem' }}>Notas</button>
                        <button className="btn-small">Asistencia</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'notas' && (
          <div className="role-card">
            <h3>✏️ Registrar notas</h3>
            <div className="alert-info">
              <span>📌</span>
              <p>Selecciona un curso para comenzar a registrar notas</p>
            </div>
            <div className="row">
              {cursosAsignados.slice(0, 4).map((curso) => (
                <div key={curso.id} className="col-md-6 mb-3">
                  <div className="curso-nota-card" style={{ padding: '1rem', border: '1px solid #e9ecef', borderRadius: '12px', cursor: 'pointer' }}>
                    <h4>{curso.nombre}</h4>
                    <p>📊 {curso.alumnos} alumnos | 📅 Última evaluación: 10/05</p>
                    <button className="btn-small">Ingresar notas →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'asistencia' && (
          <div className="role-card">
            <h3>📋 Registrar asistencia</h3>
            <div className="alert-info">
              <span>📌</span>
              <p>Clases programadas para hoy</p>
            </div>
            {clasesHoy.map((clase, idx) => (
              <div key={idx} className="asistencia-clase-card" style={{ padding: '1rem', border: '1px solid #e9ecef', borderRadius: '12px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h4>{clase.curso}</h4>
                    <p>{clase.hora} - Sala {clase.sala}</p>
                  </div>
                  <div>
                    <span style={{ marginRight: '1rem' }}>✅ Presentes: {clase.asistencia}</span>
                    <span>❌ Ausentes: 4</span>
                  </div>
                  <button className="btn-primary-small" style={{ width: 'auto' }}>Registrar asistencia</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="row g-4 mt-4">
        <div className="col-lg-6">
          <div className="role-card">
            <h3>📬 Mensajes recientes</h3>
            <div className="mensajes-list">
              {mensajes.map((mensaje, idx) => (
                <div key={idx} className={`mensaje-item ${!mensaje.leido ? 'no-leido' : ''}`}>
                  <div className="mensaje-header">
                    <span className="mensaje-emisor">
                      {mensaje.tipo === 'apoderado' ? '👨‍👩‍👧 ' : '🏫 '}
                      {mensaje.emisor}
                    </span>
                    <span className="mensaje-fecha">{mensaje.fecha}</span>
                  </div>
                  <p className="mensaje-asunto">{mensaje.asunto}</p>
                  {!mensaje.leido && <span className="nuevo-badge">Nuevo</span>}
                </div>
              ))}
            </div>
            <button className="btn-link">Ver todos los mensajes →</button>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="role-card">
            <h3>📝 Anotaciones recientes</h3>
            <div className="solicitudes-list">
              {anotaciones.map((anotacion, idx) => (
                <div key={idx} className="solicitud-item">
                  <div className="solicitud-header">
                    <span className="solicitud-tipo">
                      {anotacion.tipo === 'Positiva' ? '🌟 ' : anotacion.tipo === 'Amonestación' ? '⚠️ ' : '📞 '}
                      {anotacion.tipo}
                    </span>
                    <span className={`solicitud-estado ${anotacion.tipo === 'Positiva' ? 'aprobada' : anotacion.tipo === 'Amonestación' ? 'en-revision' : ''}`}>
                      {anotacion.curso}
                    </span>
                  </div>
                  <p><strong>{anotacion.alumno}</strong></p>
                  <p className="solicitud-detalle">{anotacion.descripcion}</p>
                  <div className="solicitud-footer">
                    <span className="solicitud-fecha">📅 {anotacion.fecha}</span>
                    <button className="btn-small">Ver detalles</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-primary-small">➕ Nueva anotación</button>
          </div>
        </div>
      </div>

      <style>{`
        .clases-hoy-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          color: white;
        }
        
        .clases-hoy-card h3 {
          margin: 0 0 1rem 0;
          color: white;
        }
        
        .clases-list {
          display: grid;
          gap: 1rem;
        }
        
        .clase-item {
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .clase-hora {
          font-weight: 600;
          min-width: 100px;
        }
        
        .clase-info {
          flex: 1;
        }
        
        .clase-curso {
          display: block;
          font-weight: 600;
        }
        
        .clase-sala {
          font-size: 0.85rem;
          opacity: 0.9;
        }
        
        .clase-asistencia {
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .clase-item {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </RoleLayout>
  );
}