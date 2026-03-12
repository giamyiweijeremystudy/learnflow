// ============================================================
// pages/CourseEditor.jsx — Teacher Course Creation & Editing
// ============================================================

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext.jsx'
import {
  getCourseById, CATEGORIES, DIFFICULTIES, MOCK_COURSES,
  generateId, generateCourseCode, getCoverTheme, COVER_THEMES
} from '../data/DATA.js'
import { Icon, Button, Input, Textarea, Select, Badge, Modal, Alert, Tabs, CopyButton } from '../components/UI.jsx'

const LESSON_TYPES = [
  { value: 'text', label: '📝 Text / Reading' },
  { value: 'image', label: '🖼️ Image' },
  { value: 'video', label: '🎬 Video' },
  { value: 'quiz', label: '❓ Quiz' },
  { value: 'questionnaire', label: '📋 Questionnaire' },
  { value: 'interactive', label: '⚡ Interactive' },
]

export default function CourseEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isNew = !id

  const existing = id ? getCourseById(id) : null

  // If editing, verify access
  if (!isNew && existing && !existing.editorIds.includes(user?.id)) {
    return <div style={{ padding: 48, color: 'var(--error)' }}>You don't have edit access to this course.</div>
  }

  const [tab, setTab] = useState('info')
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Course Info State
  const [info, setInfo] = useState({
    title: existing?.title || '',
    description: existing?.description || '',
    category: existing?.category || CATEGORIES[0],
    difficulty: existing?.difficulty || 'beginner',
    visibility: existing?.visibility || 'public',
    coverImage: existing?.coverImage || 'default',
    tags: existing?.tags?.join(', ') || '',
  })

  // Modules/Lessons State
  const [modules, setModules] = useState(existing?.modules || [])
  const [activeModIdx, setActiveModIdx] = useState(null)
  const [activeLessonIdx, setActiveLessonIdx] = useState(null)

  // Modals
  const [showAddModule, setShowAddModule] = useState(false)
  const [showAddLesson, setShowAddLesson] = useState(false)
  const [newModTitle, setNewModTitle] = useState('')
  const [newLesson, setNewLesson] = useState({ title: '', type: 'text', estimatedMinutes: 10 })

  const courseCode = existing?.code || generateCourseCode()

  function setInfo_(field) {
    return e => setInfo(i => ({ ...i, [field]: e.target.value }))
  }

  function handleSave() {
    if (!info.title.trim()) { setSaveError('Course title is required.'); return }
    setSaveError('')

    const courseData = {
      id: existing?.id || generateId('c'),
      ...info,
      tags: info.tags.split(',').map(t => t.trim()).filter(Boolean),
      modules,
      ownerId: user.id,
      editorIds: existing?.editorIds || [user.id],
      code: courseCode,
      enrolledCount: existing?.enrolledCount || 0,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (isNew) {
      MOCK_COURSES.push(courseData)
    } else {
      const idx = MOCK_COURSES.findIndex(c => c.id === existing.id)
      if (idx !== -1) MOCK_COURSES[idx] = courseData
    }

    setSaved(true)
    setTimeout(() => {
      navigate(`/course/${courseData.id}`)
    }, 1000)
  }

  function addModule() {
    if (!newModTitle.trim()) return
    setModules(m => [...m, {
      id: generateId('m'), title: newModTitle.trim(),
      order: m.length + 1, lessons: [],
    }])
    setNewModTitle('')
    setShowAddModule(false)
    setActiveModIdx(modules.length)
  }

  function addLesson() {
    if (!newLesson.title.trim() || activeModIdx === null) return
    const lesson = {
      id: generateId('l'),
      title: newLesson.title.trim(),
      type: newLesson.type,
      estimatedMinutes: parseInt(newLesson.estimatedMinutes) || 10,
      order: modules[activeModIdx].lessons.length + 1,
      content: defaultContent(newLesson.type),
    }
    setModules(mods => mods.map((m, i) =>
      i === activeModIdx ? { ...m, lessons: [...m.lessons, lesson] } : m
    ))
    setNewLesson({ title: '', type: 'text', estimatedMinutes: 10 })
    setShowAddLesson(false)
    setActiveLessonIdx(modules[activeModIdx].lessons.length)
  }

  function deleteModule(idx) {
    setModules(m => m.filter((_, i) => i !== idx))
    if (activeModIdx === idx) { setActiveModIdx(null); setActiveLessonIdx(null) }
  }

  function deleteLesson(modIdx, lessonIdx) {
    setModules(mods => mods.map((m, i) =>
      i === modIdx ? { ...m, lessons: m.lessons.filter((_, li) => li !== lessonIdx) } : m
    ))
    setActiveLessonIdx(null)
  }

  function updateLessonContent(modIdx, lessonIdx, content) {
    setModules(mods => mods.map((m, i) =>
      i === modIdx
        ? { ...m, lessons: m.lessons.map((l, li) => li === lessonIdx ? { ...l, content } : l) }
        : m
    ))
  }

  const currentLesson = activeModIdx !== null && activeLessonIdx !== null
    ? modules[activeModIdx]?.lessons[activeLessonIdx]
    : null

  return (
    <div className="main-content">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
                <Icon name="arrowLeft" size={16} /> Back
              </button>
            </div>
            <h1 className="page-title">{isNew ? 'Create Course ✦' : `Edit: ${info.title || 'Untitled'}`}</h1>
            <p className="page-subtitle">
              Course code: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand)', letterSpacing: '0.08em' }}>{courseCode}</code>
              <span style={{ marginLeft: 8 }}><CopyButton text={courseCode} label="Copy" /></span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" onClick={() => navigate(-1)}>Discard</Button>
            <Button icon="check" onClick={handleSave}>
              {saved ? '✓ Saved!' : 'Save Course'}
            </Button>
          </div>
        </div>
      </div>

      <div className="content-area">
        {saveError && <Alert type="error" style={{ marginBottom: 16 }}>{saveError}</Alert>}
        {saved && <Alert type="success" style={{ marginBottom: 16 }}>Course saved! Redirecting…</Alert>}

        {/* Tabs */}
        <div style={{ marginBottom: 24 }}>
          <Tabs
            tabs={[
              { label: 'Course Info', value: 'info' },
              { label: 'Modules & Lessons', value: 'content' },
              { label: 'Settings', value: 'settings' },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>

        {/* ── Tab: Info ── */}
        {tab === 'info' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Input label="Course Title" placeholder="e.g. Introduction to Algebra" value={info.title} onChange={setInfo_('title')} />
              <Textarea label="Description" placeholder="What will students learn? What makes this course special?" value={info.description} onChange={setInfo_('description')} rows={5} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Select label="Category" value={info.category} onChange={setInfo_('category')}
                  options={CATEGORIES.map(c => ({ value: c, label: c }))} />
                <Select label="Difficulty" value={info.difficulty} onChange={setInfo_('difficulty')}
                  options={DIFFICULTIES.map(d => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1) }))} />
              </div>
              <Input label="Tags (comma-separated)" placeholder="e.g. algebra, math, equations" value={info.tags} onChange={setInfo_('tags')} />
            </div>

            {/* Cover Preview */}
            <div>
              <label className="input-label" style={{ display: 'block', marginBottom: 10 }}>Cover Theme</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {Object.entries(COVER_THEMES).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => setInfo(i => ({ ...i, coverImage: key }))}
                    style={{
                      height: 72, borderRadius: 'var(--radius-md)', cursor: 'pointer',
                      background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                      border: `2px solid ${info.coverImage === key ? 'var(--brand)' : 'transparent'}`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: 2, transition: 'var(--transition)',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{theme.icon}</span>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Content ── */}
        {tab === 'content' && (
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>
            {/* Module List */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Modules</span>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModule(true)}>
                  <Icon name="plus" size={14} /> Add
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {modules.length === 0 && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 8px' }}>
                    No modules yet. Add your first module!
                  </div>
                )}
                {modules.map((mod, mi) => (
                  <div key={mod.id}>
                    <button
                      onClick={() => { setActiveModIdx(mi); setActiveLessonIdx(null) }}
                      style={{
                        width: '100%', textAlign: 'left', padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: activeModIdx === mi && activeLessonIdx === null ? 'var(--brand-glow)' : 'var(--bg-muted)',
                        border: `1px solid ${activeModIdx === mi && activeLessonIdx === null ? 'rgba(56,189,248,0.3)' : 'var(--border)'}`,
                        color: activeModIdx === mi && activeLessonIdx === null ? 'var(--brand)' : 'var(--text)',
                        cursor: 'pointer', transition: 'var(--transition)',
                        display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600,
                      }}
                    >
                      <Icon name="layers" size={14} />
                      <span style={{ flex: 1 }} className="truncate">{mod.title}</span>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: 4, color: 'var(--text-muted)' }}
                        onClick={e => { e.stopPropagation(); deleteModule(mi) }}
                      ><Icon name="trash" size={12} /></button>
                    </button>
                    {/* Lessons */}
                    <div style={{ paddingLeft: 12, marginTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {mod.lessons.map((lesson, li) => (
                        <button
                          key={lesson.id}
                          onClick={() => { setActiveModIdx(mi); setActiveLessonIdx(li) }}
                          style={{
                            width: '100%', textAlign: 'left', padding: '7px 10px',
                            borderRadius: 'var(--radius-sm)',
                            background: activeModIdx === mi && activeLessonIdx === li ? 'rgba(56,189,248,0.08)' : 'transparent',
                            color: activeModIdx === mi && activeLessonIdx === li ? 'var(--brand)' : 'var(--text-secondary)',
                            cursor: 'pointer', transition: 'var(--transition)',
                            display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem',
                          }}
                        >
                          <span style={{ flex: 1 }} className="truncate">{lesson.title}</span>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ padding: 2, color: 'var(--text-muted)' }}
                            onClick={e => { e.stopPropagation(); deleteLesson(mi, li) }}
                          ><Icon name="trash" size={11} /></button>
                        </button>
                      ))}
                      {activeModIdx === mi && (
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ marginTop: 4, fontSize: '0.78rem', color: 'var(--text-muted)' }}
                          onClick={() => setShowAddLesson(true)}
                        >
                          <Icon name="plus" size={12} /> Add lesson
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lesson Editor */}
            <div>
              {!currentLesson ? (
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                  padding: 32, textAlign: 'center', color: 'var(--text-muted)',
                }}>
                  <Icon name="edit" size={28} style={{ marginBottom: 12 }} />
                  <p>Select a lesson to edit its content,<br />or add a new lesson to a module.</p>
                </div>
              ) : (
                <LessonEditor
                  lesson={currentLesson}
                  onChange={content => updateLessonContent(activeModIdx, activeLessonIdx, content)}
                />
              )}
            </div>
          </div>
        )}

        {/* ── Tab: Settings ── */}
        {tab === 'settings' && (
          <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="input-label">Visibility</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {['public', 'private'].map(v => (
                  <button
                    key={v}
                    onClick={() => setInfo(i => ({ ...i, visibility: v }))}
                    style={{
                      padding: '16px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                      border: `1px solid ${info.visibility === v ? 'var(--brand)' : 'var(--border)'}`,
                      background: info.visibility === v ? 'var(--brand-glow)' : 'var(--bg-muted)',
                      color: info.visibility === v ? 'var(--brand)' : 'var(--text-secondary)',
                      transition: 'var(--transition)', textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{v === 'public' ? '🌍' : '🔒'}</div>
                    <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{v}</div>
                    <div style={{ fontSize: '0.75rem', marginTop: 2 }}>
                      {v === 'public' ? 'Searchable by anyone' : 'Only via course code'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 6, fontSize: '0.9rem' }}>Course Code</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <code style={{
                  fontFamily: 'var(--font-mono)', fontSize: '1.4rem', letterSpacing: '0.16em',
                  color: 'var(--brand)', background: 'var(--bg-muted)', padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                }}>{courseCode}</code>
                <CopyButton text={courseCode} />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
                Share this code with students to let them join your course directly.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Module Modal */}
      <Modal open={showAddModule} onClose={() => setShowAddModule(false)} title="Add Module"
        footer={<><Button variant="secondary" onClick={() => setShowAddModule(false)}>Cancel</Button><Button onClick={addModule}>Add</Button></>}
      >
        <Input label="Module Title" placeholder="e.g. Introduction to Variables" value={newModTitle} onChange={e => setNewModTitle(e.target.value)} />
      </Modal>

      {/* Add Lesson Modal */}
      <Modal open={showAddLesson} onClose={() => setShowAddLesson(false)} title="Add Lesson"
        footer={<><Button variant="secondary" onClick={() => setShowAddLesson(false)}>Cancel</Button><Button onClick={addLesson}>Add Lesson</Button></>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Lesson Title" placeholder="e.g. What is a Variable?" value={newLesson.title} onChange={e => setNewLesson(l => ({ ...l, title: e.target.value }))} />
          <Select label="Lesson Type" value={newLesson.type} onChange={e => setNewLesson(l => ({ ...l, type: e.target.value }))} options={LESSON_TYPES} />
          <Input label="Estimated Minutes" type="number" min={1} max={180} value={newLesson.estimatedMinutes} onChange={e => setNewLesson(l => ({ ...l, estimatedMinutes: e.target.value }))} />
        </div>
      </Modal>
    </div>
  )
}

function LessonEditor({ lesson, onChange }) {
  const content = lesson.content || {}

  return (
    <div className="card animate-fade-in" style={{ padding: 24 }}>
      <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{lesson.title}</h3>
      <div style={{ marginBottom: 20 }}>
        <Badge variant="muted">{lesson.type}</Badge>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 8 }}>{lesson.estimatedMinutes} min</span>
      </div>

      {lesson.type === 'text' && (
        <Textarea
          label="Lesson Content"
          rows={10}
          value={content.body || ''}
          onChange={e => onChange({ ...content, body: e.target.value })}
          placeholder="Write your lesson content here. Use clear, engaging language…"
        />
      )}

      {lesson.type === 'image' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Image URL" placeholder="https://..." value={content.imageUrl || ''} onChange={e => onChange({ ...content, imageUrl: e.target.value })} />
          <Textarea label="Caption (optional)" rows={2} value={content.caption || ''} onChange={e => onChange({ ...content, caption: e.target.value })} />
          {content.imageUrl && (
            <img src={content.imageUrl} alt="Preview" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
          )}
        </div>
      )}

      {lesson.type === 'video' && (
        <Input label="Video URL (YouTube embed or direct)" placeholder="https://www.youtube.com/embed/..." value={content.videoUrl || ''} onChange={e => onChange({ ...content, videoUrl: e.target.value })} />
      )}

      {lesson.type === 'quiz' && (
        <QuizEditor questions={content.questions || []} onChange={questions => onChange({ ...content, questions })} />
      )}

      {(lesson.type === 'questionnaire' || lesson.type === 'interactive') && (
        <Alert type="info">This lesson type will have a full editor in the next update. For now, add a text description below.</Alert>
      )}
    </div>
  )
}

function QuizEditor({ questions, onChange }) {
  function addQuestion() {
    onChange([...questions, {
      id: generateId('q'), type: 'multiple_choice',
      prompt: '', options: ['', '', '', ''], answer: 0,
      explanation: '', points: 10,
    }])
  }

  function updateQ(idx, field, value) {
    onChange(questions.map((q, i) => i === idx ? { ...q, [field]: value } : q))
  }

  function updateOption(qIdx, oIdx, value) {
    onChange(questions.map((q, i) => {
      if (i !== qIdx) return q
      const opts = [...q.options]; opts[oIdx] = value
      return { ...q, options: opts }
    }))
  }

  function deleteQ(idx) {
    onChange(questions.filter((_, i) => i !== idx))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label className="input-label">Questions ({questions.length})</label>
        <Button size="sm" icon="plus" onClick={addQuestion}>Add Question</Button>
      </div>
      {questions.map((q, qi) => (
        <div key={q.id} className="card" style={{ padding: 16, background: 'var(--bg-muted)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Question {qi + 1}</span>
            <button className="btn btn-danger btn-sm" onClick={() => deleteQ(qi)}>
              <Icon name="trash" size={13} />
            </button>
          </div>
          <Textarea label="Question Prompt" rows={2} value={q.prompt} onChange={e => updateQ(qi, 'prompt', e.target.value)} placeholder="e.g. What is the derivative of x²?" />
          <div style={{ marginTop: 12 }}>
            <label className="input-label">Answer Options (select the correct one)</label>
            {q.options.map((opt, oi) => (
              <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => updateQ(qi, 'answer', oi)}
                  style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
                    border: `2px solid ${q.answer === oi ? 'var(--success)' : 'var(--border)'}`,
                    background: q.answer === oi ? 'var(--success)' : 'transparent',
                    transition: 'var(--transition)',
                  }}
                />
                <input
                  className="input"
                  placeholder={`Option ${oi + 1}`}
                  value={opt}
                  onChange={e => updateOption(qi, oi, e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <Textarea label="Explanation (shown after answer)" rows={2} value={q.explanation} onChange={e => updateQ(qi, 'explanation', e.target.value)} placeholder="Explain why this is the correct answer…" />
          </div>
        </div>
      ))}
    </div>
  )
}

function defaultContent(type) {
  const defaults = {
    text: { body: '' },
    image: { imageUrl: '', caption: '' },
    video: { videoUrl: '' },
    quiz: { questions: [] },
    questionnaire: { questions: [] },
    interactive: { body: '' },
  }
  return defaults[type] || {}
}
