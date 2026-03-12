// ============================================================
// AuthContext.jsx — Authentication State & Logic
// Simple localStorage-based auth. Replace with Cloudflare
// Workers + D1 or JWT tokens in production.
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react'
import { getUserByEmail, MOCK_USERS, generateId } from '../data/DATA.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('lf_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { /* ignore */ }
    }
    setLoading(false)
  }, [])

  /** Sign in with email + password */
  async function login(email, password) {
    // Simulate async API call
    await delay(400)
    const found = getUserByEmail(email)
    if (!found) return { error: 'No account found with that email.' }
    if (found.password !== password) return { error: 'Incorrect password.' }
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem('lf_user', JSON.stringify(safeUser))
    return { user: safeUser }
  }

  /** Register a new account */
  async function register(name, email, password, role = 'student') {
    await delay(400)
    if (getUserByEmail(email)) return { error: 'An account with that email already exists.' }
    const newUser = {
      id: generateId('u'),
      name,
      email,
      avatar: name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      role,
      enrolledCourses: [],
      ownedCourses: [],
      sharedCourses: [],
      createdAt: new Date().toISOString(),
    }
    // In real app: POST to Cloudflare Worker → D1 database
    MOCK_USERS.push({ ...newUser, password })
    setUser(newUser)
    localStorage.setItem('lf_user', JSON.stringify(newUser))
    return { user: newUser }
  }

  /** Sign out */
  function logout() {
    setUser(null)
    localStorage.removeItem('lf_user')
  }

  /** Refresh user data (after enrollment etc.) */
  function refreshUser() {
    const fresh = MOCK_USERS.find(u => u.id === user?.id)
    if (fresh) {
      const { password: _, ...safeUser } = fresh
      setUser(safeUser)
      localStorage.setItem('lf_user', JSON.stringify(safeUser))
    }
  }

  const isTeacher = user?.role === 'teacher'
  const isLoggedIn = !!user

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, isTeacher, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
