// ============================================================
// components/Sidebar.jsx — App Shell Navigation
// ============================================================

import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext.jsx'
import { Icon, Avatar } from './UI.jsx'

export default function Sidebar() {
  const { user, logout, isTeacher } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sidebar">
      {/* Logo */}
      <NavLink to="/dashboard" className="sidebar-logo">
        <span dangerouslySetInnerHTML={{ __html: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="7" fill="#38BDF8"/><path d="M7 9 L14 5 L21 9 L21 19 L14 23 L7 19 Z" stroke="white" stroke-width="1.5" fill="none"/><circle cx="14" cy="14" r="2.5" fill="white"/></svg>` }} />
        <span className="sidebar-logo-text">LearnFlow</span>
      </NavLink>

      {/* Navigation */}
      <div className="sidebar-nav">
        <SidebarLink to="/dashboard" icon="home">Dashboard</SidebarLink>
        <SidebarLink to="/explore" icon="search">Explore</SidebarLink>
        <SidebarLink to="/my-courses" icon="book">My Courses</SidebarLink>

        {isTeacher && (
          <>
            <div className="sidebar-section-label" style={{ marginTop: 16 }}>Teaching</div>
            <SidebarLink to="/teach" icon="layers">My Classes</SidebarLink>
            <SidebarLink to="/teach/new" icon="plus">Create Course</SidebarLink>
          </>
        )}

        <div className="sidebar-section-label" style={{ marginTop: 16 }}>Account</div>
        <SidebarLink to="/profile" icon="user">Profile</SidebarLink>
        <SidebarLink to="/settings" icon="settings">Settings</SidebarLink>
      </div>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={handleLogout} title="Sign out">
          <Avatar initials={user?.avatar || '?'} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }} className="truncate">
              {user?.name}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {user?.role} · Sign out
            </div>
          </div>
          <Icon name="logout" size={16} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </nav>
  )
}

function SidebarLink({ to, icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
    >
      <Icon name={icon} size={18} />
      {children}
    </NavLink>
  )
}
