const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const USERS = [
  { id: 1, nombre: 'Administrador', email: 'admin@colegio.cl', password: bcrypt.hashSync('Admin123', 10), rol: 'admin' },
  { id: 2, nombre: 'Maria Soto', email: 'profesor@colegio.cl', password: bcrypt.hashSync('Profesor123', 10), rol: 'profesor' },
  { id: 3, nombre: 'Matias Rojas', email: 'alumno@colegio.cl', password: bcrypt.hashSync('Alumno123', 10), rol: 'alumno' },
  { id: 4, nombre: 'Patricia Gonzalez', email: 'apoderado@colegio.cl', password: bcrypt.hashSync('Apoderado123', 10), rol: 'apoderado' }
];

app.post('/api/auth/login', (req, res) => {
  const { email, password, rol } = req.body;
  
  const user = USERS.find(u => u.email === email && u.rol === rol);
  
  if (!user) {
    return res.status(401).json({ error: 'Credenciales invalidas' });
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

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});