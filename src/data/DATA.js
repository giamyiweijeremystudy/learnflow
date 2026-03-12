// ============================================================
// DATA.js — LearnFlow Data Layer
// All mock data, data models, and data access utilities.
// Replace these with real API calls / Cloudflare D1 / KV later.
// ============================================================

// ─── DATA MODELS ─────────────────────────────────────────────

/**
 * User Model
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} avatar  — initials or image URL
 * @property {'teacher'|'student'} role
 * @property {string[]} enrolledCourses  — course IDs
 * @property {string[]} ownedCourses     — course IDs (teachers only)
 * @property {string[]} sharedCourses    — course IDs (shared edit access)
 * @property {string} createdAt
 */

/**
 * Course Model
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} coverImage   — URL or placeholder key
 * @property {string} ownerId
 * @property {string[]} editorIds  — users with edit access
 * @property {'public'|'private'} visibility
 * @property {string} code         — 6-char join code
 * @property {string} category
 * @property {string} difficulty   — 'beginner'|'intermediate'|'advanced'
 * @property {Module[]} modules
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} enrolledCount
 * @property {string[]} tags
 */

/**
 * Module Model
 * @typedef {Object} Module
 * @property {string} id
 * @property {string} title
 * @property {Lesson[]} lessons
 * @property {number} order
 */

/**
 * Lesson Model
 * @typedef {Object} Lesson
 * @property {string} id
 * @property {string} title
 * @property {'text'|'image'|'video'|'quiz'|'questionnaire'|'interactive'} type
 * @property {Object} content      — varies by type
 * @property {number} order
 * @property {number} estimatedMinutes
 */

/**
 * Quiz/Question Model
 * @typedef {Object} Question
 * @property {string} id
 * @property {'multiple_choice'|'true_false'|'short_answer'|'fill_blank'} type
 * @property {string} prompt
 * @property {string[]} options    — for multiple choice
 * @property {string|number} answer
 * @property {string} explanation
 * @property {number} points
 */

// ─── MOCK DATA ────────────────────────────────────────────────

export const MOCK_USERS = [
  {
    id: 'u1',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    password: 'password123', // never do this in prod — use Cloudflare Workers auth
    avatar: 'AR',
    role: 'teacher',
    enrolledCourses: [],
    ownedCourses: ['c1', 'c2'],
    sharedCourses: [],
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'u2',
    name: 'Jamie Chen',
    email: 'jamie@example.com',
    password: 'password123',
    avatar: 'JC',
    role: 'student',
    enrolledCourses: ['c1'],
    ownedCourses: [],
    sharedCourses: [],
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'u3',
    name: 'Morgan Lee',
    email: 'morgan@example.com',
    password: 'password123',
    avatar: 'ML',
    role: 'teacher',
    enrolledCourses: [],
    ownedCourses: ['c3'],
    sharedCourses: ['c1'],
    createdAt: '2024-01-20T10:00:00Z',
  },
]

