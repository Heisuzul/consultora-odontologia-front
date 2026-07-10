import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="hero-title">
                  Cuidamos tu sonrisa con excelencia
                </h1>
                <p className="hero-subtitle">
                  Consultora odontológica de vanguardia con tratamientos modernos 
                  y un equipo de especialistas comprometidos con tu salud bucal.
                </p>
                <div className="hero-buttons">
                  <Link to="/register" className="btn btn-primary btn-lg me-3">
                    🦷 Agendar Cita
                  </Link>
                  <Link to="/services" className="btn btn-outline-light btn-lg">
                    Nuestros Servicios
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image">
                <div className="hero-placeholder">
                  <span className="hero-emoji">🦷</span>
                  <p className="hero-placeholder-text">Sonrisas Sanas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Nuestros Servicios</h2>
            <p className="section-subtitle">
              Tratamientos odontológicos de alta calidad para toda la familia
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="service-card">
                <div className="service-icon">🦷</div>
                <h3>Limpieza Dental</h3>
                <p>Profilaxis profesional para mantener tu sonrisa brillante y saludable.</p>
                <Link to="/services" className="service-link">Leer más →</Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="service-card">
                <div className="service-icon">✨</div>
                <h3>Blanqueamiento</h3>
                <p>Recupera el brillo natural de tus dientes con tratamientos seguros.</p>
                <Link to="/services" className="service-link">Leer más →</Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="service-card">
                <div className="service-icon">🔧</div>
                <h3>Ortodoncia</h3>
                <p>Alineación dental con las técnicas más modernas y efectivas.</p>
                <Link to="/services" className="service-link">Leer más →</Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="service-card">
                <div className="service-icon">🏥</div>
                <h3>Implantes</h3>
                <p>Soluciones permanentes para reemplazar dientes perdidos.</p>
                <Link to="/services" className="service-link">Leer más →</Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="service-card">
                <div className="service-icon">👶</div>
                <h3>Odontopediatría</h3>
                <p>Cuidado especializado para la salud bucal de los más pequeños.</p>
                <Link to="/services" className="service-link">Leer más →</Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="service-card">
                <div className="service-icon">🩺</div>
                <h3>Emergencias</h3>
                <p>Atención inmediata para cualquier urgencia dental.</p>
                <Link to="/services" className="service-link">Leer más →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-us-section py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="section-title mb-4">¿Por qué elegirnos?</h2>
              <div className="why-us-list">
                <div className="why-us-item">
                  <span className="why-us-icon">✓</span>
                  <div>
                    <h4>Equipo Especializado</h4>
                    <p>Profesionales con amplia experiencia y formación continua.</p>
                  </div>
                </div>
                <div className="why-us-item">
                  <span className="why-us-icon">✓</span>
                  <div>
                    <h4>Tecnología Avanzada</h4>
                    <p>Equipamiento de última generación para tratamientos precisos.</p>
                  </div>
                </div>
                <div className="why-us-item">
                  <span className="why-us-icon">✓</span>
                  <div>
                    <h4>Ambiente Cómodo</h4>
                    <p>Instalaciones modernas diseñadas para tu comodidad.</p>
                  </div>
                </div>
                <div className="why-us-item">
                  <span className="why-us-icon">✓</span>
                  <div>
                    <h4>Atención Personalizada</h4>
                    <p>Tratamientos adaptados a tus necesidades específicas.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="why-us-image">
                <div className="why-us-placeholder">
                  <span className="why-us-emoji">👨‍⚕️</span>
                  <p className="why-us-placeholder-text">Equipo Profesional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container">
          <div className="cta-card">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h2 className="cta-title">¿Listo para cuidar tu sonrisa?</h2>
                <p className="cta-subtitle">
                  Agenda tu cita hoy y descubre la diferencia de un tratamiento de calidad.
                </p>
              </div>
              <div className="col-lg-4 text-center">
                <Link to="/register" className="btn btn-primary btn-lg">
                  📅 Agendar Cita Ahora
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
