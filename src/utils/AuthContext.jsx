// ============================================================
// AuthContext.jsx — Authentication & User State
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react'
import { getUserByEmail, getUserById, saveUser, generateId, MOCK_USERS } from '../data/DATA.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('lf_session')
    if (stored) {
      try {
        const { userId } = JSON.parse(stored)
        const found = getUserById(userId)
        if (found) {
          const { password: _, ...safe } = found
          setUser(safe)
        }
      } catch {}
    }
    setLoading(false)
  }, [])

  async function login(email, password) {
    await delay(300)
    const found = getUserByEmail(email)
    if (!found) return { error: 'No account found with that email.' }
    if (found.password !== password) return { error: 'Incorrect password.' }
    const { password: _, ...safe } = found
    setUser(safe)
    localStorage.setItem('lf_session', JSON.stringify({ userId: found.id }))
    return { user: safe }
  }

  async function register(name, email, password) {
    await delay(300)
    if (getUserByEmail(email)) return { error: 'An account with that email already exists.' }
    const newUser = {
      id: generateId('u'),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      avatar: name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      isAdmin: false,
      isSuperAdmin: false,
      enrolledCourses: [],
      ownedCourses: [],
      theme: 'dark',
      createdAt: new Date().toISOString(),
    }
    saveUser(newUser)
    const { password: _, ...safe } = newUser
    setUser(safe)
    localStorage.setItem('lf_session', JSON.stringify({ userId: newUser.id }))
    return { user: safe }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('lf_session')
  }

  // Call this after updating user data to refresh session
  function refreshUser() {
    if (!user?.id) return
    const fresh = getUserById(user.id)
    if (fresh) {
      const { password: _, ...safe } = fresh
      setUser(safe)
    }
  }

  // Update current user's profile fields
  function updateProfile(fields) {
    if (!user?.id) return
    const fresh = getUserById(user.id)
    if (!fresh) return
    const updated = { ...fresh, ...fields }
    saveUser(updated)
    const { password: _, ...safe } = updated
    setUser(safe)
  }

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, register, logout, refreshUser, updateProfile,
      isLoggedIn: !!user,
      isAdmin: !!user?.isAdmin,
      isSuperAdmin: !!user?.isSuperAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }
