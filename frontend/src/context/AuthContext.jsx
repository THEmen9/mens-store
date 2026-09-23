import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  getCurrentUser,
  login as loginApi,
  register as registerApi,
} from '../api/auth.api'

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() =>
    localStorage.getItem('token')
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await getCurrentUser(token)
        setUser(response.data.user)
      } catch {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [token])
// login
  const login = async (credentials) => {
    const response = await loginApi(credentials)

    const { token, user } = response.data

    localStorage.setItem('token', token)
    setToken(token)
    setUser(user)

    return user
  }
// logout
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }
// register
  const register = async (userData) => {
    const response = await registerApi(userData)

    const { token, user } = response.data
    localStorage.setItem('token', token)
    setToken(token)
    setUser(user)

    return user
}

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}