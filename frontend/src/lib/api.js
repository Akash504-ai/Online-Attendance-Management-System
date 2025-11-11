import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/Trackify/backend'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error.message)
  }
)

// Auth APIs - using direct file paths (no .htaccess rewriting)
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login.php', credentials),
  signup: (userData) => api.post('/api/auth/signup.php', userData),
  logout: () => api.post('/api/auth/logout.php'),
  me: () => api.get('/api/auth/me.php'),
  forgotPassword: (email) => api.post('/api/auth/forgot-password.php', { email }),
  resetPassword: (data) => api.post('/api/auth/reset-password.php', data),
}

// User APIs - using direct file paths (no .htaccess rewriting)
export const userAPI = {
  list: (params) => api.get('/api/users/list.php', { params }),
  get: (id) => api.get(`/api/users/get.php?id=${id}`),
  create: (data) => api.post('/api/users/create.php', data),
  update: (id, data) => api.put(`/api/users/update.php?id=${id}`, data),
  delete: (id) => api.delete(`/api/users/delete.php?id=${id}`),
}

// Attendance APIs - using direct file paths (no .htaccess rewriting)
export const attendanceAPI = {
  list: (params) => api.get('/api/attendance/list.php', { params }),
  get: (id) => api.get(`/api/attendance/get.php?id=${id}`),
  mark: (data) => api.post('/api/attendance/mark.php', data),
  bulk: (data) => api.post('/api/attendance/bulk.php', data),
  update: (id, data) => api.put(`/api/attendance/update.php?id=${id}`, data),
  delete: (id) => api.delete(`/api/attendance/delete.php?id=${id}`),
  stats: (params) => api.get('/api/attendance/stats.php', { params }),
  report: (params) => api.get('/api/attendance/report.php', { params }),
}

// Dashboard APIs - using direct file paths (no .htaccess rewriting)
export const dashboardAPI = {
  stats: () => api.get('/api/dashboard/stats.php'),
}

// Subject APIs
export const subjectAPI = {
  list: (params) => api.get('/api/subjects', { params }),
  create: (data) => api.post('/api/subjects', data),
  update: (id, data) => api.put(`/api/subjects/${id}`, data),
  delete: (id) => api.delete(`/api/subjects/${id}`),
}

// Department APIs
export const departmentAPI = {
  list: (params) => api.get('/api/departments', { params }),
  create: (data) => api.post('/api/departments', data),
  update: (id, data) => api.put(`/api/departments/${id}`, data),
  delete: (id) => api.delete(`/api/departments/${id}`),
}

// Class APIs
export const classAPI = {
  list: (params) => api.get('/api/classes', { params }),
  create: (data) => api.post('/api/classes', data),
  update: (id, data) => api.put(`/api/classes/${id}`, data),
  delete: (id) => api.delete(`/api/classes/${id}`),
}

export default api
