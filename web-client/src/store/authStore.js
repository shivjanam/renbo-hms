import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Send OTP
      sendOtp: async (mobileNumber) => {
        set({ isLoading: true, error: null })
        try {
          await api.post('/api/v1/auth/otp/send', { mobileNumber })
          set({ isLoading: false })
          return { success: true }
        } catch (error) {
          set({ isLoading: false, error: error.response?.data?.error || 'Failed to send OTP' })
          return { success: false, error: error.response?.data?.error }
        }
      },

      // Login with OTP
      loginWithOtp: async (mobileNumber, otp) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post('/api/v1/auth/otp/verify', { mobileNumber, otp })
          const { accessToken, refreshToken, user } = response.data.data
          
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          
          return { success: true, user }
        } catch (error) {
          set({ isLoading: false, error: error.response?.data?.error || 'Login failed' })
          return { success: false, error: error.response?.data?.error }
        }
      },

      // Login with password
      loginWithPassword: async (identifier, password) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post('/api/v1/auth/login', {
            username: identifier,
            password,
          })
          const { accessToken, refreshToken, user } = response.data.data
          
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          
          return { success: true, user }
        } catch (error) {
          set({ isLoading: false, error: error.response?.data?.error || 'Login failed' })
          return { success: false, error: error.response?.data?.error }
        }
      },

      // Register
      register: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post('/api/v1/auth/register', data)
          const { accessToken, refreshToken, user } = response.data.data
          
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          
          return { success: true, user }
        } catch (error) {
          set({ isLoading: false, error: error.response?.data?.error || 'Registration failed' })
          return { success: false, error: error.response?.data?.error }
        }
      },

      // Refresh token
      refreshAccessToken: async () => {
        const { refreshToken } = get()
        if (!refreshToken) return false

        try {
          const response = await api.post('/api/v1/auth/refresh', null, {
            params: { refreshToken },
          })
          const { accessToken, refreshToken: newRefreshToken } = response.data.data
          
          set({ accessToken, refreshToken: newRefreshToken })
          return true
        } catch (error) {
          get().logout()
          return false
        }
      },

      // Logout
      logout: async () => {
        const { refreshToken } = get()
        try {
          if (refreshToken) {
            await api.post('/api/v1/auth/logout', null, {
              params: { refreshToken },
            })
          }
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          })
        }
      },

      // Update user
      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } })
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'hms-auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
