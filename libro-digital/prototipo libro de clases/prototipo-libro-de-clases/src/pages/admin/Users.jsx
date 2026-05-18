import React, { useEffect, useState } from 'react';
import AdminPageLayout from '../../components/AdminLayout.jsx';
import { createUser, deleteUser, getUsers } from '../../api/usersApi.js';
import { getCourses } from '../../api/coursesApi.js';

const initialForm = { nombre: '', email: '', password: '', rol: 'alumno', codigoProfesor: '', especialidad: '', codigoAlumno: '', cursoId: '', telefono: '' };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadData = async () => {
    setUsers(await getUsers());
    setCourses(await getCourses());
  };

  useEffect(() => { loadData().catch((e) => setError(e.message)); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault(); setError(''); setMessage('');
    const payload = { ...form, cursoId: form.cursoId ? Number(form.cursoId) : null };
    try { await createUser(payload); setMessage('Usuario creado correctamente.'); setForm(initialForm); await loadData(); }
    catch (e) { setError(e.message); }
  };

  const onDelete = async (user) => {
    if (!window.confirm(`¿Seguro que deseas eliminar a ${user.nombre}? Esta acción eliminará sus datos asociados.`)) return;
    setError(''); setMessage(''); setDeletingId(user.id);
    try { await deleteUser(user.id); setMessage('Usuario eliminado correctamente.'); await loadData(); }
    catch (e) { setError(e.message); }
    finally { setDeletingId(null); }
  };

  return (
    <AdminPageLayout title="Gestión de usuarios">
      <div className="content-section">
        <h2>Crear usuario</h2>
        <form onSubmit={onSubmit} className="role-card" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="row g-3">
            <div className="col-md-4"><input name="nombre" className="form-control" placeholder="Nombre" value={form.nombre} onChange={onChange} required /></div>
            <div className="col-md-4"><input name="email" type="email" className="form-control" placeholder="Correo" value={form.email} onChange={onChange} required /></div>
            <div className="col-md-4"><input name="password" type="password" className="form-control" placeholder="Contraseña" value={form.password} onChange={onChange} required /></div>
            <div className="col-md-3"><select name="rol" className="form-control" value={form.rol} onChange={onChange}><option value="admin">Admin</option><option value="profesor">Profesor</option><option value="alumno">Alumno</option><option value="apoderado">Apoderado</option></select></div>
            {form.rol === 'profesor' && <><div className="col-md-3"><input name="codigoProfesor" className="form-control" placeholder="Código profesor" value={form.codigoProfesor} onChange={onChange} /></div><div className="col-md-3"><input name="especialidad" className="form-control" placeholder="Especialidad" value={form.especialidad} onChange={onChange} /></div></>}
            {form.rol === 'alumno' && <><div className="col-md-3"><input name="codigoAlumno" className="form-control" placeholder="Código alumno" value={form.codigoAlumno} onChange={onChange} /></div><div className="col-md-3"><select name="cursoId" className="form-control" value={form.cursoId} onChange={onChange}><option value="">Sin curso</option>{courses.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select></div></>}
            {form.rol === 'apoderado' && <div className="col-md-3"><input name="telefono" className="form-control" placeholder="Teléfono" value={form.telefono} onChange={onChange} /></div>}
            <div className="col-12"><button className="btn-base btn-primary">Crear usuario</button></div>
          </div>
        </form>
        {message && <div className="form-success">{message}</div>}{error && <div className="form-error">{error}</div>}
      </div>

      <div className="content-section">
        <h2>Listado de usuarios</h2>
        <div className="table-responsive">
          <table className="table table-dark table-striped">
            <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Activo</th><th>Acciones</th></tr></thead>
            <tbody>{users.map(u => <tr key={u.id}><td>{u.id}</td><td>{u.nombre}</td><td>{u.email}</td><td>{u.rol}</td><td>{u.activo ? 'Sí' : 'No'}</td><td><button type="button" className="btn btn-sm btn-danger" onClick={() => onDelete(u)} disabled={deletingId === u.id}>{deletingId === u.id ? 'Eliminando...' : 'Eliminar'}</button></td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </AdminPageLayout>
  );
}