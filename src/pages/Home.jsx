import { Link } from 'react-router-dom'
import heroImg from '../assets/hero.png'

function Home() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <img
          src={heroImg}
          alt="Consultora odontológica"
          className="home-hero mb-4"
        />
        <h1 className="page-title">Bienvenido a nuestra consultora</h1>
        <p className="subtitle">
          Cuidamos tu sonrisa con un equipo profesional y tratamientos modernos.
        </p>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-md-5">
          <div className="card shadow home-card h-100 text-center">
            <div className="card-body p-4">
              <h2 className="h4 fw-bold mb-3">Servicios</h2>
              <p className="text-muted mb-4">
                Conoce nuestro portafolio de tratamientos odontológicos.
              </p>
              <Link to="/services" className="btn custom-btn text-white">
                Ver servicios
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow home-card h-100 text-center">
            <div className="card-body p-4">
              <h2 className="h4 fw-bold mb-3">Dentistas</h2>
              <p className="text-muted mb-4">
                Conoce a los especialistas que forman nuestro equipo.
              </p>
              <Link to="/dentists" className="btn custom-btn text-white">
                Ver dentistas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
