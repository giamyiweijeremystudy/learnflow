// ============================================================
// App.jsx — Root Application + Router
// ============================================================

import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './utils/AuthContext.jsx'
import { GLOBAL_CSS, COMPONENT_STYLES, LAYOUT_STYLES } from './styles/GRAPHICS.js'
import { getCourseById } from './data/DATA.js'

// Pages
import AuthPage from './pages/AuthPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ExplorePage from './pages/ExplorePage.jsx'
import CourseView from './pages/CourseView.jsx'
import CourseEditor from './pages/CourseEditor.jsx'
import TeachPage from './pages/TeachPage.jsx'

// Components
import Sidebar from './components/Sidebar.jsx'
import { Icon } from './components/UI.jsx'

// ── Spinner ───────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite', color: 'var(--brand)' }}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeOpacity="0.25" />
        <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}

// ── Route Guards ──────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()
  if (loading) return <Spinner />
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return children
}

function TeacherRoute({ children }) {
  const { isTeacher, isLoggedIn, loading } = useAuth()
  if (loading) return <Spinner />
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (!isTeacher) return <Navigate to="/dashboard" replace />
  return children
}

// ── App Shell ─────────────────────────────────────────────────
function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      {children}
    </div>
  )
}

// ── Inline Pages (simple) ─────────────────────────────────────
function ProfilePage() {
  const { user } = useAuth()
  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Profile ✦</h1>
      </div>
      <div className="content-area">
        <div className="card animate-fade-in" style={{ padding: 28, maxWidth: 480 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brand), var(--accent1))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: 700, color: '#07090F',
            }}>{user?.avatar}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{user?.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user?.email}</div>
              <div style={{ marginTop: 6 }}>
                <span className="badge badge-brand" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {[
              ['Member since', new Date(user?.createdAt).toLocaleDateString('en-SG', { year: 'numeric', month: 'long' })],
              ['Enrolled courses', user?.enrolledCourses?.length || 0],
              user?.role === 'teacher' ? ['Courses created', user?.ownedCourses?.length || 0] : null,
            ].filter(Boolean).map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span>{label}</span>
                <span style={{ color: 'var(--text)', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Settings ✦</h1>
        <p className="page-subtitle">Manage your account preferences.</p>
      </div>
      <div className="content-area">
        <div className="card animate-fade-in" style={{ padding: 24, maxWidth: 480 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Icon name="settings" size={20} style={{ color: 'var(--brand)' }} />
            <span style={{ fontWeight: 600 }}>Account Settings</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Full settings — notifications, themes, and privacy — coming in the next update.
          </p>
        </div>
      </div>
    </div>
  )
}

function MyCoursesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const courses = (user?.enrolledCourses || []).map(id => getCourseById(id)).filter(Boolean)

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">My Courses ✦</h1>
        <p className="page-subtitle">Courses you're currently enrolled in.</p>
      </div>
      <div className="content-area">
        {courses.length === 0 ? (
          <div className="empty-state animate-fade-in">
            <div className="empty-state-icon"><Icon name="book" size={28} /></div>
            <h3>No enrollments yet</h3>
            <p>Explore public courses or enter a code to join one.</p>
            <button className="btn btn-primary" onClick={() => navigate('/explore')}>
              <Icon name="search" size={16} /> Explore Courses
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {courses.map(course => (
              <div key={course.id} className="course-card" onClick={() => navigate(`/course/${course.id}`)}>
                <div className="course-card-body">
                  <div className="course-card-title">{course.title}</div>
                  <div className="course-card-desc">{course.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Root App ──────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS + COMPONENT_STYLES + LAYOUT_STYLES }} />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

function AppRoutes() {
  const { isLoggedIn, loading } = useAuth()
  if (loading) return <Spinner />

  return (
    <Routes>
      <Route path="/login"    element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" />} />
      <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <AuthPage mode="register" />} />

      <Route path="/dashboard"  element={<ProtectedRoute><AppShell><Dashboard /></AppShell></ProtectedRoute>} />
      <Route path="/explore"    element={<ProtectedRoute><AppShell><ExplorePage /></AppShell></ProtectedRoute>} />
      <Route path="/my-courses" element={<ProtectedRoute><AppShell><MyCoursesPage /></AppShell></ProtectedRoute>} />
      <Route path="/course/:id" element={<ProtectedRoute><AppShell><CourseView /></AppShell></ProtectedRoute>} />
      <Route path="/profile"    element={<ProtectedRoute><AppShell><ProfilePage /></AppShell></ProtectedRoute>} />
      <Route path="/settings"   element={<ProtectedRoute><AppShell><SettingsPage /></AppShell></ProtectedRoute>} />

      <Route path="/teach"          element={<TeacherRoute><AppShell><TeachPage /></AppShell></TeacherRoute>} />
      <Route path="/teach/new"      element={<TeacherRoute><AppShell><CourseEditor /></AppShell></TeacherRoute>} />
      <Route path="/teach/edit/:id" element={<TeacherRoute><AppShell><CourseEditor /></AppShell></TeacherRoute>} />

      <Route path="/"  element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />} />
      <Route path="*"  element={<Navigate to="/" replace />} />
    </Routes>
  )
}
