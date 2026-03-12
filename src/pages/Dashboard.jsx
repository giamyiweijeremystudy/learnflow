// ============================================================
// pages/Dashboard.jsx — Student/Teacher Home Dashboard
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext.jsx'
import { getCourseById, getEditableCourses, MOCK_COURSES, findCourseByCode } from '../data/DATA.js'
import { Icon, Button, Input, Alert, Modal, EmptyState, Badge } from '../components/UI.jsx'
import CourseCard from '../components/CourseCard.jsx'

export default function Dashboard() {
  const { user, isTeacher } = useAuth()
  const navigate = useNavigate()
  const [codeInput, setCodeInput] = useState('')
  const [codeError, setCodeError] = useState('')
  const [joinedCourse, setJoinedCourse] = useState(null)
  const [showJoinModal, setShowJoinModal] = useState(false)

  // Courses relevant to this user
  const myCourses = isTeacher
    ? getEditableCourses(user.id)
    : (user.enrolledCourses || []).map(id => getCourseById(id)).filter(Boolean)

  const recentPublic = MOCK_COURSES.filter(c => c.visibility === 'public').slice(0, 6)

  function handleJoinByCode() {
    const found = findCourseByCode(codeInput.trim())
    if (!found) { setCodeError('No course found with that code. Please check and try again.'); return }
    setCodeError('')
    setJoinedCourse(found)
    setShowJoinModal(true)
  }

  function confirmJoin() {
    setShowJoinModal(false)
    navigate(`/course/${joinedCourse.id}`)
  }

  return (
    <div className="main-content">
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]} ✦</h1>
            <p className="page-subtitle">
              {isTeacher
                ? `You're managing ${myCourses.length} course${myCourses.length !== 1 ? 's' : ''}.`
                : `You're enrolled in ${myCourses.length} course${myCourses.length !== 1 ? 's' : ''}.`}
            </p>
          </div>
          {isTeacher && (
            <Button icon="plus" onClick={() => navigate('/teach/new')}>
              New Course
            </Button>
          )}
        </div>
      </div>

      <div className="content-area">
        {/* Join by Code */}
        <div className="card animate-fade-in" style={{ padding: '20px', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Icon name="key" size={20} style={{ color: 'var(--brand)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: 2, fontSize: '0.9rem' }}>Join with a course code</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Enter a 6-character code to access any course (public or private).
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div>
                <input
                  className="input"
                  placeholder="e.g. CALC01"
                  value={codeInput}
                  onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeError('') }}
                  style={{ width: 140, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                  maxLength={6}
                  onKeyDown={e => e.key === 'Enter' && handleJoinByCode()}
                />
                {codeError && <div className="error-text" style={{ marginTop: 4 }}>{codeError}</div>}
              </div>
              <Button variant="primary" onClick={handleJoinByCode} disabled={codeInput.length < 4}>
                Join
              </Button>
            </div>
          </div>
        </div>

        {/* My Courses */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {isTeacher ? 'My Courses' : 'Enrolled Courses'}
            </h2>
            {myCourses.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => navigate(isTeacher ? '/teach' : '/my-courses')}>
                View all <Icon name="chevronRight" size={14} />
              </Button>
            )}
          </div>

          {myCourses.length === 0 ? (
            <EmptyState
              icon={isTeacher ? 'layers' : 'book'}
              title={isTeacher ? 'No courses yet' : 'No enrollments yet'}
              description={isTeacher
                ? 'Create your first course and start teaching!'
                : 'Explore courses or enter a code to join one.'}
              action={
                isTeacher
                  ? <Button icon="plus" onClick={() => navigate('/teach/new')}>Create Course</Button>
                  : <Button icon="search" onClick={() => navigate('/explore')}>Explore Courses</Button>
              }
            />
          ) : (
            <div className="grid-3">
              {myCourses.slice(0, 6).map((course, i) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showActions={isTeacher}
                  onEdit={() => navigate(`/teach/edit/${course.id}`)}
                  animationDelay={i * 60}
                />
              ))}
            </div>
          )}
        </section>

        {/* Discover Section */}
        {!isTeacher && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Discover Courses</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/explore')}>
                Browse all <Icon name="chevronRight" size={14} />
              </Button>
            </div>
            <div className="grid-3">
              {recentPublic.map((course, i) => (
                <CourseCard key={course.id} course={course} animationDelay={i * 60} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Join Confirmation Modal */}
      <Modal
        open={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="Join Course"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowJoinModal(false)}>Cancel</Button>
            <Button onClick={confirmJoin}>Join Course</Button>
          </>
        }
      >
        {joinedCourse && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Alert type="success">Course found!</Alert>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{joinedCourse.title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{joinedCourse.description}</div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <Badge variant="muted">{joinedCourse.category}</Badge>
                <Badge variant="muted">{joinedCourse.difficulty}</Badge>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Would you like to join <strong>{joinedCourse.title}</strong>?
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
