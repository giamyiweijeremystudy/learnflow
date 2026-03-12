// ============================================================
// App.jsx — Root Application + Router
// ============================================================

import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './utils/AuthContext.jsx'
import { GLOBAL_CSS, COMPONENT_STYLES, LAYOUT_STYLES } from './styles/GRAPHICS.js'
import { getCourseById } from './data/DATA.js'
import { applyUserTheme } from './utils/AuthContext.jsx'

// Pages
import AuthPage     from './pages/AuthPage.jsx'
import Dashboard    from './pages/Dashboard.jsx'
import ExplorePage  from './pages/ExplorePage.jsx'
import CourseView   from './pages/CourseView.jsx'
import CourseEditor from './pages/CourseEditor.jsx'
import TeachPage    from './pages/TeachPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import AdminPage    from './pages/AdminPage.jsx'

// Components
import Sidebar from './components/Sidebar.jsx'
import { Icon } from './components/UI.jsx'

// ── Loading Spinner ───────────────────────────────────────────
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

function AdminRoute({ children }) {
  const { isAdmin, isLoggedIn, loading } = useAuth()
  if (loading) return <Spinner />
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
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

// ── Profile Page ──────────────────────────────────────────────
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
              <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                {user?.isAdmin && <span className="badge badge-brand">⚡ Admin</span>}
                {user?.isSuperAdmin && <span className="badge badge-accent1">⭐ Super Admin</span>}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {[
              ['Member since', new Date(user?.createdAt).toLocaleDateString('en-SG', { year: 'numeric', month: 'long' })],
              ['Enrolled courses', user?.enrolledCourses?.length || 0],
              ['Courses created', user?.ownedCourses?.length || 0],
            ].map(([label, value]) => (
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

// ── My Courses Page ───────────────────────────────────────────
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

// ── Theme Applier — runs once on load ─────────────────────────
function ThemeApplier() {
  const { user } = useAuth()
  useEffect(() => {
    if (user?.theme) applyUserTheme(user.theme)
  }, [user?.theme])
  return null
}

// ── Root App ──────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS + COMPONENT_STYLES + LAYOUT_STYLES }} />
      <AuthProvider>
        <BrowserRouter>
          <ThemeApplierWrapper />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

function ThemeApplierWrapper() {
  const { user } = useAuth()
  useEffect(() => {
    if (user?.theme) applyUserTheme(user.theme)
  }, [user?.theme])
  return null
}

function AppRoutes() {
  const { isLoggedIn, loading } = useAuth()
  if (loading) return <Spinner />

  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" />} />
      <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <AuthPage mode="register" />} />

      {/* Protected — available to ALL logged-in users */}
      <Route path="/dashboard"  element={<ProtectedRoute><AppShell><Dashboard /></AppShell></ProtectedRoute>} />
      <Route path="/explore"    element={<ProtectedRoute><AppShell><ExplorePage /></AppShell></ProtectedRoute>} />
      <Route path="/my-courses" element={<ProtectedRoute><AppShell><MyCoursesPage /></AppShell></ProtectedRoute>} />
      <Route path="/course/:id" element={<ProtectedRoute><AppShell><CourseView /></AppShell></ProtectedRoute>} />
      <Route path="/teach"      element={<ProtectedRoute><AppShell><TeachPage /></AppShell></ProtectedRoute>} />
      <Route path="/teach/new"  element={<ProtectedRoute><AppShell><CourseEditor /></AppShell></ProtectedRoute>} />
      <Route path="/teach/edit/:id" element={<ProtectedRoute><AppShell><CourseEditor /></AppShell></ProtectedRoute>} />
      <Route path="/profile"    element={<ProtectedRoute><AppShell><ProfilePage /></AppShell></ProtectedRoute>} />
      <Route path="/settings"   element={<ProtectedRoute><AppShell><SettingsPage /></AppShell></ProtectedRoute>} />

      {/* Admin only */}
      <Route path="/admin" element={<AdminRoute><AppShell><AdminPage /></AppShell></AdminRoute>} />

      {/* Fallback */}
      <Route path="/"  element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />} />
      <Route path="*"  element={<Navigate to="/" replace />} />
    </Routes>
  )
}
