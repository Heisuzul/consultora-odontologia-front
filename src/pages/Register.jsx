import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    // Validación de campos obligatorios
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio')
      return false
    }

    if (!formData.apellido.trim()) {
      setError('El apellido es obligatorio')
      return false
    }

    if (!formData.email.trim()) {
      setError('El correo electrónico es obligatorio')
      return false
    }

    if (!formData.telefono.trim()) {
      setError('El número de teléfono es obligatorio')
      return false
    }

    if (!formData.password) {
      setError('La contraseña es obligatoria')
      return false
    }

    if (!formData.confirmPassword) {
      setError('Debe confirmar la contraseña')
      return false
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, ingrese un email válido')
      return false
    }

    // Validación de longitud de contraseña
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }

    // Validación de coincidencia de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return false
    }

    // Validación de teléfono (solo números)
    const phoneRegex = /^\d+$/
    if (!phoneRegex.test(formData.telefono)) {
      setError('El teléfono debe contener solo números')
      return false
    }

    if (formData.telefono.length < 7) {
      setError('El teléfono debe tener al menos 7 dígitos')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validar formulario
    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const API_URL = 'http://localhost:8000'
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        if (response.status === 409) {
          setError(data.detail || 'El correo o teléfono ya está registrado')
        } else {
          setError(data.detail || 'Error al registrar. Por favor, intente nuevamente.')
        }
        return
      }

      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.')
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        password: '',
        confirmPassword: ''
      })

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login')
      }, 2000)
      
    } catch (err) {
      setError('Error al registrar. Por favor, intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🦷</div>
            <h1 className="auth-title">Crear cuenta</h1>
            <p className="auth-subtitle">Regístrate para comenzar a cuidar tu sonrisa</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="nombre" className="form-label">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Juan"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="apellido" className="form-label">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Pérez"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo Electrónico *
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono" className="form-label">
                Número de Teléfono *
              </label>
              <input
                type="tel"
                className="form-control"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="1234567890"
                required
              />
              <small className="form-text text-muted">
                Solo números, sin código de país
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña *
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <small className="form-text text-muted">
                Mínimo 6 caracteres
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar Contraseña *
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 auth-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : null}
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="auth-link">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
