// ============================================================
// pages/CourseView.jsx — Course Learning View
// ============================================================

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCourseById, getCoverTheme, getUserById } from '../data/DATA.js'
import { useAuth } from '../utils/AuthContext.jsx'
import { Icon, Button, Badge, ProgressBar, CopyButton, EmptyState, FavButton, RichContent } from '../components/UI.jsx'

export default function CourseView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin, toggleFavourite, isFavourite } = useAuth()
  const course = getCourseById(id)

  // view: 'overview' | 'module' | 'lesson'
  const [view, setView] = useState('overview')
  const [activeModIdx, setActiveModIdx] = useState(0)
  const [activeLessonIdx, setActiveLessonIdx] = useState(null)
  const [completedLessons, setCompletedLessons] = useState(new Set())
  const [transitioning, setTransitioning] = useState(false)

  if (!course) {
    return (
      <div className="main-content" style={{ padding: 48 }}>
        <EmptyState icon="book" title="Course not found" description="This course doesn't exist or has been removed." />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button onClick={() => navigate('/explore')}>Back to Explore</Button>
        </div>
      </div>
    )
  }

  const theme = getCoverTheme(course.coverImage)
  const owner = getUserById(course.ownerId)
  const canEdit = course.editorIds?.includes(user?.id) || isAdmin
  const isOwner = course.ownerId === user?.id
  const fav = isFavourite(course.id)

  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0)
  const progress = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0

  const currentModule = course.modules[activeModIdx]
  const currentLesson = view === 'lesson' && currentModule ? currentModule.lessons[activeLessonIdx] : null

  function smoothTransition(fn) {
    setTransitioning(true)
    setTimeout(() => { fn(); setTransitioning(false) }, 200)
  }

  function openModule(mi) {
    smoothTransition(() => { setActiveModIdx(mi); setActiveLessonIdx(null); setView('module') })
  }

  function openLesson(mi, li) {
    smoothTransition(() => { setActiveModIdx(mi); setActiveLessonIdx(li); setView('lesson') })
  }

  function goBack() {
    if (view === 'lesson') smoothTransition(() => setView('module'))
    else smoothTransition(() => setView('overview'))
  }

  function markComplete(lessonId) {
    setCompletedLessons(s => new Set([...s, lessonId]))
  }

  function nextLesson() {
    if (!currentModule) return
    const nextIdx = activeLessonIdx + 1
    if (nextIdx < currentModule.lessons.length) {
      openLesson(activeModIdx, nextIdx)
    } else if (activeModIdx + 1 < course.modules.length) {
      openLesson(activeModIdx + 1, 0)
    } else {
      smoothTransition(() => setView('overview'))
    }
  }

  const contentStyle = {
    opacity: transitioning ? 0 : 1,
    transform: transitioning ? 'translateY(8px)' : 'translateY(0)',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
  }

  return (
    <div className="main-content">
      {/* ── Hero ── */}
      <div style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`, padding: '28px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', fontSize: '8rem', opacity: 0.1, pointerEvents: 'none' }}>
          {theme.icon}
        </div>

        {/* Back + Role badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <Icon name="arrowLeft" size={16} /> Back
          </button>
          {/* Teacher/Student indicator */}
          <span style={{
            padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem',
            fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
            background: isOwner ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.15)',
            color: isOwner ? '#FCD34D' : 'rgba(255,255,255,0.85)',
            border: `1px solid ${isOwner ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.25)'}`,
          }}>
            {isOwner ? '🏫 Teacher' : '🎓 Student'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <Badge variant="muted">{course.category}</Badge>
          <Badge variant="muted">{course.difficulty}</Badge>
          {course.visibility === 'private' && <Badge variant="muted" icon="lock">Private</Badge>}
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontStyle: 'italic', color: 'white', marginBottom: 8, maxWidth: 640 }}>
          {course.title}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 560, marginBottom: 14, fontSize: '0.9rem' }}>
          {course.description}
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>
            <Icon name="users" size={14} />{(course.enrolledCount || 0).toLocaleString()} enrolled
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>
            <Icon name="layers" size={14} />{course.modules.length} modules · {totalLessons} lessons
          </div>
          {owner && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>
              <Icon name="user" size={14} />By {owner.name}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {canEdit && (
            <Button onClick={() => navigate(`/teach/edit/${course.id}`)} icon="edit">Edit Course</Button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)', padding: '7px 12px' }}>
            <Icon name="key" size={13} style={{ color: 'rgba(255,255,255,0.6)' }} />
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'white', letterSpacing: '0.12em' }}>{course.code}</code>
            <CopyButton text={course.code} label="Copy" />
          </div>
          <FavButton isFav={fav} onToggle={() => toggleFavourite(course.id)}
            style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', padding: '7px 10px', color: fav ? '#FCD34D' : 'rgba(255,255,255,0.6)' }} />
        </div>
      </div>

      {/* ── Progress Bar ── */}
      {totalLessons > 0 && (
        <div style={{ padding: '10px 32px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ProgressBar value={progress} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {completedLessons.size}/{totalLessons}
            </span>
          </div>
        </div>
      )}

      {/* ── Breadcrumb ── */}
      {view !== 'overview' && (
        <div style={{ padding: '10px 32px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <button onClick={() => smoothTransition(() => setView('overview'))} style={{ background: 'none', border: 'none', color: 'var(--brand)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'var(--font-body)' }}>
            {course.title}
          </button>
          <Icon name="chevronRight" size={13} />
          <span style={{ color: view === 'lesson' ? 'var(--text-muted)' : 'var(--text)' }}>
            {currentModule?.title}
          </span>
          {view === 'lesson' && currentLesson && (
            <>
              <Icon name="chevronRight" size={13} />
              <span style={{ color: 'var(--text)' }}>{currentLesson.title}</span>
            </>
          )}
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div style={{ padding: '32px', maxWidth: 900 }}>
        <div style={contentStyle}>

          {/* ── OVERVIEW: Module Cards ── */}
          {view === 'overview' && (
            <div className="animate-fade-in">
              {course.modules.length === 0 ? (
                <EmptyState icon="layers" title="No content yet"
                  description={canEdit ? 'Add modules and lessons to get started.' : 'This course has no content yet.'}
                  action={canEdit ? <Button icon="edit" onClick={() => navigate(`/teach/edit/${course.id}`)}>Add Content</Button> : null} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontStyle: 'italic', marginBottom: 4 }}>
                    Course Modules
                  </h2>
                  <div className="grid-2">
                    {course.modules.map((mod, mi) => {
                      const doneCount = mod.lessons.filter(l => completedLessons.has(l.id)).length
                      const pct = mod.lessons.length ? Math.round((doneCount / mod.lessons.length) * 100) : 0
                      return (
                        <div key={mod.id} onClick={() => openModule(mi)}
                          style={{
                            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                            padding: 20, cursor: 'pointer', transition: 'all 0.2s ease',
                            animation: `fadeIn 0.4s ease ${mi * 60}ms both`,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                              {mi + 1}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: pct === 100 ? 'var(--success)' : 'var(--text-muted)', fontWeight: 600 }}>
                              {pct === 100 ? '✓ Done' : `${doneCount}/${mod.lessons.length}`}
                            </span>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{mod.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                            {mod.lessons.length} lesson{mod.lessons.length !== 1 ? 's' : ''} · {mod.lessons.reduce((a, l) => a + (l.estimatedMinutes || 0), 0)} min
                          </div>
                          {/* Mini lesson list */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                            {mod.lessons.slice(0, 3).map(l => (
                              <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                <span style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0, background: completedLessons.has(l.id) ? 'var(--success)' : 'var(--bg-muted)', border: `1px solid ${completedLessons.has(l.id) ? 'var(--success)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {completedLessons.has(l.id) && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20,6 9,17 4,12" /></svg>}
                                </span>
                                <span className="truncate">{l.title}</span>
                              </div>
                            ))}
                            {mod.lessons.length > 3 && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', paddingLeft: 20 }}>+{mod.lessons.length - 3} more</div>}
                          </div>
                          <ProgressBar value={pct} />
                          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--brand)', fontSize: '0.8rem', fontWeight: 600 }}>
                            Start module <Icon name="chevronRight" size={14} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── MODULE VIEW: Lesson List ── */}
          {view === 'module' && currentModule && (
            <div className="animate-fade-in">
              <button onClick={goBack} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
                <Icon name="arrowLeft" size={15} /> All Modules
              </button>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontStyle: 'italic', marginBottom: 4 }}>
                {currentModule.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 24 }}>
                {currentModule.lessons.length} lessons · {currentModule.lessons.reduce((a, l) => a + (l.estimatedMinutes || 0), 0)} min total
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {currentModule.lessons.map((lesson, li) => {
                  const done = completedLessons.has(lesson.id)
                  return (
                    <div key={lesson.id} onClick={() => openLesson(activeModIdx, li)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
                        background: 'var(--bg-card)', border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all 0.2s ease',
                        animation: `fadeIn 0.35s ease ${li * 50}ms both`,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.transform = 'translateX(4px)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = done ? 'rgba(16,185,129,0.3)' : 'var(--border)'; e.currentTarget.style.transform = '' }}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: done ? 'var(--success)' : 'var(--bg-muted)', border: `2px solid ${done ? 'var(--success)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {done
                          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg>
                          : <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>{li + 1}</span>
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>{lesson.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: 10 }}>
                          <span style={{ textTransform: 'capitalize' }}>{lesson.type}</span>
                          <span>·</span>
                          <span>{lesson.estimatedMinutes || 5} min</span>
                        </div>
                      </div>
                      <LessonTypeChip type={lesson.type} />
                      <Icon name="chevronRight" size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── LESSON VIEW ── */}
          {view === 'lesson' && currentLesson && (
            <div className="animate-fade-in" style={{ maxWidth: 720 }}>
              <button onClick={goBack} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
                <Icon name="arrowLeft" size={15} /> {currentModule?.title}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <LessonTypeChip type={currentLesson.type} />
                <span style={{ color: 'var(--border)' }}>·</span>
                <Icon name="clock" size={13} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentLesson.estimatedMinutes} min</span>
              </div>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontStyle: 'italic', marginBottom: 20 }}>
                {currentLesson.title}
              </h2>

              {/* Content by type */}
              {currentLesson.type === 'text' && (
                <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                  <RichContent text={currentLesson.content?.body} />
                </div>
              )}

              {currentLesson.type === 'image' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {currentLesson.content?.imageUrl && (
                    <img src={currentLesson.content.imageUrl} alt={currentLesson.title}
                      style={{ maxWidth: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }} />
                  )}
                  {currentLesson.content?.caption && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontStyle: 'italic' }}>{currentLesson.content.caption}</p>
                  )}
                </div>
              )}

              {currentLesson.type === 'video' && currentLesson.content?.videoUrl && (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <iframe src={currentLesson.content.videoUrl} title={currentLesson.title} frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                </div>
              )}

              {currentLesson.type === 'quiz' && <QuizView questions={currentLesson.content?.questions} />}

              {/* Complete + Next */}
              <div style={{ marginTop: 28, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {!completedLessons.has(currentLesson.id) ? (
                  <Button icon="check" onClick={() => markComplete(currentLesson.id)}>
                    Mark as Complete
                  </Button>
                ) : (
                  <div className="alert alert-success" style={{ flex: 1 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg>
                    Lesson completed!
                  </div>
                )}
                <Button variant="secondary" icon="chevronRight" onClick={nextLesson}>Next Lesson</Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function LessonTypeChip({ type }) {
  const map = {
    text:          { label: 'Reading', color: 'var(--accent1)', bg: 'rgba(129,140,248,0.12)' },
    image:         { label: 'Image',   color: 'var(--accent4)', bg: 'rgba(244,114,182,0.12)' },
    video:         { label: 'Video',   color: 'var(--accent3)', bg: 'rgba(245,158,11,0.12)' },
    quiz:          { label: 'Quiz',    color: 'var(--brand)',   bg: 'rgba(56,189,248,0.12)' },
    questionnaire: { label: 'Form',    color: 'var(--accent2)', bg: 'rgba(52,211,153,0.12)' },
    interactive:   { label: 'Live',    color: '#f97316',        bg: 'rgba(249,115,22,0.12)' },
  }
  const t = map[type] || map.text
  return (
    <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', background: t.bg, color: t.color, textTransform: 'uppercase', flexShrink: 0 }}>
      {t.label}
    </span>
  )
}

function QuizView({ questions = [] }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  if (!questions.length) return <p style={{ color: 'var(--text-muted)' }}>No questions in this quiz yet.</p>
  const score = submitted ? questions.reduce((s, q) => s + (answers[q.id] == q.answer ? q.points : 0), 0) : 0
  const total = questions.reduce((s, q) => s + q.points, 0)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {questions.map((q, i) => (
        <div key={q.id} className="card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 14 }}>{i + 1}. {q.prompt}</div>
          {q.type === 'multiple_choice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options.map((opt, oi) => {
                const selected = answers[q.id] === oi
                const isCorrect = submitted && oi === q.answer
                const isWrong = submitted && selected && oi !== q.answer
                return (
                  <button key={oi} onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: oi }))} style={{
                    padding: '10px 14px', borderRadius: 'var(--radius-md)', textAlign: 'left',
                    border: `1px solid ${isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : selected ? 'var(--brand)' : 'var(--border)'}`,
                    background: isCorrect ? 'rgba(16,185,129,0.1)' : isWrong ? 'rgba(239,68,68,0.1)' : selected ? 'var(--brand-glow)' : 'var(--bg-muted)',
                    color: 'var(--text)', cursor: submitted ? 'default' : 'pointer',
                    transition: 'var(--transition)', fontSize: '0.875rem', fontFamily: 'var(--font-body)',
                  }}>{opt}</button>
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
      {!submitted
        ? <Button onClick={() => setSubmitted(true)} icon="check">Submit Quiz</Button>
        : <div className={`alert alert-${score === total ? 'success' : 'info'}`}>Score: {score}/{total} {score === total ? '🎉 Perfect!' : ''}</div>
      }
    </div>
  )
}
