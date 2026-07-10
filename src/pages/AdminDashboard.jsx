import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Pie, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import api, { 
  getAllCitas, 
  createCita, 
  getAllUsuarios, 
  deleteCita, 
  updateCita,
  editCita,
} from "../services/api"

ChartJS.register(ArcElement, Tooltip, Legend);

function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [citas, setCitas] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [citaEditando, setCitaEditando] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState('overview')
  const [sortOrder, setSortOrder] = useState('desc')
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    usuario_id: '',
    odontologo: '',
    procedimiento: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')
    
    if (!token) {
      navigate('/login')
      return
    }

    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      if (parsedUser.rol !== 'admin') {
        navigate('/dashboard')
        return
      }
    }

    fetchCitas()
  }, [navigate])

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const usuarios = await getAllUsuarios()
        const pacientesFiltrados = usuarios.filter(usuario => usuario.rol === 'paciente')
        setPacientes(pacientesFiltrados)
      } catch (err) {
        console.error('Error al cargar pacientes:', err.message)
      }
    }
    fetchPacientes()
  }, [])

  const fetchCitas = async () => {
    try {
      const data = await getAllCitas()
      setCitas(data)
    } catch (err) {
      setError(err.message)
      console.error('Error al cargar citas:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const abrirEdicion = (cita) => {
    setCitaEditando(cita);
    setFormData({
      fecha: cita.fecha.split('T')[0],
      hora: cita.hora,
      usuario_id: cita.usuario_id,
      odontologo: cita.odontologo,
      procedimiento: cita.procedimiento,
      estado: cita.estado
    });
    setShowModal(true);
  };

  const handleCreateCita = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      if (citaEditando) {
        await editCita(citaEditando.id, formData)
      } else {
        await createCita(formData)
      }

      setShowModal(false)
      setCitaEditando(null)
      setFormData({
        fecha: '',
        hora: '',
        usuario_id: '',
        odontologo: '',
        procedimiento: ''
      })
      fetchCitas()    
    } catch (err) {
      setError(err.message)
      console.error('Error al guardar cita:', err.message)
    }
  }

  const obtenerNombrePaciente = (id) => {
    const paciente = pacientes.find(p => p.id === id);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : `ID: ${id || 'N/A'}`;
  };

  const formatHora = (hora24) => {
    if (!hora24) return "N/A";
    let [horas, minutos] = hora24.split(':');
    let ampm = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12 || 12;
    return `${horas}:${minutos} ${ampm}`;
  };

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const sortedCitas = [...citas].sort((a, b) => {
    const dateA = new Date(a.fecha)
    const dateB = new Date(b.fecha)
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
  })

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
  }

  const citasPorEstado = {
    pendiente: citas.filter(c => c.estado === 'pendiente').length,
    confirmada: citas.filter(c => c.estado === 'confirmada').length,
    finalizada: citas.filter(c => c.estado === 'finalizada').length,
    cancelada: citas.filter(c => c.estado === 'cancelada').length
  }

  const citasPorProcedimiento = citas.reduce((acc, cita) => {
    const procedimiento = cita.procedimiento || 'General'
    acc[procedimiento] = (acc[procedimiento] || 0) + 1
    return acc
  }, {})

  const estadoChartData = {
    labels: ['Pendiente', 'Confirmada', 'Finalizada', 'Cancelada'],
    datasets: [{
      data: [
        citasPorEstado.pendiente,
        citasPorEstado.confirmada,
        citasPorEstado.finalizada,
        citasPorEstado.cancelada
      ],
      backgroundColor: [
        '#f59e0b',
        '#10b981',
        '#0ea5e9',
        '#ef4444'
      ],
      borderWidth: 0
    }]
  }

  const procedimientoChartData = {
    labels: Object.keys(citasPorProcedimiento),
    datasets: [{
      data: Object.values(citasPorProcedimiento),
      backgroundColor: [
        '#0ea5e9',
        '#10b981',
        '#6366f1',
        '#f59e0b',
        '#ef4444',
        '#8b5cf6'
      ],
      borderWidth: 0
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8
      }
    }
  }

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    )
  }

  const handleUpdateEstado = async (id, nuevoEstado) => {
    try {
      await updateCita(id, { estado: nuevoEstado });
      fetchCitas();
    } catch (err) {
      alert("Error al actualizar: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta cita?")) {
      try {
        await deleteCita(id);
        fetchCitas();
      } catch (err) {
        alert("Error al eliminar: " + err.message);
      }
    }
  };

  return (
    <div className="admin-dashboard-page">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            <span className="sidebar-brand-text">Admin Panel</span>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`sidebar-nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span className="sidebar-nav-text">Resumen</span>
          </button>
          <button 
            className={`sidebar-nav-item ${activeSection === 'citas' ? 'active' : ''}`}
            onClick={() => setActiveSection('citas')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className="sidebar-nav-text">Citas</span>
          </button>
          <button 
            className={`sidebar-nav-item ${activeSection === 'pacientes' ? 'active' : ''}`}
            onClick={() => setActiveSection('pacientes')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span className="sidebar-nav-text">Pacientes</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-nav-item sidebar-logout" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span className="sidebar-nav-text">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`admin-main-content ${sidebarOpen ? 'content-with-sidebar' : 'content-full-width'}`}>
        <div className="container py-5">
          {/* Dashboard Header */}
          <div className="admin-dashboard-header mb-5">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1 className="admin-dashboard-title">Panel de Administración</h1>
                <p className="admin-dashboard-subtitle">Gestión completa del sistema</p>
              </div>
            </div>
          </div>

          {activeSection === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="row mb-5">
                <div className="col-md-3 mb-4">
                  <div className="admin-stat-card admin-stat-primary">
                    <div className="admin-stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <div className="admin-stat-content">
                      <h3 className="admin-stat-number">{citas.length}</h3>
                      <p className="admin-stat-label">Total Citas</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-4">
                  <div className="admin-stat-card admin-stat-success">
                    <div className="admin-stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div className="admin-stat-content">
                      <h3 className="admin-stat-number">{pacientes.length}</h3>
                      <p className="admin-stat-label">Pacientes</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-4">
                  <div className="admin-stat-card admin-stat-warning">
                    <div className="admin-stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <div className="admin-stat-content">
                      <h3 className="admin-stat-number">{citasPorEstado.pendiente}</h3>
                      <p className="admin-stat-label">Pendientes</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-4">
                  <div className="admin-stat-card admin-stat-info">
                    <div className="admin-stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                    </div>
                    <div className="admin-stat-content">
                      <h3 className="admin-stat-number">{citasPorEstado.finalizada}</h3>
                      <p className="admin-stat-label">Finalizadas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="row mb-5">
                <div className="col-md-6 mb-4">
                  <div className="admin-chart-card">
                    <div className="admin-chart-header">
                      <h3 className="admin-chart-title">Citas por Estado</h3>
                    </div>
                    <div className="admin-chart-body">
                      <div className="chart-container">
                        <Doughnut data={estadoChartData} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="admin-chart-card">
                    <div className="admin-chart-header">
                      <h3 className="admin-chart-title">Citas por Procedimiento</h3>
                    </div>
                    <div className="admin-chart-body">
                      <div className="chart-container">
                        <Pie data={procedimientoChartData} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'citas' && (
            <div className="row">
              <div className="col-12">
                <div className="admin-table-card">
                  <div className="admin-table-header">
                    <h3 className="admin-table-title">Gestión de Citas</h3>
                    <div className="admin-table-actions">
                      <button 
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={toggleSortOrder}
                        title={sortOrder === 'desc' ? 'Ordenar: Más recientes' : 'Ordenar: Más antiguas'}
                      >
                        {sortOrder === 'desc' ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <polyline points="19 12 12 19 5 12"></polyline>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                            <line x1="12" y1="19" x2="12" y2="5"></line>
                            <polyline points="5 12 12 5 19 12"></polyline>
                          </svg>
                        )}
                        {sortOrder === 'desc' ? 'Recientes' : 'Antiguas'}
                      </button>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => { 
                          setCitaEditando(null);
                          setFormData({ fecha: '', hora: '', usuario_id: '', odontologo: '', procedimiento: '' });
                          setShowModal(true); 
                        }}
                      >
                        Nueva Cita
                      </button>
                    </div>
                  </div>
                  <div className="admin-table-body">
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    {!error && citas.length === 0 ? (
                      <div className="admin-no-data">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <p className="admin-no-data-text">No hay citas registradas</p>
                      </div>
                    ) : !error ? (
                      <div className="table-responsive">
                        <table className="table admin-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Fecha</th>
                              <th>Hora</th>
                              <th>Paciente</th>
                              <th>Odontólogo</th>
                              <th>Procedimiento</th>
                              <th>Estado</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedCitas.map((cita) => (
                              <tr key={cita.id}>
                                <td>{cita.id}</td>
                                <td>{cita.fecha.split('T')[0]}</td>
                                <td>{formatHora(cita.hora)}</td>
                                <td>{obtenerNombrePaciente(cita.usuario_id)}</td>        
                                <td>{cita.odontologo || 'No asignado'}</td>
                                <td>{cita.procedimiento || 'General'}</td>
                                <td>
                                  <span className={`admin-badge admin-badge-${cita.estado}`}>
                                    {cita.estado || 'Pendiente'}
                                  </span>
                                </td>
                                <td>
                                  <div className="admin-action-buttons">
                                    <button 
                                      className="admin-btn admin-btn-edit"
                                      onClick={() => abrirEdicion(cita)}
                                      title="Editar"
                                    >
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                      </svg>
                                    </button>
                                    
                                    {cita.estado !== 'finalizada' && cita.estado !== 'cancelada' && (
                                      <button 
                                        className="admin-btn admin-btn-complete"
                                        onClick={() => handleUpdateEstado(cita.id, 'finalizada')}
                                        title="Finalizar"
                                      >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                      </button>
                                    )}

                                    {cita.estado !== 'confirmada' && cita.estado !== 'finalizada' && (
                                      <button 
                                        className="admin-btn admin-btn-confirm"
                                        onClick={() => handleUpdateEstado(cita.id, 'confirmada')}
                                        title="Confirmar"
                                      >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </svg>
                                      </button>
                                    )}
                                    <button 
                                      className="admin-btn admin-btn-delete"
                                      onClick={() => handleDelete(cita.id)}
                                      title="Eliminar"
                                    >
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                      </svg>
                                    </button>
                                  </div>
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
          )}

          {activeSection === 'pacientes' && (
            <div className="row">
              <div className="col-12">
                <div className="admin-table-card">
                  <div className="admin-table-header">
                    <h3 className="admin-table-title">Pacientes Registrados</h3>
                  </div>
                  <div className="admin-table-body">
                    {pacientes.length === 0 ? (
                      <div className="admin-no-data">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <p className="admin-no-data-text">No hay pacientes registrados</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table admin-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Nombre</th>
                              <th>Apellido</th>
                              <th>Email</th>
                              <th>Teléfono</th>
                              <th>Rol</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pacientes.map((paciente) => (
                              <tr key={paciente.id}>
                                <td>{paciente.id}</td>
                                <td>{paciente.nombre}</td>
                                <td>{paciente.apellido}</td>
                                <td>{paciente.correo}</td>
                                <td>{paciente.telefono}</td>
                                <td>
                                  <span className="admin-badge admin-badge-role">
                                    {paciente.rol}
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
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content admin-modal">
              <div className="modal-header admin-modal-header">
                <h5>{citaEditando ? "Editar Cita" : "Crear Nueva Cita"}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body admin-modal-body">
                <form onSubmit={handleCreateCita}>
                  <div className="mb-3">
                    <label htmlFor="fecha" className="form-label">Fecha</label>
                    <input type="date" className="form-control" id="fecha" name="fecha" value={formData.fecha} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="hora" className="form-label">Hora</label>
                    <input type="time" className="form-control" id="hora" name="hora" value={formData.hora} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="usuario_id" className="form-label">Paciente</label>
                    <select className="form-control" id="usuario_id" name="usuario_id" value={formData.usuario_id} onChange={handleInputChange} required>
                      <option value="">Seleccione un paciente</option>
                      {pacientes.map((paciente) => (
                        <option key={paciente.id} value={paciente.id}>
                          {paciente.nombre} {paciente.apellido}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="odontologo" className="form-label">Odontólogo</label>
                    <input type="text" className="form-control" id="odontologo" name="odontologo" value={formData.odontologo} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="procedimiento" className="form-label">Procedimiento</label>
                    <input type="text" className="form-control" id="procedimiento" name="procedimiento" value={formData.procedimiento} onChange={handleInputChange} required />
                  </div>
                  <div className="modal-footer admin-modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">{citaEditando ? "Guardar Cambios" : "Crear Cita"}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard