import React, { useState } from 'react';
import RoleLayout from './roles/RoleLayout.jsx';

export default function Apoderado() {
  const [activeTab, setActiveTab] = useState('notas');
  
  const notas = [
    { asignatura: 'Matemáticas', nota1: 6.5, nota2: 6.0, nota3: 6.2, promedio: 6.2, estado: 'Satisfactorio' },
    { asignatura: 'Lenguaje', nota1: 6.0, nota2: 6.3, nota3: 6.1, promedio: 6.1, estado: 'Satisfactorio' },
    { asignatura: 'Ciencias', nota1: 5.8, nota2: 6.0, nota3: 5.9, promedio: 5.9, estado: 'Satisfactorio' },
    { asignatura: 'Historia', nota1: 6.2, nota2: 6.4, nota3: 6.3, promedio: 6.3, estado: 'Destacado' },
    { asignatura: 'Inglés', nota1: 6.0, nota2: 5.8, nota3: 6.0, promedio: 5.9, estado: 'Satisfactorio' }
  ];

  const asistenciaMensual = [
    { mes: 'Marzo', porcentaje: 98 },
    { mes: 'Abril', porcentaje: 95 },
    { mes: 'Mayo', porcentaje: 94 },
    { mes: 'Junio', porcentaje: 96 }
  ];

  const mensajes = [
    { id: 1, fecha: '2026-05-14', emisor: 'Prof. Juan Pérez', asunto: 'Reunión de apoderados', leido: false },
    { id: 2, fecha: '2026-05-12', emisor: 'Inspectoría', asunto: 'Justificación de inasistencia', leido: true },
    { id: 3, fecha: '2026-05-10', emisor: 'Coordinación académica', asunto: 'Resultados SIMCE', leido: true }
  ];

  const solicitudes = [
    { id: 1, tipo: 'Justificación', fecha: '2026-05-15', estado: 'En revisión', detalle: 'Inasistencia 12/05' },
    { id: 2, tipo: 'Entrevista', fecha: '2026-05-10', estado: 'Aprobada', detalle: 'Reunión con profesor jefe' },
    { id: 3, tipo: 'Certificado', fecha: '2026-05-05', estado: 'Completada', detalle: 'Certificado de alumno regular' }
  ];

  const proximasEvaluaciones = [
    { asignatura: 'Matemáticas', fecha: '2026-05-20', contenido: 'Ecuaciones algebraicas' },
    { asignatura: 'Lenguaje', fecha: '2026-05-22', contenido: 'Ensayo literario' },
    { asignatura: 'Ciencias', fecha: '2026-05-25', contenido: 'Sistema solar' }
  ];

  return (
    <RoleLayout
      title="Panel de apoderado"
      subtitle="Vista libro digital usuario apoderado."
      summaryCards={[
        { label: 'Estudiante asociado', value: '1', helper: 'Matías Rojas' },
        { label: 'Promedio', value: '6.0', helper: 'Promedio actual' },
        { label: 'Asistencia', value: '94%', helper: 'Acumulada' },
        { label: 'Solicitudes', value: '2', helper: 'En proceso' }
      ]}
    >
      <div className="student-info-card">
        <div className="student-avatar">
          <div style={{ width: '100%', height: '100%', background: '#764ba2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            👨‍🎓
          </div>
        </div>
        <div className="student-details">
          <h3>Matías Rojas González</h3>
          <p className="student-course">8° Básico</p>
          <div className="student-badges">
            <span className="badge">📚 Matrícula 2026</span>
            <span className="badge">✅ Alumno regular</span>
          </div>
        </div>
        <div className="student-actions">
          <button className="btn-small">Ver perfil completo →</button>
        </div>
      </div>
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'notas' ? 'active' : ''}`}
          onClick={() => setActiveTab('notas')}
        >
          📊 Notas y Rendimiento
        </button>
        <button 
          className={`tab-btn ${activeTab === 'asistencia' ? 'active' : ''}`}
          onClick={() => setActiveTab('asistencia')}
        >
          📅 Asistencia
        </button>
        <button 
          className={`tab-btn ${activeTab === 'evaluaciones' ? 'active' : ''}`}
          onClick={() => setActiveTab('evaluaciones')}
        >
          📝 Próximas Evaluaciones
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'notas' && (
          <div className="role-card">
            <h3>📊 Boletín de notas - 8° Básico</h3>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Asignatura</th>
                    <th>Nota 1</th>
                    <th>Nota 2</th>
                    <th>Nota 3</th>
                    <th>Promedio</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {notas.map((nota, idx) => (
                    <tr key={idx}>
                      <td>{nota.asignatura}</td>
                      <td>{nota.nota1}</td>
                      <td>{nota.nota2}</td>
                      <td>{nota.nota3}</td>
                      <td><strong>{nota.promedio}</strong></td>
                      <td>
                        <span className={`estado-badge ${nota.estado === 'Destacado' ? 'destacado' : 'satisfactorio'}`}>
                          {nota.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'asistencia' && (
          <div className="role-card">
            <h3>📅 Asistencia académica</h3>
            <div className="asistencia-stats">
              <div className="asistencia-total">
                <span className="asistencia-label">Asistencia acumulada</span>
                <span className="asistencia-valor" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>94%</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
            <div className="asistencia-mensual mt-4">
              <h4>Asistencia por mes</h4>
              {asistenciaMensual.map((item, idx) => (
                <div key={idx} className="chart-bar-container">
                  <div className="chart-label">{item.mes}</div>
                  <div className="chart-bar">
                    <div className="chart-fill" style={{ width: `${item.porcentaje}%`, backgroundColor: item.porcentaje >= 90 ? '#10b981' : '#f59e0b' }}></div>
                  </div>
                  <div className="chart-value">{item.porcentaje}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'evaluaciones' && (
          <div className="role-card">
            <h3>📝 Próximas evaluaciones</h3>
            <div className="alert-info">
              <span>📌</span>
              <p>Próximas evaluaciones programadas para los siguientes días</p>
            </div>
            {proximasEvaluaciones.map((evaluacion, idx) => (
              <div key={idx} className="evaluacion-card">
                <div className="evaluacion-fecha">
                  <span className="dia">{new Date(evaluacion.fecha).getDate()}</span>
                  <span className="mes">{new Date(evaluacion.fecha).toLocaleString('es', { month: 'short' })}</span>
                </div>
                <div className="evaluacion-info">
                  <h4>{evaluacion.asignatura}</h4>
                  <p>{evaluacion.contenido}</p>
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
                    <span className="mensaje-emisor">{mensaje.emisor}</span>
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
            <h3>📋 Solicitudes académicas</h3>
            <div className="solicitudes-list">
              {solicitudes.map((solicitud, idx) => (
                <div key={idx} className="solicitud-item">
                  <div className="solicitud-header">
                    <span className="solicitud-tipo">{solicitud.tipo}</span>
                    <span className={`solicitud-estado ${solicitud.estado.toLowerCase().replace(' ', '-')}`}>
                      {solicitud.estado}
                    </span>
                  </div>
                  <p className="solicitud-detalle">{solicitud.detalle}</p>
                  <div className="solicitud-footer">
                    <span className="solicitud-fecha">📅 {solicitud.fecha}</span>
                    <button className="btn-small">Ver detalles</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-primary-small">➕ Nueva solicitud</button>
          </div>
        </div>
      </div>
    </RoleLayout>
  );
}