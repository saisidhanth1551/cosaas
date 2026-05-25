import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Attempt session hydration on boot
    const hydrateSession = async () => {
      const savedToken = localStorage.getItem('cosaas_token')
      
      if (!savedToken) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${savedToken}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
          setToken(savedToken)
        } else {
          // Token expired or invalid
          console.warn('Session expired. Logging out.')
          localStorage.removeItem('cosaas_token')
        }
      } catch (err) {
        console.error('Failed to verify session on startup:', err)
      } finally {
        setLoading(false)
      }
    }

    hydrateSession()
  }, [])

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || 'Authentication failed' }
      }

      // Store in state & storage
      setUser(data.user)
      setToken(data.token)
      localStorage.setItem('cosaas_token', data.token)
      return { success: true }
    } catch (err) {
      console.error('Network error during login:', err)
      return { success: false, error: 'Connection failed. Is the server running?' }
    }
  }

  // Logout handler
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('cosaas_token')
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role?.toLowerCase() === 'admin',
    isManager: user?.role?.toLowerCase() === 'branch manager' || user?.role?.toLowerCase() === 'manager',
    isReceptionist: user?.role?.toLowerCase() === 'receptionist'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
