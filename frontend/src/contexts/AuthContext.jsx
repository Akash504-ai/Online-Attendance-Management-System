import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../lib/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.me()
      if (response.success) {
        setUser(response.data)
      }
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    const response = await authAPI.login(credentials)
    if (response.success) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setUser(response.data.user)
      return response.data.user
    }
    throw new Error(response.message)
  }

  const signup = async (userData) => {
    const response = await authAPI.signup(userData)
    if (response.success) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setUser(response.data.user)
      return response.data.user
    }
    throw new Error(response.message)
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    }
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
