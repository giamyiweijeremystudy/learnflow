// ============================================================
// pages/TeachPage.jsx — Teacher Course Management Hub
// ============================================================

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext.jsx'
import { getEditableCourses } from '../data/DATA.js'
import { Button, EmptyState, Icon, Badge } from '../components/UI.jsx'
import CourseCard from '../components/CourseCard.jsx'

export default function TeachPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const courses = getEditableCourses(user.id)

  const owned = courses.filter(c => c.ownerId === user.id)
  const shared = courses.filter(c => c.ownerId !== user.id)

  return (
    <div className="main-content">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">My Classes ✦</h1>
            <p className="page-subtitle">
              {owned.length} owned · {shared.length} shared with you
            </p>
          </div>
          <Button icon="plus" onClick={() => navigate('/teach/new')}>New Course</Button>
        </div>
      </div>

      <div className="content-area">
        {/* Stats Row */}
        <div className="grid-4 animate-fade-in" style={{ marginBottom: 28 }}>
          {[
            { label: 'Total Courses', value: courses.length, icon: 'layers', color: 'var(--brand)' },
            { label: 'Total Students', value: courses.reduce((a, c) => a + c.enrolledCount, 0).toLocaleString(), icon: 'users', color: 'var(--accent2)' },
            { label: 'Public', value: courses.filter(c => c.visibility === 'public').length, icon: 'globe', color: 'var(--accent3)' },
            { label: 'Private', value: courses.filter(c => c.visibility === 'private').length, icon: 'lock', color: 'var(--accent1)' },
          ].map((stat, i) => (
            <div key={stat.label} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Icon name={stat.icon} size={18} style={{ color: stat.color }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  {stat.label}
                </span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Owned Courses */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)' }}>
            YOUR COURSES
          </h2>
          {owned.length === 0 ? (
            <EmptyState
              icon="layers"
              title="No courses yet"
              description="Create your first course to start teaching!"
              action={<Button icon="plus" onClick={() => navigate('/teach/new')}>Create Course</Button>}
            />
          ) : (
            <div className="grid-3">
              {owned.map((course, i) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showActions
                  onEdit={() => navigate(`/teach/edit/${course.id}`)}
                  animationDelay={i * 60}
                />
              ))}
            </div>
          )}
        </section>

        {/* Shared Courses */}
        {shared.length > 0 && (
          <section>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)' }}>
              SHARED WITH YOU
            </h2>
            <div className="grid-3">
              {shared.map((course, i) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showActions
                  onEdit={() => navigate(`/teach/edit/${course.id}`)}
                  animationDelay={i * 60}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
