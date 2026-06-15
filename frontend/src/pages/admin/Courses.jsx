import React, { useEffect, useState } from 'react';
import AdminPageLayout from '../../components/AdminLayout.jsx';
import { createCourse, getAsignaciones, getCourses, getProfesores } from '../../api/coursesApi.js';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [form, setForm] = useState({ nombre: '', nivel: '', profesorJefeId: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadData = async () => {
    setCourses(await getCourses());
    setProfesores(await getProfesores());
    setAsignaciones(await getAsignaciones());
  };

  useEffect(() => { loadData().catch((e) => setError(e.message)); }, []);

  const onSubmit = async (e) => {
    e.preventDefault(); setError(''); setMessage('');
    try {
      await createCourse({ ...form, profesorJefeId: form.profesorJefeId ? Number(form.profesorJefeId) : null });
      setForm({ nombre: '', nivel: '', profesorJefeId: '' }); setMessage('Curso creado correctamente.'); await loadData();
    } catch (e) { setError(e.message); }
  };

  const profesoresAsignadosDelCurso = (cursoId) => {
    const nombres = asignaciones.filter(a => a.curso?.id === cursoId).map(a => a.profesor?.usuario?.nombre).filter(Boolean);
    return [...new Set(nombres)];
  };

  const profesorVisible = (curso) => {
    if (curso.profesorJefe?.usuario?.nombre) return curso.profesorJefe.usuario.nombre;
    const asignados = profesoresAsignadosDelCurso(curso.id);
    return asignados.length ? asignados.join(', ') : '-';
  };

  return (
    <AdminPageLayout title="Gestión de cursos">
      <div className="content-section">
        <h2>Crear curso</h2>
        <form onSubmit={onSubmit} className="role-card" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="row g-3">
            <div className="col-md-4"><input className="form-control" placeholder="Nombre del curso" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></div>
            <div className="col-md-4"><input className="form-control" placeholder="Nivel" value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })} /></div>
            <div className="col-md-4"><select className="form-control" value={form.profesorJefeId} onChange={(e) => setForm({ ...form, profesorJefeId: e.target.value })}><option value="">Sin profesor jefe</option>{profesores.map(p => <option key={p.id} value={p.id}>{p.usuario?.nombre} - {p.especialidad}</option>)}</select></div>
            <div className="col-12"><button className="btn-base btn-primary">Crear curso</button></div>
          </div>
        </form>
        {message && <div className="form-success">{message}</div>}{error && <div className="form-error">{error}</div>}
      </div>

      <div className="content-section">
        <h2>Cursos creados</h2>
        <div className="table-responsive">
          <table className="table table-dark table-striped">
            <thead><tr><th>ID</th><th>Curso</th><th>Nivel</th><th>Profesor jefe / asignado</th></tr></thead>
            <tbody>{courses.map(c => <tr key={c.id}><td>{c.id}</td><td>{c.nombre}</td><td>{c.nivel || '-'}</td><td>{profesorVisible(c)}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </AdminPageLayout>
  );
}