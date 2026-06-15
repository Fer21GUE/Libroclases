import React, { useEffect, useState } from 'react';
import AdminPageLayout from '../../components/AdminLayout.jsx';
import { asignarProfesor, getAsignaciones, getCourses, getProfesores } from '../../api/coursesApi.js';

export default function Assignments() {
  const [courses, setCourses] = useState([]); const [profesores, setProfesores] = useState([]); const [asignaciones, setAsignaciones] = useState([]);
  const [form, setForm] = useState({ profesorId: '', cursoId: '', asignatura: '' }); const [error, setError] = useState(''); const [message, setMessage] = useState('');
  const loadData = async () => { setCourses(await getCourses()); setProfesores(await getProfesores()); setAsignaciones(await getAsignaciones()); };
  useEffect(() => { loadData().catch(e => setError(e.message)); }, []);
  const onSubmit = async (e) => { e.preventDefault(); setError(''); setMessage(''); try { await asignarProfesor({ profesorId: Number(form.profesorId), cursoId: Number(form.cursoId), asignatura: form.asignatura }); setForm({ profesorId: '', cursoId: '', asignatura: '' }); setMessage('Asignación guardada correctamente.'); await loadData(); } catch(e){ setError(e.message); } };
  return <AdminPageLayout title="Asignación de cursos">
    <div className="content-section"><h2>Asignar profesor a curso</h2><form onSubmit={onSubmit} className="role-card" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}><div className="row g-3"><div className="col-md-4"><select className="form-control" value={form.profesorId} onChange={e => setForm({...form, profesorId:e.target.value})} required><option value="">Seleccione profesor</option>{profesores.map(p => <option key={p.id} value={p.id}>{p.usuario?.nombre} - {p.especialidad}</option>)}</select></div><div className="col-md-4"><select className="form-control" value={form.cursoId} onChange={e => setForm({...form, cursoId:e.target.value})} required><option value="">Seleccione curso</option>{courses.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select></div><div className="col-md-4"><input className="form-control" placeholder="Asignatura" value={form.asignatura} onChange={e => setForm({...form, asignatura:e.target.value})} required /></div><div className="col-12"><button className="btn-base btn-primary">Guardar asignación</button></div></div></form>{message && <div className="form-success">{message}</div>}{error && <div className="form-error">{error}</div>}</div>
    <div className="content-section"><h2>Asignaciones registradas</h2><div className="table-responsive"><table className="table table-dark table-striped"><thead><tr><th>Profesor</th><th>Curso</th><th>Asignatura</th></tr></thead><tbody>{asignaciones.map(a => <tr key={a.id}><td>{a.profesor?.usuario?.nombre}</td><td>{a.curso?.nombre}</td><td>{a.asignatura}</td></tr>)}</tbody></table></div></div>
  </AdminPageLayout>;
}
