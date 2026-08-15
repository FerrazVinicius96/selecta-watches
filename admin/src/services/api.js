import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Injeta token JWT no header de todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Redireciona para login se receber 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (username, password) =>
    api.post('/api/admin/login', { username, password }),
}

export const watchesAPI = {
  listAll: () => api.get('/api/admin/watches'),
  create: (data) => api.post('/api/admin/watches', data),
  update: (id, data) => api.put(`/api/admin/watches/${id}`, data),
  delete: (id) => api.delete(`/api/admin/watches/${id}`),
}

export const leadsAPI = {
  list: () => api.get('/api/admin/leads'),
}

export default api
