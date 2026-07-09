import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import api, { 
  getAllCitas, 
  createCita, 
  getAllUsuarios, 
  deleteCita, 
  updateCita,
  editCita,
} from "../services/api";

function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [citas, setCitas] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [citaEditando, setCitaEditando] = useState(null)
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

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
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
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="text-danger fw-bold">Panel de Administración</h1>
              <p className="text-muted mb-0">Gestión completa del sistema</p>
            </div>
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
                  <p><strong>Rol:</strong> {user.rol || 'admin'}</p>
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
                <strong>✓ Sesión activa (Admin)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Todas las Citas</h5>
              <button                
                  className="btn btn-light btn-sm" 
                  onClick={() => { 
                    setCitaEditando(null);
                    setFormData({ fecha: '', hora: '', usuario_id: '', odontologo: '', procedimiento: '' });
                    setShowModal(true); 
                  }}
                >
                  Crear Cita
                </button>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {!error && citas.length === 0 ? (
                <div className="alert alert-info" role="alert">
                  <strong>No hay citas registradas.</strong>
                </div>
              ) : !error ? (
                <div className="table-responsive">
                  <table className="table table-striped">
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
                      {citas.map((cita) => (
                        <tr key={cita.id}>
                          <td>{cita.id}</td>
                          <td>{cita.fecha.split('T')[0]}</td>
                          <td>{formatHora(cita.hora)}</td>
                          <td>{obtenerNombrePaciente(cita.usuario_id)}</td>        
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
                          <td>
                            <div className="btn-group" role="group">
                              <button 
                                className="btn btn-sm btn-warning me-1" 
                                onClick={() => abrirEdicion(cita)}
                              >
                                ✏️
                              </button>
                              
                              {/* Botón para finalizar cita */}
                              {cita.estado !== 'finalizada' && cita.estado !== 'cancelada' && (
                                <button 
                                  className="btn btn-sm btn-info me-1 text-white" 
                                  onClick={() => handleUpdateEstado(cita.id, 'finalizada')}
                                  title="Finalizar Cita"
                                >
                                  📅✅
                                </button>
                              )}

                              {cita.estado !== 'confirmada' && cita.estado !== 'finalizada' && (
                                <button 
                                  className="btn btn-sm btn-success me-1" 
                                  onClick={() => handleUpdateEstado(cita.id, 'confirmada')}
                                >
                                  ✓
                                </button>
                              )}
                              <button 
                                className="btn btn-sm btn-danger" 
                                onClick={() => handleDelete(cita.id)}
                              >
                                🗑️
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

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{citaEditando ? "Editar Cita" : "Crear Nueva Cita"}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
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
                  <div className="modal-footer">
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