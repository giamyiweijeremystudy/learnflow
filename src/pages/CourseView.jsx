// ============================================================
// pages/CourseView.jsx — Course Detail / Student Learning View
// ============================================================

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCourseById, getCoverTheme, getUserById } from '../data/DATA.js'
import { useAuth } from '../utils/AuthContext.jsx'
import { Icon, Button, Badge, ProgressBar, CopyButton, EmptyState } from '../components/UI.jsx'

export default function CourseView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isTeacher, canEdit } = useAuth()
  const course = getCourseById(id)
  const [activeModule, setActiveModule] = useState(0)
  const [activeLesson, setActiveLesson] = useState(null)
  const [completedLessons, setCompletedLessons] = useState(new Set())

  if (!course) {
    return (
      <div className="main-content">
        <div style={{ padding: 48 }}>
          <EmptyState icon="book" title="Course not found" description="This course doesn't exist or has been removed." />
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button onClick={() => navigate('/explore')}>Back to Explore</Button>
          </div>
        </div>
      </div>
    )
  }

  const theme = getCoverTheme(course.coverImage)
  const owner = getUserById(course.ownerId)
  const canEditCourse = course.editorIds.includes(user?.id)

  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0)
  const progress = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0

  const currentModule = course.modules[activeModule]
  const currentLesson = activeLesson !== null && currentModule
    ? currentModule.lessons[activeLesson]
    : null

  function markComplete(lessonId) {
    setCompletedLessons(s => new Set([...s, lessonId]))
  }

  return (
    <div className="main-content">
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
        padding: '32px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)',
          fontSize: '8rem', opacity: 0.12, pointerEvents: 'none',
        }}>{theme.icon}</div>

        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: 16, color: 'rgba(255,255,255,0.7)' }}
        >
          <Icon name="arrowLeft" size={16} /> Back
        </button>

        <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          <Badge variant="muted">{course.category}</Badge>
          <Badge variant="muted">{course.difficulty}</Badge>
          {course.visibility === 'private' && <Badge variant="muted" icon="lock">Private</Badge>}
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontStyle: 'italic',
          color: 'white', marginBottom: 8, maxWidth: 640,
        }}>{course.title}</h1>

        <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 560, marginBottom: 16, fontSize: '0.95rem' }}>
          {course.description}
        </p>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}>
            <Icon name="users" size={15} />
            <span>{course.enrolledCount.toLocaleString()} enrolled</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}>
            <Icon name="layers" size={15} />
            <span>{course.modules.length} modules · {totalLessons} lessons</span>
          </div>
          {owner && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}>
              <Icon name="user" size={15} />
              <span>By {owner.name}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {canEditCourse && (
            <Button onClick={() => navigate(`/teach/edit/${course.id}`)} icon="edit">
              Edit Course
            </Button>
          )}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)',
            padding: '8px 14px',
          }}>
            <Icon name="key" size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'white', letterSpacing: '0.12em' }}>
              {course.code}
            </code>
            <CopyButton text={course.code} label="Copy code" />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {totalLessons > 0 && (
        <div style={{ padding: '12px 32px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ProgressBar value={progress} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {completedLessons.size}/{totalLessons} lessons
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 300px)' }}>
        {/* Module / Lesson Sidebar */}
        <div style={{
          width: 280, flexShrink: 0, borderRight: '1px solid var(--border)',
          background: 'var(--bg-surface)', overflowY: 'auto',
          maxHeight: 'calc(100vh - 300px)', position: 'sticky', top: 0,
        }}>
          {course.modules.length === 0 ? (
            <div style={{ padding: 20, color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
              No modules yet.
              {canEditCourse && (
                <Button size="sm" style={{ marginTop: 10 }} onClick={() => navigate(`/teach/edit/${course.id}`)}>
                  Add Content
                </Button>
              )}
            </div>
          ) : (
            course.modules.map((mod, mi) => (
              <div key={mod.id}>
                <button
                  onClick={() => { setActiveModule(mi); setActiveLesson(null) }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '14px 16px',
                    background: activeModule === mi && activeLesson === null ? 'var(--brand-glow)' : 'transparent',
                    color: activeModule === mi && activeLesson === null ? 'var(--brand)' : 'var(--text)',
                    borderBottom: '1px solid var(--border)',
                    fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'var(--transition)',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  <Icon name="layers" size={14} />
                  <span style={{ flex: 1 }}>Module {mi + 1}: {mod.title}</span>
                </button>
                {mod.lessons.map((lesson, li) => (
                  <button
                    key={lesson.id}
                    onClick={() => { setActiveModule(mi); setActiveLesson(li) }}
                    style={{
                      width: '100%', textAlign: 'left', padding: '10px 16px 10px 36px',
                      background: activeModule === mi && activeLesson === li ? 'rgba(56,189,248,0.08)' : 'transparent',
                      color: activeModule === mi && activeLesson === li ? 'var(--brand)' : 'var(--text-secondary)',
                      borderBottom: '1px solid var(--border)',
                      fontSize: '0.82rem', cursor: 'pointer', transition: 'var(--transition)',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    <span style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                      background: completedLessons.has(lesson.id) ? 'var(--success)' : 'var(--bg-muted)',
                      border: `1px solid ${completedLessons.has(lesson.id) ? 'var(--success)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {completedLessons.has(lesson.id) && <Icon name="check" size={10} style={{ color: 'white' }} />}
                    </span>
                    <span className="truncate">{lesson.title}</span>
                    <LessonTypeIcon type={lesson.type} />
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Lesson Content Area */}
        <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
          {!currentLesson ? (
            <ModuleOverview module={currentModule} modulIndex={activeModule} />
          ) : (
            <LessonView
              lesson={currentLesson}
              completed={completedLessons.has(currentLesson.id)}
              onComplete={() => markComplete(currentLesson.id)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function ModuleOverview({ module, modulIndex }) {
  if (!module) return (
    <EmptyState icon="book" title="Select a lesson" description="Choose a module or lesson from the sidebar to get started." />
  )
  return (
    <div className="animate-fade-in">
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Module {modulIndex + 1}</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontStyle: 'italic', marginBottom: 12 }}>
        {module.title}
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        This module contains {module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}.
        Select a lesson from the sidebar to begin.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {module.lessons.map((lesson, i) => (
          <div key={lesson.id} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 'var(--radius-md)',
              background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)',
            }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{lesson.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {lesson.estimatedMinutes} min · {lesson.type}
              </div>
            </div>
            <LessonTypeIcon type={lesson.type} />
          </div>
        ))}
      </div>
    </div>
  )
}

function LessonView({ lesson, completed, onComplete }) {
  return (
    <div className="animate-fade-in" style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <LessonTypeIcon type={lesson.type} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{lesson.type}</span>
        <span style={{ color: 'var(--border)' }}>·</span>
        <Icon name="clock" size={13} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lesson.estimatedMinutes} min</span>
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontStyle: 'italic', marginBottom: 20 }}>
        {lesson.title}
      </h2>

      {/* Lesson content by type */}
      {lesson.type === 'text' && (
        <div style={{
          lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '0.95rem',
          background: 'var(--bg-card)', padding: 24, borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
        }}>
          {lesson.content.body}
        </div>
      )}

      {lesson.type === 'quiz' && <QuizView questions={lesson.content.questions} />}

      {lesson.type === 'image' && lesson.content.imageUrl && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <img src={lesson.content.imageUrl} alt={lesson.title} style={{ width: '100%', display: 'block' }} />
        </div>
      )}

      {/* Mark complete */}
      {!completed ? (
        <Button onClick={onComplete} icon="check" style={{ marginTop: 24 }}>
          Mark as Complete
        </Button>
      ) : (
        <div className="alert alert-success" style={{ marginTop: 24 }}>
          <Icon name="check" size={16} /> Lesson completed!
        </div>
      )}
    </div>
  )
}

function QuizView({ questions = [] }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  if (!questions.length) return <p style={{ color: 'var(--text-muted)' }}>No questions in this quiz yet.</p>

  const score = submitted
    ? questions.reduce((s, q) => s + (answers[q.id] == q.answer ? q.points : 0), 0)
    : 0
  const total = questions.reduce((s, q) => s + q.points, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {questions.map((q, i) => (
        <div key={q.id} className="card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 14 }}>
            {i + 1}. {q.prompt}
          </div>
          {q.type === 'multiple_choice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options.map((opt, oi) => {
                const selected = answers[q.id] === oi
                const isCorrect = submitted && oi === q.answer
                const isWrong = submitted && selected && oi !== q.answer
                return (
                  <button
                    key={oi}
                    onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: oi }))}
                    style={{
                      padding: '10px 14px', borderRadius: 'var(--radius-md)', textAlign: 'left',
                      border: `1px solid ${isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : selected ? 'var(--brand)' : 'var(--border)'}`,
                      background: isCorrect ? 'rgba(16,185,129,0.1)' : isWrong ? 'rgba(239,68,68,0.1)' : selected ? 'var(--brand-glow)' : 'var(--bg-muted)',
                      color: 'var(--text)', cursor: submitted ? 'default' : 'pointer',
                      transition: 'var(--transition)', fontSize: '0.875rem',
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          )}
          {submitted && (
            <div style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--text-secondary)', padding: '8px 12px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)' }}>
              💡 {q.explanation}
            </div>
          )}
        </div>
      ))}

      {!submitted ? (
        <Button onClick={() => setSubmitted(true)} icon="check">Submit Quiz</Button>
      ) : (
        <div className={`alert alert-${score === total ? 'success' : 'info'}`}>
          Score: {score}/{total} points {score === total ? '🎉 Perfect!' : ''}
        </div>
      )}
    </div>
  )
}

function LessonTypeIcon({ type }) {
  const map = { text: 'book', image: 'image', video: 'video', quiz: 'quiz', questionnaire: 'quiz', interactive: 'star' }
  return <Icon name={map[type] || 'book'} size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
}
