// ============================================================
// DATA.js — LearnFlow Data Layer
// ============================================================

// ─── CONSTANTS ───────────────────────────────────────────────

export const CATEGORIES = [
  'Mathematics', 'Computer Science', 'Science', 'History',
  'Language Arts', 'Art & Music', 'Social Studies', 'Health & PE',
]

export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

export const COVER_THEMES = {
  math:    { from: '#1e3a5f', to: '#0ea5e9', icon: '∑',   label: 'Mathematics' },
  code:    { from: '#1a1a2e', to: '#7c3aed', icon: '</>',  label: 'Code' },
  history: { from: '#3d1a00', to: '#d97706', icon: '🏛',   label: 'History' },
  science: { from: '#0d2d1f', to: '#10b981', icon: '⚗',   label: 'Science' },
  art:     { from: '#2d0d2d', to: '#ec4899', icon: '🎨',   label: 'Art' },
  language:{ from: '#0d1a2d', to: '#3b82f6', icon: 'Aa',  label: 'Language' },
  default: { from: '#1a1a2e', to: '#38bdf8', icon: '📚',  label: 'Course' },
}

export function getCoverTheme(key) {
  return COVER_THEMES[key] || COVER_THEMES.default
}

// ─── THEMES ──────────────────────────────────────────────────

export const APP_THEMES = {
  dark:  { label: 'Dark',  bg: '#07090F' },
  light: { label: 'Light', bg: '#F8FAFC' },
  ocean: { label: 'Ocean', bg: '#071520' },
  forest:{ label: 'Forest',bg: '#071510' },
}

// ─── PERSISTENT STORE ────────────────────────────────────────
// Uses localStorage so data survives page refresh.
// In production, replace with Cloudflare D1 API calls.

function loadStore() {
  try {
    const raw = localStorage.getItem('lf_store')
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveStore(store) {
  try {
    localStorage.setItem('lf_store', JSON.stringify(store))
  } catch {}
}

function initStore() {
  // Seed with only the admin account, no preset courses
  return {
    users: [
      {
        id: 'admin',
        name: 'Admin',
        email: 'admin@learnflow.app',
        password: 'potato',
        avatar: 'AD',
        isAdmin: true,
        isSuperAdmin: true, // the original — cannot be demoted
        enrolledCourses: [],
        ownedCourses: [],
        theme: 'dark',
        createdAt: '2024-01-01T00:00:00Z',
      },
    ],
    courses: [],
  }
}

// Load or initialise
let STORE = loadStore() || initStore()

// If store exists but is missing isSuperAdmin on the original admin, patch it
if (STORE.users) {
  const admin = STORE.users.find(u => u.id === 'admin')
  if (admin) {
    admin.isSuperAdmin = true
    admin.isAdmin = true
  }
  saveStore(STORE)
}

// Expose arrays by reference for legacy reads — always use helpers to write
export const MOCK_USERS    = STORE.users
export const MOCK_COURSES  = STORE.courses

// ─── USER HELPERS ─────────────────────────────────────────────

export function getUserByEmail(email) {
  return STORE.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null
}

export function getUserById(id) {
  return STORE.users.find(u => u.id === id) || null
}

export function getAllUsers() {
  return STORE.users
}

export function saveUser(user) {
  const idx = STORE.users.findIndex(u => u.id === user.id)
  if (idx !== -1) STORE.users[idx] = user
  else STORE.users.push(user)
  saveStore(STORE)
}

export function grantAdmin(targetId) {
  const user = getUserById(targetId)
  if (!user) return
  user.isAdmin = true
  saveUser(user)
}

export function revokeAdmin(targetId) {
  const user = getUserById(targetId)
  if (!user || user.isSuperAdmin) return // original admin is untouchable
  user.isAdmin = false
  saveUser(user)
}

// ─── COURSE HELPERS ───────────────────────────────────────────

export function getCourseById(id) {
  return STORE.courses.find(c => c.id === id) || null
}

export function getPublicCourses() {
  return STORE.courses.filter(c => c.visibility === 'public')
}

export function searchCourses(query) {
  const q = query.toLowerCase().trim()
  if (!q) return getPublicCourses()
  return STORE.courses.filter(c => {
    if (c.visibility !== 'public') return false
    return (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.tags || []).some(t => t.toLowerCase().includes(q))
    )
  })
}

export function findCourseByCode(code) {
  return STORE.courses.find(c => c.code.toUpperCase() === code.toUpperCase()) || null
}

export function getEditableCourses(userId) {
  const user = getUserById(userId)
  if (user?.isAdmin) return STORE.courses // admins see all
  return STORE.courses.filter(c => c.editorIds.includes(userId))
}

export function saveCourse(course) {
  const idx = STORE.courses.findIndex(c => c.id === course.id)
  if (idx !== -1) STORE.courses[idx] = course
  else STORE.courses.push(course)
  saveStore(STORE)
}

export function deleteCourse(courseId) {
  STORE.courses = STORE.courses.filter(c => c.id !== courseId)
  saveStore(STORE)
}

export function deleteUser(userId) {
  const user = getUserById(userId)
  if (user?.isSuperAdmin) return // cannot delete original admin
  STORE.users = STORE.users.filter(u => u.id !== userId)
  saveStore(STORE)
}

// ─── UTILS ────────────────────────────────────────────────────

export function generateCourseCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  // ensure unique
  if (findCourseByCode(code)) return generateCourseCode()
  return code
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}
