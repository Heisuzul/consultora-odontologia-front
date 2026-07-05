import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')
    
    if (!token) {
      navigate('/login')
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Cargar citas del paciente
    fetchCitas(token)
  }, [navigate])

  const fetchCitas = async (token) => {
    try {
      const API_URL = 'http://localhost:8000'
      const response = await fetch(`${API_URL}/citas/mis-citas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setCitas(data)
      }
    } catch (error) {
      console.error('Error al cargar citas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Panel del Paciente</h1>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Información básica del paciente */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Mi Información</h5>
            </div>
            <div className="card-body">
              {user && (
                <div>
                  <p><strong>Nombre:</strong> {user.nombre || 'No disponible'}</p>
                  <p><strong>Email:</strong> {user.email || 'No disponible'}</p>
                  <p><strong>Rol:</strong> {user.role || 'paciente'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h5 className="card-title mb-0">Estado</h5>
            </div>
            <div className="card-body">
              <div className="alert alert-success mb-0">
                <strong>✓ Sesión activa</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Próximas citas */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-info text-white">
              <h5 className="card-title mb-0">Próximas Citas</h5>
            </div>
            <div className="card-body">
              {citas.length === 0 ? (
                <div className="alert alert-info" role="alert">
                  <strong>No tienes citas registradas.</strong> Contacta a la consultora para agendar una.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Odontólogo</th>
                        <th>Procedimiento</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {citas.map((cita) => (
                        <tr key={cita.id}>
                          <td>{new Date(cita.fecha).toLocaleDateString()}</td>
                          <td>{cita.hora}</td>
                          <td>{cita.odontologo || 'No asignado'}</td>
                          <td>{cita.procedimiento || 'General'}</td>
                          <td>
                            <span className={`badge ${
                              cita.estado === 'confirmada' ? 'bg-success' :
                              cita.estado === 'pendiente' ? 'bg-warning' :
                              cita.estado === 'cancelada' ? 'bg-danger' : 'bg-secondary'
                            }`}>
                              {cita.estado || 'Pendiente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
