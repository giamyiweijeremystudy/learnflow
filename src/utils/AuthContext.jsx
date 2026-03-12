// ============================================================
// AuthContext.jsx — Auth, Auto-login, Account Switching, Favourites
// Theme is stored per user profile and applied on login/switch/load
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react'
import { getUserByEmail, getUserById, saveUser, generateId } from '../data/DATA.js'

const AuthContext = createContext(null)

// ── Theme application (defined here so AuthContext can call it) ─
// Matches applyTheme in SettingsPage — keep in sync
const THEME_VARS = {
  dark:   { bg: '#07090F', bgSurface: '#0D1117', bgCard: '#111827', bgMuted: '#1E293B', brand: '#38BDF8', text: '#F1F5F9', textSec: '#94A3B8', textMuted: '#475569', border: '#1E2D40', borderLight: '#253347' },
  light:  { bg: '#F8FAFC', bgSurface: '#F1F5F9', bgCard: '#FFFFFF', bgMuted: '#E2E8F0', brand: '#0284C7', text: '#0F172A', textSec: '#475569', textMuted: '#94A3B8', border: '#E2E8F0', borderLight: '#CBD5E1' },
  ocean:  { bg: '#071520', bgSurface: '#0A1E2E', bgCard: '#0F2438', bgMuted: '#142d45', brand: '#22D3EE', text: '#E0F2FE', textSec: '#7DD3FC', textMuted: '#38BDF8', border: '#1a3a52', borderLight: '#1e4a68' },
  forest: { bg: '#071510', bgSurface: '#0A1E15', bgCard: '#0F2418', bgMuted: '#142d1e', brand: '#34D399', text: '#DCFCE7', textSec: '#6EE7B7', textMuted: '#34D399', border: '#1a3a24', borderLight: '#1e4a2c' },
  purple: { bg: '#0D0714', bgSurface: '#130A1E', bgCard: '#1A0F28', bgMuted: '#1e1230', brand: '#A78BFA', text: '#EDE9FE', textSec: '#C4B5FD', textMuted: '#A78BFA', border: '#2d1a50', borderLight: '#3d2468' },
  sunset: { bg: '#130A00', bgSurface: '#1E1000', bgCard: '#291600', bgMuted: '#331b00', brand: '#FB923C', text: '#FFF7ED', textSec: '#FED7AA', textMuted: '#FB923C', border: '#4a2800', borderLight: '#5a3400' },
}

export function applyUserTheme(themeName) {
  const t = THEME_VARS[themeName] || THEME_VARS.dark
  const r = document.documentElement
  r.style.setProperty('--bg', t.bg)
  r.style.setProperty('--bg-surface', t.bgSurface)
  r.style.setProperty('--bg-card', t.bgCard)
  r.style.setProperty('--bg-card-hover', t.bgCard)
  r.style.setProperty('--bg-muted', t.bgMuted)
  r.style.setProperty('--brand', t.brand)
  r.style.setProperty('--brand-dark', t.brand)
  r.style.setProperty('--brand-glow', t.brand + '22')
  r.style.setProperty('--text', t.text)
  r.style.setProperty('--text-secondary', t.textSec)
  r.style.setProperty('--text-muted', t.textMuted)
  r.style.setProperty('--border', t.border)
  r.style.setProperty('--border-light', t.borderLight)
}

// ── Linked accounts ────────────────────────────────────────────
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
        if (found) {
          const { password: _, ...safe } = found
          setUser(safe)
          applyUserTheme(found.theme || 'dark') // ← apply saved theme on auto-login
        }
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
    applyUserTheme(found.theme || 'dark') // ← apply saved theme on login
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
    applyUserTheme('dark')
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
    // If theme was updated, apply it immediately
    if (fields.theme) applyUserTheme(fields.theme)
  }

  function switchAccount(userId) {
    const f = getUserById(userId)
    if (!f) return false
    const { password: _, ...safe } = f
    setUser(safe)
    localStorage.setItem('lf_session', JSON.stringify({ userId: f.id }))
    addLinkedId(f.id)
    applyUserTheme(f.theme || 'dark') // ← apply that account's theme on switch
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
