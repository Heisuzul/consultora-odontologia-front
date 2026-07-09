const API_BASE_URL = 'http://localhost:8000'

/**
 * Cliente HTTP centralizado.
 * Añade automáticamente Authorization: Bearer <token> si existe en localStorage.
 */
async function request(endpoint, options = {}) {
  const { auth = true, headers = {}, ...fetchOptions } = options

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  }

  if (auth) {
    const token = localStorage.getItem('access_token')
    if (!token) {
      const error = new Error('No hay token de autenticación. Por favor, inicia sesión.')
      error.status = 401
      error.shouldRedirectToLogin = true
      throw error
    }
    requestHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: requestHeaders,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(
      typeof data?.detail === 'string'
        ? data.detail
        : 'Error en la petición al servidor'
    )
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export async function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({ email, password }),
  })
}

export async function getCitas() {
  return request('/citas/mis-citas')
}

export async function createCita(citaData) {
  return request('/citas/', {
    method: 'POST',
    body: JSON.stringify(citaData),
  })
}

export async function getUsuarioActual() {
  return request('/usuarios/me')
}

export async function getAllCitas() {
  return request('/citas/')
}

export async function getAllUsuarios() {
  return request('/usuarios/')
}

export async function deleteCita(id) {
  return request(`/citas/${id}`, {
    method: 'DELETE',
  })
}

export async function updateCita(id, citaData) {
  return request(`/citas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(citaData),
  })
}

export async function editCita(id, citaData) {
  return request(`/citas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(citaData),
  })
}

export default {
  login,
  getCitas,
  createCita,
  getUsuarioActual,
  getAllCitas,
  getAllUsuarios,
  deleteCita,
  updateCita,
  editCita,
}