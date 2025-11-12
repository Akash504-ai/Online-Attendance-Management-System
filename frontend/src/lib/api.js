import axios from 'axios'

// 👇 Use your live backend (make sure it matches your latest Render URL)
const API_BASE_URL = 'https://online-attendance-management-system-2.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ Request interceptor — attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ Response interceptor — auto logout on 401
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

// 👇 Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login.php', credentials),
  signup: (userData) => api.post('/api/auth/signup.php', userData),
  logout: () => api.post('/api/auth/logout.php'),
  me: () => api.get('/api/auth/me.php'),
  forgotPassword: (email) => api.post('/api/auth/forgot-password.php', { email }),
  resetPassword: (data) => api.post('/api/auth/reset-password.php', data),
}

// 👇 User APIs
export const userAPI = {
  list: (params) => api.get('/api/users/list.php', { params }),
  get: (id) => api.get(`/api/users/get.php?id=${id}`),
  create: (data) => api.post('/api/users/create.php', data),
  update: (id, data) => api.put(`/api/users/update.php?id=${id}`, data),
  delete: (id) => api.delete(`/api/users/delete.php?id=${id}`),
}

// 👇 Attendance APIs
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

// 👇 Dashboard APIs
export const dashboardAPI = {
  stats: () => api.get('/api/dashboard/stats.php'),
}

// 👇 Subject APIs
export const subjectAPI = {
  list: (params) => api.get('/api/subjects/list.php', { params }),
  create: (data) => api.post('/api/subjects/create.php', data),
  update: (id, data) => api.put(`/api/subjects/update.php?id=${id}`, data),
  delete: (id) => api.delete(`/api/subjects/delete.php?id=${id}`),
}

// 👇 Department APIs
export const departmentAPI = {
  list: (params) => api.get('/api/departments/list.php', { params }),
  create: (data) => api.post('/api/departments/create.php', data),
  update: (id, data) => api.put(`/api/departments/update.php?id=${id}`, data),
  delete: (id) => api.delete(`/api/departments/delete.php?id=${id}`),
}

// 👇 Class APIs
export const classAPI = {
  list: (params) => api.get('/api/classes/list.php', { params }),
  create: (data) => api.post('/api/classes/create.php', data),
  update: (id, data) => api.put(`/api/classes/update.php?id=${id}`, data),
  delete: (id) => api.delete(`/api/classes/delete.php?id=${id}`),
}

export default api