export const MOCK_COURSES = [
  {
    id: 'c1',
    title: 'Introduction to Calculus',
    description: 'Build strong foundations in differential and integral calculus through interactive problems and visual explanations.',
    coverImage: 'math',
    ownerId: 'u1',
    editorIds: ['u1', 'u3'],
    visibility: 'public',
    code: 'CALC01',
    category: 'Mathematics',
    difficulty: 'intermediate',
    enrolledCount: 234,
    tags: ['calculus', 'math', 'derivatives', 'integrals'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
    modules: [
      {
        id: 'm1',
        title: 'Limits & Continuity',
        order: 1,
        lessons: [
          {
            id: 'l1',
            title: 'What is a Limit?',
            type: 'text',
            estimatedMinutes: 10,
            order: 1,
            content: {
              body: 'A limit describes the value that a function approaches as the input approaches some value...',
              imageUrl: null,
            },
          },
          {
            id: 'l2',
            title: 'Limits Quiz',
            type: 'quiz',
            estimatedMinutes: 15,
            order: 2,
            content: {
              questions: [
                {
                  id: 'q1',
                  type: 'multiple_choice',
                  prompt: 'What is lim(x→2) of x²?',
                  options: ['2', '4', '8', 'undefined'],
                  answer: 1,
                  explanation: 'Simply substitute x=2: 2² = 4',
                  points: 10,
                },
              ],
            },
          },
        ],
      },
      {
        id: 'm2',
        title: 'Derivatives',
        order: 2,
        lessons: [
          {
            id: 'l3',
            title: 'The Power Rule',
            type: 'text',
            estimatedMinutes: 12,
            order: 1,
            content: { body: 'The power rule states that d/dx[xⁿ] = nxⁿ⁻¹...' },
          },
        ],
      },
    ],
  },
  {
    id: 'c2',
    title: 'Python for Beginners',
    description: 'Learn programming from scratch with hands-on Python exercises. No prior experience needed.',
    coverImage: 'code',
    ownerId: 'u1',
    editorIds: ['u1'],
    visibility: 'public',
    code: 'PY101',
    category: 'Computer Science',
    difficulty: 'beginner',
    enrolledCount: 512,
    tags: ['python', 'programming', 'beginner', 'coding'],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z',
    modules: [
      {
        id: 'm3',
        title: 'Getting Started',
        order: 1,
        lessons: [
          {
            id: 'l4',
            title: 'Variables & Data Types',
            type: 'text',
            estimatedMinutes: 8,
            order: 1,
            content: { body: 'Variables store data values. In Python, a variable is created the moment you first assign a value to it...' },
          },
        ],
      },
    ],
  },
  {
    id: 'c3',
    title: 'World History: Ancient Civilizations',
    description: 'Explore the rise and fall of the world\'s greatest ancient empires through rich multimedia content.',
    coverImage: 'history',
    ownerId: 'u3',
    editorIds: ['u3'],
    visibility: 'private',
    code: 'HIST42',
    category: 'History',
    difficulty: 'beginner',
    enrolledCount: 78,
    tags: ['history', 'ancient', 'civilizations', 'egypt', 'rome'],
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-02-28T10:00:00Z',
    modules: [],
  },
]

export const CATEGORIES = [
  'Mathematics',
  'Computer Science',
  'Science',
  'History',
  'Language Arts',
  'Art & Music',
  'Social Studies',
  'Health & PE',
]

export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

// ─── DATA ACCESS UTILITIES ────────────────────────────────────

/** Get all public courses */
export function getPublicCourses() {
  return MOCK_COURSES.filter(c => c.visibility === 'public')
}

/** Search public courses by query string */
export function searchCourses(query) {
  const q = query.toLowerCase().trim()
  if (!q) return getPublicCourses()
  return MOCK_COURSES.filter(c => {
    if (c.visibility !== 'public') return false
    return (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    )
  })
}

/** Find course by join code (public or private) */
export function findCourseByCode(code) {
  return MOCK_COURSES.find(c => c.code.toUpperCase() === code.toUpperCase()) || null
}

/** Get course by ID */
export function getCourseById(id) {
  return MOCK_COURSES.find(c => c.id === id) || null
}

/** Get courses owned by a user */
export function getCoursesByOwner(userId) {
  return MOCK_COURSES.filter(c => c.ownerId === userId)
}

/** Get courses a user has edit access to */
export function getEditableCourses(userId) {
  return MOCK_COURSES.filter(c => c.editorIds.includes(userId))
}

/** Check if user can edit a course */
export function canEditCourse(userId, courseId) {
  const course = getCourseById(courseId)
  if (!course) return false
  return course.editorIds.includes(userId)
}

/** Get user by email */
export function getUserByEmail(email) {
  return MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || null
}

/** Get user by ID */
export function getUserById(id) {
  return MOCK_USERS.find(u => u.id === id) || null
}

/** Generate a unique 6-char course code */
export function generateCourseCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

/** Generate a simple unique ID */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

/** Get cover gradient/theme for course by coverImage key */
export const COVER_THEMES = {
  math:    { from: '#1e3a5f', to: '#0ea5e9', icon: '∑', label: 'Mathematics' },
  code:    { from: '#1a1a2e', to: '#7c3aed', icon: '</>', label: 'Code' },
  history: { from: '#3d1a00', to: '#d97706', icon: '🏛', label: 'History' },
  science: { from: '#0d2d1f', to: '#10b981', icon: '⚗', label: 'Science' },
  art:     { from: '#2d0d2d', to: '#ec4899', icon: '🎨', label: 'Art' },
  language:{ from: '#0d1a2d', to: '#3b82f6', icon: 'Aa', label: 'Language' },
  default: { from: '#1a1a2e', to: '#38bdf8', icon: '📚', label: 'Course' },
}

export function getCoverTheme(key) {
  return COVER_THEMES[key] || COVER_THEMES.default
}
