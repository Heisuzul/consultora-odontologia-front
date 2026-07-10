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
    <div className="dashboard-page">
      <div className="container py-5">
        {/* Dashboard Header */}
        <div className="dashboard-header mb-5">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="dashboard-title">
                👋 Hola, {user?.nombre || 'Paciente'}
              </h1>
              <p className="dashboard-subtitle">
                Bienvenido a tu panel de salud dental
              </p>
            </div>
            <div className="col-md-4 text-md-end">
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-5">
          <div className="col-md-4 mb-4">
            <div className="stat-card stat-primary">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3 className="stat-number">{citasFuturas.length}</h3>
                <p className="stat-label">Próximas Citas</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="stat-card stat-success">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3 className="stat-number">{historialCitas.length}</h3>
                <p className="stat-label">Atenciones Completadas</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="stat-card stat-info">
              <div className="stat-icon">🦷</div>
              <div className="stat-content">
                <h3 className="stat-number">{citas.length}</h3>
                <p className="stat-label">Total Citas</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="info-card">
              <div className="info-card-header">
                <h3 className="info-card-title">👤 Mi Información</h3>
              </div>
              <div className="info-card-body">
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <div className="info-item">
                      <span className="info-label">Nombre</span>
                      <span className="info-value">{user?.nombre || 'No disponible'}</span>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="info-item">
                      <span className="info-label">Apellido</span>
                      <span className="info-value">{user?.apellido || 'No disponible'}</span>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{user?.correo || 'No disponible'}</span>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="info-item">
                      <span className="info-label">Rol</span>
                      <span className="info-value badge badge-role">{user?.rol || 'paciente'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Appointment Card */}
        <div className="row mb-5">
          <div className="col-12">
            {proximaCita ? (
              <div className="next-appointment-card">
                <div className="next-appointment-header">
                  <h3 className="next-appointment-title">📅 Próxima Cita</h3>
                  <span className={`badge badge-appointment badge-${proximaCita.estado}`}>
                    {proximaCita.estado}
                  </span>
                </div>
                <div className="next-appointment-body">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h4 className="appointment-procedure">{proximaCita.procedimiento}</h4>
                      <div className="appointment-details">
                        <div className="appointment-detail">
                          <span className="detail-icon">📆</span>
                          <span>{proximaCita.fecha.split('T')[0]}</span>
                        </div>
                        <div className="appointment-detail">
                          <span className="detail-icon">⏰</span>
                          <span>{formatHora(proximaCita.hora)}</span>
                        </div>
                        <div className="appointment-detail">
                          <span className="detail-icon">👨‍⚕️</span>
                          <span>{proximaCita.odontologo || 'Por asignar'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 text-md-end">
                      <div className="appointment-countdown">
                        <p className="countdown-label">Días restantes</p>
                        <p className="countdown-number">
                          {Math.ceil((new Date(proximaCita.fecha) - hoy) / (1000 * 60 * 60 * 24))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-appointments-card">
                <div className="no-appointments-icon">📅</div>
                <h3 className="no-appointments-title">No tienes citas próximas</h3>
                <p className="no-appointments-text">
                  Agenda tu próxima cita para continuar cuidando tu sonrisa
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Appointments Table */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="appointments-card">
              <div className="appointments-card-header">
                <h3 className="appointments-card-title">📋 Próximas Citas</h3>
                <button className="btn btn-primary btn-sm" onClick={handleDownloadPDF}>
                  📄 Descargar Historial PDF
                </button>
              </div>
              <div className="appointments-card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                {!error && citasFuturas.length === 0 ? (
                  <div className="no-data">
                    <span className="no-data-icon">📋</span>
                    <p className="no-data-text">No tienes próximas citas pendientes</p>
                  </div>
                ) : !error ? (
                  <div className="table-responsive">
                    <table className="table appointments-table">
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
                              <span className={`badge badge-status badge-${cita.estado}`}>
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

        {/* History Table */}
        <div className="row">
          <div className="col-12">
            <div className="history-card">
              <div className="history-card-header">
                <h3 className="history-card-title">📜 Historial de Atenciones</h3>
              </div>
              <div className="history-card-body">
                {historialCitas.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table history-table">
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
                              <span className={`badge badge-status badge-${cita.estado}`}>
                                {cita.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-data">
                    <span className="no-data-icon">📜</span>
                    <p className="no-data-text">No tienes atenciones previas registradas</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard