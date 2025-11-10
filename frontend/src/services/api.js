import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  setToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  },

  login: (email, password) => {
    return api.post('/auth/login', { email, password })
  },

  register: (userData) => {
    return api.post('/auth/register', userData)
  },

  getProfile: () => {
    return api.get('/auth/profile')
  },

  updateProfile: (updates) => {
    return api.put('/auth/profile', updates)
  },

  changePassword: (passwordData) => {
    return api.put('/auth/change-password', passwordData)
  }
}

// Snakes API
export const snakesAPI = {
  getSnakes: (params = {}) => {
    return api.get('/snakes', { params })
  },

  getSnakeById: (id) => {
    return api.get(`/snakes/${id}`)
  },

  identifySnake: (data) => {
    return api.post('/snakes/identify', data)
  },

  createSnake: (data) => {
    return api.post('/snakes', data)
  },

  updateSnake: (id, data) => {
    return api.put(`/snakes/${id}`, data)
  },

  deleteSnake: (id) => {
    return api.delete(`/snakes/${id}`)
  }
}

// Hospitals API
export const hospitalsAPI = {
  getHospitals: (params = {}) => {
    return api.get('/hospitals', { params })
  },

  getHospitalById: (id) => {
    return api.get(`/hospitals/${id}`)
  },

  findNearest: (params) => {
    return api.get('/hospitals/nearest', { params })
  },

  createHospital: (data) => {
    return api.post('/hospitals', data)
  },

  updateHospital: (id, data) => {
    return api.put(`/hospitals/${id}`, data)
  },

  deleteHospital: (id) => {
    return api.delete(`/hospitals/${id}`)
  }
}

// Emergencies API
export const emergenciesAPI = {
  createEmergency: (data) => {
    return api.post('/emergencies', data)
  },

  getEmergencies: (params = {}) => {
    return api.get('/emergencies', { params })
  },

  getEmergencyById: (id) => {
    return api.get(`/emergencies/${id}`)
  },

  updateStatus: (id, data) => {
    return api.put(`/emergencies/${id}/status`, data)
  },

  assignHospital: (id, hospitalId) => {
    return api.post(`/emergencies/${id}/assign-hospital`, { hospitalId })
  }
}

// Admin API
export const adminAPI = {
  getOverview: () => {
    return api.get('/admin/dashboard')
  },

  getUsers: (params = {}) => {
    return api.get('/admin/users', { params })
  },

  createUser: (data) => {
    return api.post('/admin/users', data)
  },

  updateUser: (id, data) => {
    return api.put(`/admin/users/${id}`, data)
  },

  deleteUser: (id) => {
    return api.delete(`/admin/users/${id}`)
  },

  getEmergencyReports: (params = {}) => {
    return api.get('/admin/emergencies', { params })
  },

  updateEmergencyStatus: (id, data) => {
    return api.put(`/admin/emergencies/${id}/status`, data)
  },

  getHospitalAnalytics: (params = {}) => {
    return api.get('/admin/analytics/hospitals', { params })
  },

  getSystemHealth: () => {
    return api.get('/admin/system/health')
  },

  getAuditLogs: (params = {}) => {
    return api.get('/admin/audit-logs', { params })
  }
}

export default api