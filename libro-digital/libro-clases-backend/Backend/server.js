const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'libro_clases',
  user: 'postgres',
  password: 'tu_contraseña_aqui', // CAMBIA ESTO
});

pool.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch(err => console.error('❌ Error al conectar:', err.message));

app.post('/api/auth/login', async (req, res) => {
  const { email, password, rol } = req.body;
  
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, password, rol FROM usuarios WHERE email = $1 AND rol = $2 AND activo = true',
      [email, rol]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    
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
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
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
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});