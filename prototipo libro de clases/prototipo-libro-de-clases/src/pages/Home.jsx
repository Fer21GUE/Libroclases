import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const stats = [
    { number: '1,200+', label: 'Alumnos', icon: '👨‍🎓' },
    { number: '80+', label: 'Profesores', icon: '👨‍🏫' },
    { number: '42', label: 'Cursos', icon: '📚' },
    { number: '98%', label: 'Tasa de aprobación', icon: '📈' }
  ];

  const accessCards = [
    { 
      title: 'Área Alumnos', 
      icon: '👨‍🎓', 
      description: 'Consulta tus notas, asistencia y materiales de estudio', 
      path: '/alumno'
    },
    { 
      title: 'Área Apoderados', 
      icon: '👨‍👩‍👧', 
      description: 'Seguimiento académico, comunicados y citas', 
      path: '/apoderado'
    },
    { 
      title: 'Área Profesores', 
      icon: '👨‍🏫', 
      description: 'Libro de clases, evaluaciones y planificaciones', 
      path: '/profesor'
    }
  ];

  const noticias = [
    { 
      fecha: '15 Mayo 2026', 
      titulo: 'Jornada de integración familiar', 
      resumen: 'Invitación a todos los apoderados a participar el próximo sábado 20 de mayo.',
      imagen: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400'
    },
    { 
      fecha: '10 Mayo 2026', 
      titulo: 'Resultados SIMCE 2025', 
      resumen: 'Felicitamos a nuestros estudiantes por los excelentes resultados obtenidos.',
      imagen: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400'
    },
    { 
      fecha: '05 Mayo 2026', 
      titulo: 'Matrículas 2027 abiertas', 
      resumen: 'Proceso de postulación para nuevos alumnos hasta el 30 de junio.',
      imagen: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400'
    }
  ];

  return (
    <div className="home-professional">

      <section className="hero-modern">
        <div className="hero-overlay-modern"></div>
        <div className="hero-container">
          <div className="hero-animated-badge">
            <span className="hero-badge">Fundado en 1976</span>
          </div>
          <h1 className="hero-title">
            Colegio Bernardo <span className="highlight">O'Higgins</span>
          </h1>
          <p className="hero-subtitle">
            Formando líderes íntegros con valores cristianos y excelencia académica en Coquimbo.
            Más de 45 años comprometidos con la educación de calidad.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/login')}>
              <span>🔐</span> Ingresar al sistema
            </button>
            <button className="btn-outline" onClick={() => window.open('#', '_blank')}>
              📖 Conoce nuestra historia
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">+45</span>
              <span className="hero-stat-label">años de excelencia</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">+1200</span>
              <span className="hero-stat-label">estudiantes</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">100%</span>
              <span className="hero-stat-label">compromiso educativo</span>
            </div>
          </div>
        </div>
      </section>

      <section className="access-section">
        <div className="container-modern">
          <div className="section-header">
            <span className="section-tag">Accesos Directos</span>
            <h2>Ingresa según tu rol</h2>
            <p>Plataforma integrada de libro de clases digital</p>
          </div>
          <div className="access-grid">
            {accessCards.map((card, idx) => (
              <div key={idx} className="access-card" onClick={() => navigate(card.path)}>
                <div className="card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <button className="card-btn">Acceder al panel →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-section-modern">
        <div className="container-modern">
          <div className="stats-grid-modern">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card-modern">
                <div className="stat-icon">{stat.icon}</div>
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="news-section">
        <div className="container-modern">
          <div className="section-header">
            <span className="section-tag">Comunicados Oficiales</span>
            <h2>Últimas noticias</h2>
            <p>Mantente informado sobre las actividades y anuncios importantes</p>
          </div>
          <div className="news-grid">
            {noticias.map((noticia, idx) => (
              <div key={idx} className="news-card">
                <div className="news-image">
                  <img src={noticia.imagen} alt={noticia.titulo} />
                </div>
                <div className="news-content">
                  <span className="news-date">📅 {noticia.fecha}</span>
                  <h3>{noticia.titulo}</h3>
                  <p>{noticia.resumen}</p>
                  <a href="#" className="news-link">Leer más →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer-modern">
        <div className="container-modern">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>Colegio Bernardo O'Higgins</h3>
              <p>Formando generaciones con excelencia y valores desde 1976.</p>
              <div className="social-links">
                <a href="#">📘</a>
                <a href="#">📷</a>
                <a href="#">🐦</a>
              </div>
            </div>
            <div className="footer-links">
              <h4>Enlaces rápidos</h4>
              <ul>
                <li><a href="#">Historia</a></li>
                <li><a href="#">Proyecto Educativo</a></li>
                <li><a href="#">Reglamento interno</a></li>
                <li><a href="#">Contacto</a></li>
              </ul>
            </div>
            <div className="footer-contact">
              <h4>Contacto</h4>
              <p>📍 Av. Los Carrera 1234, Coquimbo, Chile</p>
              <p>📞 +56 51 2 123456</p>
              <p>✉️ contacto@colegiobernardo.cl</p>
              <p>⏰ Lun a Vie: 08:00 - 17:00</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Colegio Bernardo O'Higgins. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}