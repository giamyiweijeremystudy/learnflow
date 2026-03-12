// ============================================================
// AuthContext.jsx — Auth, Auto-login, Account Switching, Favourites
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react'
import { getUserByEmail, getUserById, saveUser, generateId } from '../data/DATA.js'

const AuthContext = createContext(null)

function getLinkedIds() {
  try { return JSON.parse(localStorage.getItem('lf_linked') || '[]') } catch { return [] }
}
function addLinkedId(id) {
  const ids = getLinkedIds()
  if (!ids.includes(id)) ids.push(id)
  localStorage.setItem('lf_linked', JSON.stringify(ids))
}
function removeLinkedId(id) {
  localStorage.setItem('lf_linked', JSON.stringify(getLinkedIds().filter(x => x !== id)))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lf_session')
      if (stored) {
        const { userId } = JSON.parse(stored)
        const found = getUserById(userId)
        if (found) { const { password: _, ...s } = found; setUser(s) }
      }
    } catch {}
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
    addLinkedId(found.id)
    return { user: safe }
  }

  async function register(name, email, password) {
    await delay(300)
    if (getUserByEmail(email)) return { error: 'An account with that email already exists.' }
    const nu = {
      id: generateId('u'), name: name.trim(),
      email: email.toLowerCase().trim(), password,
      avatar: name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      isAdmin: false, isSuperAdmin: false,
      enrolledCourses: [], ownedCourses: [], favouriteCourses: [],
      theme: 'dark', createdAt: new Date().toISOString(),
    }
    saveUser(nu)
    const { password: _, ...safe } = nu
    setUser(safe)
    localStorage.setItem('lf_session', JSON.stringify({ userId: nu.id }))
    addLinkedId(nu.id)
    return { user: safe }
  }

  function logout() { setUser(null); localStorage.removeItem('lf_session') }

  function refreshUser() {
    if (!user?.id) return
    const f = getUserById(user.id)
    if (f) { const { password: _, ...s } = f; setUser(s) }
  }

  function updateProfile(fields) {
    if (!user?.id) return
    const f = getUserById(user.id)
    if (!f) return
    const up = { ...f, ...fields }
    saveUser(up)
    const { password: _, ...safe } = up
    setUser(safe)
  }

  function switchAccount(userId) {
    const f = getUserById(userId)
    if (!f) return false
    const { password: _, ...safe } = f
    setUser(safe)
    localStorage.setItem('lf_session', JSON.stringify({ userId: f.id }))
    addLinkedId(f.id)
    return true
  }

  function unlinkAccount(userId) { removeLinkedId(userId) }

  function getLinkedAccountObjects() {
    return getLinkedIds()
      .filter(id => id !== user?.id)
      .map(id => getUserById(id)).filter(Boolean)
      .map(u => { const { password: _, ...s } = u; return s })
  }

  function toggleFavourite(courseId) {
    if (!user?.id) return
    const f = getUserById(user.id)
    if (!f) return
    const favs = f.favouriteCourses || []
    const next = favs.includes(courseId) ? favs.filter(id => id !== courseId) : [courseId, ...favs]
    const up = { ...f, favouriteCourses: next }
    saveUser(up)
    const { password: _, ...safe } = up
    setUser(safe)
  }

  function isFavourite(courseId) { return (user?.favouriteCourses || []).includes(courseId) }

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, refreshUser, updateProfile,
      switchAccount, unlinkAccount, getLinkedAccountObjects,
      toggleFavourite, isFavourite,
      isLoggedIn: !!user, isAdmin: !!user?.isAdmin, isSuperAdmin: !!user?.isSuperAdmin,
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
