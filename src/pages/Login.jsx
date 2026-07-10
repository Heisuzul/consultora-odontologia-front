import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { getUsuarioActual } from '../services/api'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validación básica
    if (!formData.email || !formData.password) {
      setError('Por favor, complete todos los campos')
      setLoading(false)
      return
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, ingrese un email válido')
      setLoading(false)
      return
    }

    try {
      const API_URL = 'http://localhost:8000'
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.detail || 'Credenciales inválidas')
        return
      }

      // Guardar el token en localStorage
      localStorage.setItem('access_token', data.access_token)
      console.log('Token guardado en localStorage:', data.access_token)
      
      // Obtener usuario actual con rol real de la base de datos
      try {
        console.log('Llamando a getUsuarioActual()...')
        const usuarioActual = await getUsuarioActual()
        console.log('Datos recibidos del servidor:', usuarioActual)
        console.log('Tipo de datos:', typeof usuarioActual)
        console.log('Claves del objeto:', Object.keys(usuarioActual || {}))
        
        localStorage.setItem('user', JSON.stringify(usuarioActual))
        
        // Redirigir según el rol
        console.log('Rol del usuario:', usuarioActual.rol)
        if (usuarioActual.rol === 'admin') {
          console.log('Redirigiendo a /admin-dashboard')
          navigate('/admin-dashboard')
        } else {
          console.log('Redirigiendo a /dashboard')
          navigate('/dashboard')
        }
      } catch (err) {
        console.error('Error al obtener usuario actual:', err)
        console.error('Mensaje de error:', err.message)
        console.error('Status del error:', err.status)
        console.error('Datos del error:', err.data)
        console.error('Debe redirigir al login:', err.shouldRedirectToLogin)
        
        // Si el error indica que debe redirigir al login, limpiar localStorage y redirigir
        if (err.shouldRedirectToLogin) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.')
          setLoading(false)
          return
        }
        
        // Mostrar error al usuario
        setError(`Error al obtener datos del usuario: ${err.message}`)
        
        // Si falla, guardar el usuario del JWT y redirigir al dashboard normal
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/dashboard')
      }
      
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intente nuevamente.')
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
            <h1 className="auth-title">Bienvenido de nuevo</h1>
            <p className="auth-subtitle">Inicia sesión para acceder a tu cuenta</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo Electrónico
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
              <label htmlFor="password" className="form-label">
                Contraseña
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
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 auth-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : null}
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="auth-link">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
