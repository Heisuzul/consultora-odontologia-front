import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { getCitas } from '../services/api'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [citas, setCitas] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')
    
    if (!token) {
      navigate('/login')
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    fetchCitas()
  }, [navigate])

  const fetchCitas = async () => {
    try {
      const data = await getCitas()
      setCitas(data)
    } catch (err) {
      setError(err.message)
      console.error('Error al cargar citas:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatHora = (hora24) => {
    let [horas, minutos] = hora24.split(':');
    let ampm = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12 || 12;
    return `${horas}:${minutos} ${ampm}`;
  };

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const citasFuturas = citas.filter(c => new Date(c.fecha) >= hoy);

  const proximaCita = citasFuturas
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0];

  const historialCitas = citas
    .filter(c => new Date(c.fecha) < hoy)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleDownloadPDF = async () => {
    const token = localStorage.getItem('access_token')
    try {
      const API_URL = 'http://localhost:8000'
      const response = await fetch(`${API_URL}/citas/historial-pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `historial_medico_${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Error al descargar el PDF')
      }
    } catch (error) {
      console.error('Error al descargar PDF:', error)
      alert('Error al descargar el PDF')
    }
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
                  <p><strong>Apellido:</strong> {user.apellido || 'No disponible'}</p>
                  <p><strong>Correo:</strong> {user.correo || 'No disponible'}</p>
                  <p><strong>Rol:</strong> {user.rol || 'paciente'}</p>
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

      <div className="row mb-4">
        <div className="col-12">
          {proximaCita ? (
            <div className="card border-primary shadow">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Mi Próxima Cita</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="text-primary">{proximaCita.procedimiento}</h4>
                    <p className="mb-1"><strong>Fecha:</strong> {proximaCita.fecha.split('T')[0]}</p>
                    <p className="mb-1"><strong>Hora:</strong> {formatHora(proximaCita.hora)}</p>
                    <p className="mb-0"><strong>Odontólogo:</strong> {proximaCita.odontologo}</p>
                  </div>
                  <span className="badge bg-info p-2">{proximaCita.estado}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning">
              No tienes citas próximas programadas.
            </div>
          )}
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <h3>Historial de Atenciones</h3>
          <div className="card shadow">
            <div className="card-body">
              {historialCitas.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Procedimiento</th>
                        <th>Odontólogo</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historialCitas.map((cita) => (
                        <tr key={cita.id}>
                          <td>{cita.fecha.split('T')[0]}</td>
                          <td>{cita.procedimiento}</td>
                          <td>{cita.odontologo}</td>
                          <td>
                            <span className="badge bg-secondary">{cita.estado}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No tienes atenciones previas registradas.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Próximas Citas</h5>
              <button className="btn btn-light btn-sm" onClick={handleDownloadPDF}>
                📄 Descargar Historial PDF
              </button>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {!error && citasFuturas.length === 0 ? (
                <div className="alert alert-info" role="alert">
                  <strong>No tienes próximas citas pendientes.</strong>
                </div>
              ) : !error ? (
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
                      {citasFuturas.map((cita) => (
                        <tr key={cita.id}>
                          <td>{cita.fecha.split('T')[0]}</td>
                          <td>{formatHora(cita.hora)}</td>
                          <td>{cita.odontologo || 'No asignado'}</td>
                          <td>{cita.procedimiento || 'General'}</td>
                          <td>
                            <span className={`badge ${
                              cita.estado === 'confirmada' ? 'bg-success' :
                              cita.estado === 'pendiente' ? 'bg-warning' :
                              cita.estado === 'finalizada' ? 'bg-primary' :
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
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard