import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

const carouselSlides = [
  {
    image: 'https://cdn.pixabay.com/photo/2015/11/19/21/10/school-1051912_1280.jpg',
    title: 'Colegio Bernardo O\'Higgins',
    description: 'Institución educativa con más de 45 años de historia en Coquimbo, formando líderes íntegros con excelencia académica y valores cristianos.'
  },
  {
    image: 'https://cdn.pixabay.com/photo/2017/05/10/21/33/graduation-2301736_1280.jpg',
    title: 'Excelencia Académica',
    description: 'Destacamos por nuestra calidad educativa, obteniendo excelentes resultados en pruebas estandarizadas.'
  },
  {
    image: 'https://cdn.pixabay.com/photo/2016/11/14/04/17/child-1822686_1280.jpg',
    title: 'Formación Integral',
    description: 'Desarrollamos habilidades académicas, deportivas y artísticas en nuestros estudiantes.'
  }
];
  const noticias = [
    {
      fecha: '15 de Mayo, 2026',
      titulo: 'Jornada de Integración Familiar',
      resumen: 'Invitamos a todos los apoderados a participar el próximo sábado 20 de mayo.',
      categoria: 'Eventos',
      imagen: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500'
    },
    {
      fecha: '10 de Mayo, 2026',
      titulo: 'Resultados SIMCE 2025',
      resumen: 'Felicitamos a nuestros estudiantes por los excelentes resultados obtenidos.',
      categoria: 'Logros',
      imagen: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500'
    },
    {
      fecha: '05 de Mayo, 2026',
      titulo: 'Matrículas 2027 Abiertas',
      resumen: 'Proceso de postulación para nuevos alumnos hasta el 30 de junio.',
      categoria: 'Admisión',
      imagen: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500'
    },
    {
      fecha: '01 de Mayo, 2026',
      titulo: 'Día del Alumno',
      resumen: 'Actividades especiales para celebrar a nuestros estudiantes.',
      categoria: 'Eventos',
      imagen: 'https://images.unsplash.com/photo-1527853787691-f7be74f2e39a?w=500'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="home-professional">
      <section className="hero-carousel">
        <div className="carousel-container">
          {carouselSlides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="carousel-overlay"></div>
              <div className="carousel-content">
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <div className="carousel-buttons">
                  <button className="btn-primary" onClick={() => navigate('/login')}>
                    Ingresar al Sistema
                  </button>
                  <button className="btn-outline" onClick={() => document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' })}>
                    Conócenos
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="carousel-dots">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="nosotros" className="about-section">
        <div className="container-modern">
          <div className="about-grid">
            <div className="about-content">
              <span className="section-tag">Quiénes Somos</span>
              <h2>Comprometidos con la Educación del Futuro</h2>
              <p>
                El Colegio Bernardo O'Higgins de Coquimbo es una institución educativa
                con más de 45 años de experiencia, dedicada a la formación integral
                de estudiantes con excelencia académica y valores cristianos.
              </p>
              <div className="about-stats">
                <div className="stat">
                  <span className="stat-number">45+</span>
                  <span className="stat-label">Años de experiencia</span>
                </div>
                <div className="stat">
                  <span className="stat-number">1200+</span>
                  <span className="stat-label">Estudiantes</span>
                </div>
                <div className="stat">
                  <span className="stat-number">80+</span>
                  <span className="stat-label">Profesores</span>
                </div>
                <div className="stat">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Tasa de aprobación</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600" alt="Colegio Bernardo O'Higgins" />
            </div>
          </div>
        </div>
      </section>

      <section className="access-section">
        <div className="container-modern">
          <div className="section-header">
            <span className="section-tag">Accesos Rápidos</span>
            <h2>Ingresa según tu rol</h2>
            <p>Plataforma integrada de libro de clases digital</p>
          </div>
          <div className="access-grid">
            <div className="access-card" onClick={() => navigate('/login/alumno')}>
              <div className="card-icon">👨‍🎓</div>
              <h3>Área Alumnos</h3>
              <p>Consulta tus notas, asistencia y materiales de estudio</p>
              <button className="card-btn">Acceder →</button>
            </div>
            <div className="access-card" onClick={() => navigate('/login/apoderado')}>
              <div className="card-icon">👨‍👩‍👧</div>
              <h3>Área Apoderados</h3>
              <p>Seguimiento académico, comunicados y citas</p>
              <button className="card-btn">Acceder →</button>
            </div>
            <div className="access-card" onClick={() => navigate('/login/profesor')}>
              <div className="card-icon">👨‍🏫</div>
              <h3>Área Profesores</h3>
              <p>Libro de clases, evaluaciones y planificaciones</p>
              <button className="card-btn">Acceder →</button>
            </div>
          </div>
        </div>
      </section>

      <section className="noticias-section">
        <div className="container-modern">
          <div className="section-header">
            <span className="section-tag">Comunicados Oficiales</span>
            <h2>Últimas Noticias</h2>
            <p>Mantente informado sobre nuestras actividades</p>
          </div>
          <div className="noticias-grid">
            {noticias.map((noticia, idx) => (
              <div key={idx} className="noticia-card">
                <div className="noticia-imagen">
                  <img src={noticia.imagen} alt={noticia.titulo} />
                </div>
                <div className="noticia-contenido">
                  <span className="noticia-categoria">{noticia.categoria}</span>
                  <span className="noticia-fecha">{noticia.fecha}</span>
                  <h3>{noticia.titulo}</h3>
                  <p>{noticia.resumen}</p>
                  <a href="#" className="noticia-link">Leer más →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="valores-section">
        <div className="container-modern">
          <div className="section-header">
            <span className="section-tag">Nuestros Valores</span>
            <h2>Formando Personas Íntegras</h2>
          </div>
          <div className="valores-grid">
            <div className="valor-card">
              <div className="valor-icon">📖</div>
              <h3>Excelencia Académica</h3>
              <p>Buscamos la mejora continua en todos los niveles educativos.</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon">❤️</div>
              <h3>Formación Valórica</h3>
              <p>Valores cristianos y respeto como pilar fundamental.</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon">🤝</div>
              <h3>Compromiso Social</h3>
              <p>Formamos ciudadanos responsables con su entorno.</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon">💡</div>
              <h3>Innovación Educativa</h3>
              <p>Metodologías modernas y tecnología de vanguardia.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-modern">
        <div className="container-modern">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>Colegio Bernardo O'Higgins</h3>
              <p>Formando generaciones con excelencia y valores desde 1976.</p>
            </div>
            <div className="footer-links">
              <h4>Enlaces Rápidos</h4>
              <ul>
                <li><a href="#">Inicio</a></li>
                <li><a href="#">Nosotros</a></li>
                <li><a href="#">Admisión</a></li>
                <li><a href="#">Contacto</a></li>
              </ul>
            </div>
            <div className="footer-contact">
              <h4>Contacto</h4>
              <p>Av. Los Carrera 1234, Coquimbo, Chile</p>
              <p>+56 51 2 123456</p>
              <p>contacto@colegiobernardo.cl</p>
            </div>
            <div className="footer-hours">
              <h4>Horario de Atención</h4>
              <p>Lunes a Viernes: 08:00 - 17:00</p>
              <p>Sábado: 09:00 - 13:00</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Colegio Bernardo O'Higgins. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <style>{`
        .home-professional {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .hero-carousel {
          position: relative;
          height: 90vh;
          min-height: 600px;
          overflow: hidden;
        }

        .carousel-container {
          position: relative;
          height: 100%;
        }

        .carousel-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 0.8s ease;
        }

        .carousel-slide.active {
          opacity: 1;
        }

        .carousel-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(11,43,64,0.85) 0%, rgba(26,74,111,0.8) 100%);
        }

        .carousel-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          padding: 0 2rem;
        }

        .carousel-content h1 {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .carousel-content p {
          font-size: 1.2rem;
          max-width: 700px;
          margin-bottom: 2rem;
        }

        .carousel-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn-primary, .btn-outline {
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
        }

        .btn-primary {
          background: #ffc107;
          color: #0b2b40;
        }

        .btn-primary:hover {
          background: #ffd044;
          transform: translateY(-3px);
        }

        .btn-outline {
          background: transparent;
          border: 2px solid white;
          color: white;
        }

        .btn-outline:hover {
          background: white;
          color: #0b2b40;
          transform: translateY(-3px);
        }

        .carousel-dots {
          position: absolute;
          bottom: 2rem;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          z-index: 3;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }

        .dot.active {
          background: #ffc107;
          width: 30px;
          border-radius: 10px;
        }

        .container-modern {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .section-tag {
          display: inline-block;
          color: #ffc107;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          color: #0b2b40;
          margin-bottom: 1rem;
        }

        .about-section {
          padding: 5rem 0;
          background: white;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        .about-content h2 {
          font-size: 2rem;
          color: #0b2b40;
          margin-bottom: 1.5rem;
        }

        .about-content p {
          color: #6c757d;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .about-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 800;
          color: #1a4a6f;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #6c757d;
        }

        .about-image img {
          width: 100%;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .access-section {
          padding: 5rem 0;
          background: #f8f9fa;
        }

        .access-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .access-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 5px 20px rgba(0,0,0,0.08);
        }

        .access-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }

        .card-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .access-card h3 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          color: #0b2b40;
        }

        .access-card p {
          color: #6c757d;
          margin-bottom: 1.5rem;
        }

        .card-btn {
          background: none;
          border: none;
          color: #ffc107;
          font-weight: 600;
          cursor: pointer;
        }

        .noticias-section {
          padding: 5rem 0;
          background: white;
        }

        .noticias-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .noticia-card {
          background: #f8f9fa;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .noticia-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .noticia-imagen {
          height: 200px;
          overflow: hidden;
        }

        .noticia-imagen img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .noticia-card:hover .noticia-imagen img {
          transform: scale(1.05);
        }

        .noticia-contenido {
          padding: 1.5rem;
        }

        .noticia-categoria {
          display: inline-block;
          background: #ffc107;
          color: #0b2b40;
          font-size: 0.7rem;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .noticia-fecha {
          display: block;
          font-size: 0.8rem;
          color: #6c757d;
          margin-bottom: 0.5rem;
        }

        .noticia-contenido h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: #0b2b40;
        }

        .noticia-contenido p {
          color: #6c757d;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .noticia-link {
          color: #1a4a6f;
          text-decoration: none;
          font-weight: 600;
        }

        .valores-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .valores-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .valor-card {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 20px;
          transition: all 0.3s;
        }

        .valor-card:hover {
          transform: translateY(-5px);
        }

        .valor-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .valor-card h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: #0b2b40;
        }

        .valor-card p {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .footer-modern {
          background: #0b2b40;
          color: white;
          padding: 3rem 0 1rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-brand h3 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
        }

        .footer-brand p {
          color: #adb5bd;
        }

        .footer-links h4, .footer-contact h4, .footer-hours h4 {
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .footer-links ul {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 0.5rem;
        }

        .footer-links a {
          color: #adb5bd;
          text-decoration: none;
        }

        .footer-links a:hover {
          color: #ffc107;
        }

        .footer-contact p, .footer-hours p {
          color: #adb5bd;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          color: #adb5bd;
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr;
          }
          
          .carousel-content h1 {
            font-size: 2rem;
          }
          
          .carousel-content p {
            font-size: 1rem;
          }
          
          .section-header h2 {
            font-size: 1.8rem;
          }
          
          .container-modern {
            padding: 0 1rem;
          }
          
          .hero-carousel {
            height: 70vh;
          }
        }
      `}</style>
    </div>
  );
}