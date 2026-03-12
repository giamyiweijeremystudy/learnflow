// ============================================================
// DATA.js — LearnFlow Data Layer
// All data lives in localStorage — survives page refresh AND
// codebase updates (we never wipe existing lf_store data).
// ============================================================

export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

export const CATEGORIES = [
  'Mathematics', 'Computer Science', 'Science', 'History',
  'Language Arts', 'Art & Music', 'Social Studies', 'Health & PE',
]

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

// ─── PERSISTENT STORE ────────────────────────────────────────

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
  } catch (e) {
    // localStorage quota — base64 images can be large
    console.warn('LearnFlow: localStorage save failed', e)
  }
}

const ADMIN_SEED = {
  id: 'admin',
  name: 'Admin',
  email: 'admin@learnflow.app',
  password: 'potato',
  avatar: 'AD',
  isAdmin: true,
  isSuperAdmin: true,
  enrolledCourses: [],
  ownedCourses: [],
  favouriteCourses: [],
  theme: 'dark',
  createdAt: '2024-01-01T00:00:00Z',
}

function initStore() {
  return { users: [{ ...ADMIN_SEED }], courses: [] }
}

// Load existing or create fresh — NEVER wipes existing data
let STORE = loadStore() || initStore()

// ── Migration patches (run on every load, idempotent) ─────────
// Ensure admin account always exists and has correct flags
const adminIdx = STORE.users.findIndex(u => u.id === 'admin')
if (adminIdx === -1) {
  STORE.users.unshift({ ...ADMIN_SEED })
} else {
  STORE.users[adminIdx].isSuperAdmin = true
  STORE.users[adminIdx].isAdmin = true
  // ensure admin has all required fields
  if (!STORE.users[adminIdx].favouriteCourses) STORE.users[adminIdx].favouriteCourses = []
}
// Ensure all users have favouriteCourses field
STORE.users.forEach(u => { if (!u.favouriteCourses) u.favouriteCourses = [] })
// Ensure all courses have required fields
STORE.courses.forEach(c => {
  if (!c.editorIds) c.editorIds = [c.ownerId]
  if (!c.enrolledCount) c.enrolledCount = 0
  if (!c.modules) c.modules = []
  if (!c.tags) c.tags = []
})
saveStore(STORE)

// Expose by reference (read-only — always use helpers to mutate)
export const MOCK_USERS   = STORE.users
export const MOCK_COURSES = STORE.courses

// ─── USER HELPERS ─────────────────────────────────────────────

export function getUserByEmail(email) {
  return STORE.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null
}
export function getUserById(id) {
  return STORE.users.find(u => u.id === id) || null
}
export function getAllUsers() { return STORE.users }

export function saveUser(user) {
  const idx = STORE.users.findIndex(u => u.id === user.id)
  if (idx !== -1) STORE.users[idx] = user
  else STORE.users.push(user)
  saveStore(STORE)
}

export function grantAdmin(targetId) {
  const u = getUserById(targetId); if (!u) return
  u.isAdmin = true; saveUser(u)
}
export function revokeAdmin(targetId) {
  const u = getUserById(targetId); if (!u || u.isSuperAdmin) return
  u.isAdmin = false; saveUser(u)
}
export function deleteUser(userId) {
  const u = getUserById(userId); if (u?.isSuperAdmin) return
  STORE.users = STORE.users.filter(u => u.id !== userId)
  saveStore(STORE)
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
  if (user?.isAdmin) return STORE.courses
  return STORE.courses.filter(c => c.editorIds?.includes(userId))
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

// ─── UTILS ────────────────────────────────────────────────────

export function generateCourseCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  if (findCourseByCode(code)) return generateCourseCode()
  return code
}
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

// ─── FILE → BASE64 HELPER ─────────────────────────────────────
// Converts a File object to a base64 data URL for localStorage storage.
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
