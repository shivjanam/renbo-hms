import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (zustand persist)
    const authStorage = localStorage.getItem('hms-auth-storage')
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage)
        if (state?.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`
        }
      } catch (e) {
        console.error('Error parsing auth storage:', e)
      }
    }

    // Add hospital ID header if available
    const hospitalId = localStorage.getItem('hms-hospital-id')
    if (hospitalId) {
      config.headers['X-Hospital-Id'] = hospitalId
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const authStorage = localStorage.getItem('hms-auth-storage')
        if (authStorage) {
          const { state } = JSON.parse(authStorage)
          if (state?.refreshToken) {
            const response = await axios.post(
              `${API_BASE_URL}/api/v1/auth/refresh`,
              null,
              { params: { refreshToken: state.refreshToken } }
            )

            const { accessToken, refreshToken } = response.data.data

            // Update storage
            const newState = {
              ...state,
              accessToken,
              refreshToken,
            }
            localStorage.setItem('hms-auth-storage', JSON.stringify({ state: newState }))

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return api(originalRequest)
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect to login
        localStorage.removeItem('hms-auth-storage')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api

// API helper functions
export const apiGet = (url, config = {}) => api.get(url, config)
export const apiPost = (url, data, config = {}) => api.post(url, data, config)
export const apiPut = (url, data, config = {}) => api.put(url, data, config)
export const apiPatch = (url, data, config = {}) => api.patch(url, data, config)
export const apiDelete = (url, config = {}) => api.delete(url, config)
