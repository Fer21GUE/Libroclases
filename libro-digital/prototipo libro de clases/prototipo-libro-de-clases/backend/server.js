import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 5000;

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const USERS = [
  { id: 1, nombre: 'Administrador', email: 'admin@colegio.cl', password: bcrypt.hashSync('Admin123', 10), rol: 'admin' },
  { id: 2, nombre: 'María Soto', email: 'profesor@colegio.cl', password: bcrypt.hashSync('Profesor123', 10), rol: 'profesor' },
  { id: 3, nombre: 'Matías Rojas', email: 'alumno@colegio.cl', password: bcrypt.hashSync('Alumno123', 10), rol: 'alumno' },
  { id: 4, nombre: 'Patricia González', email: 'apoderado@colegio.cl', password: bcrypt.hashSync('Apoderado123', 10), rol: 'apoderado' }
];

const CURSOS = [
  { id: 1, nombre: '8° Básico A', nivel: '8°', anio: 2026 },
  { id: 2, nombre: 'I° Medio A', nivel: 'I°', anio: 2026 },
  { id: 3, nombre: 'II° Medio B', nivel: 'II°', anio: 2026 }
];

app.post('/api/auth/login', (req, res) => {
  const { email, password, rol } = req.body;
  console.log(`Login intent: ${email} - ${rol}`);
  
  const user = USERS.find(u => u.email === email && u.rol === rol);
  
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  
  const isValid = bcrypt.compareSync(password, user.password);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }
  
  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol, nombre: user.nombre },
    'secreto123',
    { expiresIn: '8h' }
  );
  
  res.json({
    success: true,
    token,
    user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }
  });
});

app.get('/api/users', (req, res) => {
  const usersList = USERS.map(u => ({ id: u.id, nombre: u.nombre, email: u.email, rol: u.rol }));
  res.json(usersList);
});

app.get('/api/courses', (req, res) => {
  res.json(CURSOS);
});

app.get('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ valid: false });
  }
  
  try {
    const decoded = jwt.verify(token, 'secreto123');
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
  console.log(`CORS habilitado para todos los orígenes`);
});