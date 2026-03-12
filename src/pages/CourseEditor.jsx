// ============================================================
// pages/CourseEditor.jsx — Course Creation & Editing
// ============================================================

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext.jsx'
import {
  getCourseById, DIFFICULTIES, generateId, generateCourseCode,
  getCoverTheme, COVER_THEMES, saveCourse
} from '../data/DATA.js'
import {
  Icon, Button, Input, Textarea, Select, Badge, Modal, Alert,
  Tabs, CopyButton, RichTextArea, SpecialCharsToolbar, ImageInput
} from '../components/UI.jsx'

const LESSON_TYPES = [
  { value: 'text',          label: '📝 Text / Reading' },
  { value: 'image',         label: '🖼️ Image' },
  { value: 'video',         label: '🎬 Video' },
  { value: 'quiz',          label: '❓ Quiz' },
  { value: 'questionnaire', label: '📋 Questionnaire' },
  { value: 'interactive',   label: '⚡ Interactive' },
]

const PRESET_CATEGORIES = [
  'Mathematics', 'Computer Science', 'Science', 'History',
  'Language Arts', 'Art & Music', 'Social Studies', 'Health & PE',
]

export default function CourseEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const isNew = !id
  const existing = id ? getCourseById(id) : null

  if (!isNew && existing && !existing.editorIds?.includes(user?.id) && !isAdmin) {
    return <div style={{ padding: 48, color: 'var(--error)' }}>You don't have edit access to this course.</div>
  }

  const [tab, setTab] = useState('info')
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [info, setInfo] = useState({
    title:       existing?.title       || '',
    description: existing?.description || '',
    category:    existing?.category    || PRESET_CATEGORIES[0],
    customCat:   PRESET_CATEGORIES.includes(existing?.category) ? '' : (existing?.category || ''),
    difficulty:  existing?.difficulty  || 'beginner',
    visibility:  existing?.visibility  || 'public',
    coverImage:  existing?.coverImage  || 'default',
    coverImageUrl: existing?.coverImageUrl || '',
    tags:        existing?.tags?.join(', ') || '',
  })

  const [modules, setModules] = useState(existing?.modules || [])
  const [activeModIdx, setActiveModIdx] = useState(null)
  const [activeLessonIdx, setActiveLessonIdx] = useState(null)
  const [showAddModule, setShowAddModule] = useState(false)
  const [showAddLesson, setShowAddLesson] = useState(false)
  const [newModTitle, setNewModTitle] = useState('')
  const [newLesson, setNewLesson] = useState({ title: '', type: 'text', estimatedMinutes: 10 })
  const [useCustomCat, setUseCustomCat] = useState(!PRESET_CATEGORIES.includes(existing?.category) && !!existing?.category)

  const courseCode = existing?.code || generateCourseCode()

  function setI(field) { return e => setInfo(i => ({ ...i, [field]: e.target.value })) }

  function handleSave() {
    if (!info.title.trim()) { setSaveError('Course title is required.'); return }
    setSaveError('')
    const finalCategory = useCustomCat && info.customCat.trim() ? info.customCat.trim() : info.category
    const courseData = {
      id: existing?.id || generateId('c'),
      title: info.title, description: info.description,
      category: finalCategory, difficulty: info.difficulty,
      visibility: info.visibility, coverImage: info.coverImage,
      coverImageUrl: info.coverImageUrl,
      tags: info.tags.split(',').map(t => t.trim()).filter(Boolean),
      modules, ownerId: user.id,
      editorIds: existing?.editorIds || [user.id],
      code: courseCode,
      enrolledCount: existing?.enrolledCount || 0,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveCourse(courseData)
    setSaved(true)
    setTimeout(() => navigate(`/course/${courseData.id}`), 800)
  }

  function addModule() {
    if (!newModTitle.trim()) return
    setModules(m => [...m, { id: generateId('m'), title: newModTitle.trim(), order: m.length + 1, lessons: [] }])
    setNewModTitle(''); setShowAddModule(false)
    setActiveModIdx(modules.length)
  }

  function addLesson() {
    if (!newLesson.title.trim() || activeModIdx === null) return
    const lesson = {
      id: generateId('l'), title: newLesson.title.trim(), type: newLesson.type,
      estimatedMinutes: parseInt(newLesson.estimatedMinutes) || 10,
      order: modules[activeModIdx].lessons.length + 1,
      content: defaultContent(newLesson.type),
    }
    setModules(mods => mods.map((m, i) => i === activeModIdx ? { ...m, lessons: [...m.lessons, lesson] } : m))
    setNewLesson({ title: '', type: 'text', estimatedMinutes: 10 }); setShowAddLesson(false)
    setActiveLessonIdx(modules[activeModIdx].lessons.length)
  }

  function deleteModule(idx) {
    setModules(m => m.filter((_, i) => i !== idx))
    if (activeModIdx === idx) { setActiveModIdx(null); setActiveLessonIdx(null) }
  }

  function deleteLesson(mi, li) {
    setModules(mods => mods.map((m, i) => i === mi ? { ...m, lessons: m.lessons.filter((_, x) => x !== li) } : m))
    setActiveLessonIdx(null)
  }

  function updateLessonContent(mi, li, content) {
    setModules(mods => mods.map((m, i) => i === mi ? { ...m, lessons: m.lessons.map((l, x) => x === li ? { ...l, content } : l) } : m))
  }

  const currentLesson = activeModIdx !== null && activeLessonIdx !== null ? modules[activeModIdx]?.lessons[activeLessonIdx] : null

  const coverTheme = getCoverTheme(info.coverImage)

  return (
    <div className="main-content">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 8 }}>
              <Icon name="arrowLeft" size={16} /> Back
            </button>
            <h1 className="page-title">{isNew ? 'Create Course ✦' : `Edit: ${info.title || 'Untitled'}`}</h1>
            <p className="page-subtitle">
              Code: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand)', letterSpacing: '0.08em' }}>{courseCode}</code>
              <span style={{ marginLeft: 8 }}><CopyButton text={courseCode} label="Copy" /></span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" onClick={() => navigate(-1)}>Discard</Button>
            <Button icon={saved ? 'check' : 'check'} onClick={handleSave} disabled={saved}>
              {saved ? '✓ Saved!' : 'Save Course'}
            </Button>
          </div>
        </div>
      </div>

      <div className="content-area">
        {saveError && <Alert type="error" style={{ marginBottom: 16 }}>{saveError}</Alert>}
        {saved && <Alert type="success" style={{ marginBottom: 16 }}>Course saved! Redirecting…</Alert>}

        <div style={{ marginBottom: 24 }}>
          <Tabs
            tabs={[{ label: 'Course Info', value: 'info' }, { label: 'Modules & Lessons', value: 'content' }, { label: 'Settings', value: 'settings' }]}
            active={tab} onChange={setTab}
          />
        </div>

        {/* ── INFO TAB ── */}
        {tab === 'info' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Input label="Course Title" placeholder="e.g. Introduction to Algebra" value={info.title} onChange={setI('title')} />
              <Textarea label="Description" placeholder="What will students learn?" value={info.description} onChange={setI('description')} rows={4} />

              {/* Category — preset or custom */}
              <div className="form-group">
                <label className="input-label">Category</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => setUseCustomCat(false)} style={{
                    padding: '5px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', cursor: 'pointer',
                    background: !useCustomCat ? 'var(--brand-glow)' : 'var(--bg-muted)',
                    border: `1px solid ${!useCustomCat ? 'var(--brand)' : 'var(--border)'}`,
                    color: !useCustomCat ? 'var(--brand)' : 'var(--text-secondary)', fontFamily: 'var(--font-body)',
                  }}>Preset</button>
                  <button type="button" onClick={() => setUseCustomCat(true)} style={{
                    padding: '5px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', cursor: 'pointer',
                    background: useCustomCat ? 'var(--brand-glow)' : 'var(--bg-muted)',
                    border: `1px solid ${useCustomCat ? 'var(--brand)' : 'var(--border)'}`,
                    color: useCustomCat ? 'var(--brand)' : 'var(--text-secondary)', fontFamily: 'var(--font-body)',
                  }}>Custom</button>
                </div>
                {!useCustomCat ? (
                  <select className="input" value={info.category} onChange={setI('category')}>
                    {PRESET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <input className="input" placeholder="Type your own category…" value={info.customCat} onChange={setI('customCat')} />
                )}
              </div>

              <Select label="Difficulty" value={info.difficulty} onChange={setI('difficulty')}
                options={DIFFICULTIES.map(d => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1) }))} />
              <Input label="Tags (comma-separated)" placeholder="e.g. algebra, math" value={info.tags} onChange={setI('tags')} />
            </div>

            {/* Cover Theme + Custom Image */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Preview */}
              <div style={{ height: 100, borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
                {info.coverImageUrl ? (
                  <img src={info.coverImageUrl} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '100%', background: `linear-gradient(135deg, ${coverTheme.from}, ${coverTheme.to})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                    {coverTheme.icon}
                  </div>
                )}
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <Badge variant="muted">{info.coverImageUrl ? 'Custom' : coverTheme.label}</Badge>
                </div>
              </div>

              {/* Custom cover URL */}
              <ImageInput label="Custom Cover Image URL (optional)" value={info.coverImageUrl} onChange={setI('coverImageUrl')}
                placeholder="https://example.com/cover.jpg" />

              <label className="input-label" style={{ marginTop: 4 }}>Or choose a theme colour</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {Object.entries(COVER_THEMES).map(([key, theme]) => (
                  <button key={key} type="button" onClick={() => { setInfo(i => ({ ...i, coverImage: key, coverImageUrl: '' })) }} style={{
                    height: 48, borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                    border: `2px solid ${info.coverImage === key && !info.coverImageUrl ? 'white' : 'transparent'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                    transition: 'var(--transition)', opacity: info.coverImageUrl ? 0.5 : 1,
                  }} title={theme.label}>{theme.icon}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CONTENT TAB ── */}
        {tab === 'content' && (
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>
            {/* Module/Lesson tree */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Modules</span>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModule(true)}>
                  <Icon name="plus" size={14} /> Add
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {modules.length === 0 && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 8px' }}>
                    No modules yet.
                  </div>
                )}
                {modules.map((mod, mi) => (
                  <div key={mod.id}>
                    <button onClick={() => { setActiveModIdx(mi); setActiveLessonIdx(null) }} style={{
                      width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 'var(--radius-md)',
                      background: activeModIdx === mi && activeLessonIdx === null ? 'var(--brand-glow)' : 'var(--bg-muted)',
                      border: `1px solid ${activeModIdx === mi && activeLessonIdx === null ? 'rgba(56,189,248,0.3)' : 'var(--border)'}`,
                      color: activeModIdx === mi && activeLessonIdx === null ? 'var(--brand)' : 'var(--text)',
                      cursor: 'pointer', transition: 'var(--transition)',
                      display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', fontWeight: 600, fontFamily: 'var(--font-body)',
                    }}>
                      <Icon name="layers" size={13} />
                      <span style={{ flex: 1 }} className="truncate">{mod.title}</span>
                      <button className="btn btn-ghost btn-sm" style={{ padding: 2, color: 'var(--text-muted)' }}
                        onClick={e => { e.stopPropagation(); deleteModule(mi) }}>
                        <Icon name="trash" size={11} />
                      </button>
                    </button>
                    <div style={{ paddingLeft: 10, marginTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {mod.lessons.map((lesson, li) => (
                        <button key={lesson.id} onClick={() => { setActiveModIdx(mi); setActiveLessonIdx(li) }} style={{
                          width: '100%', textAlign: 'left', padding: '6px 10px', borderRadius: 'var(--radius-sm)',
                          background: activeModIdx === mi && activeLessonIdx === li ? 'rgba(56,189,248,0.08)' : 'transparent',
                          color: activeModIdx === mi && activeLessonIdx === li ? 'var(--brand)' : 'var(--text-secondary)',
                          cursor: 'pointer', transition: 'var(--transition)',
                          display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontFamily: 'var(--font-body)', border: 'none',
                        }}>
                          <span style={{ flex: 1 }} className="truncate">{lesson.title}</span>
                          <button className="btn btn-ghost btn-sm" style={{ padding: 2, color: 'var(--text-muted)' }}
                            onClick={e => { e.stopPropagation(); deleteLesson(mi, li) }}>
                            <Icon name="trash" size={10} />
                          </button>
                        </button>
                      ))}
                      {activeModIdx === mi && (
                        <button className="btn btn-ghost btn-sm" style={{ marginTop: 2, fontSize: '0.76rem', color: 'var(--text-muted)' }}
                          onClick={() => setShowAddLesson(true)}>
                          <Icon name="plus" size={11} /> Add lesson
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lesson editor */}
            <div>
              {!currentLesson ? (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Icon name="edit" size={28} style={{ marginBottom: 12 }} />
                  <p>Select a lesson to edit its content.</p>
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

        {/* ── SETTINGS TAB ── */}
        {tab === 'settings' && (
          <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="input-label">Visibility</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {['public', 'private'].map(v => (
                  <button key={v} type="button" onClick={() => setInfo(i => ({ ...i, visibility: v }))} style={{
                    padding: 16, borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    border: `1px solid ${info.visibility === v ? 'var(--brand)' : 'var(--border)'}`,
                    background: info.visibility === v ? 'var(--brand-glow)' : 'var(--bg-muted)',
                    color: info.visibility === v ? 'var(--brand)' : 'var(--text-secondary)',
                    transition: 'var(--transition)', textAlign: 'center', fontFamily: 'var(--font-body)',
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{v === 'public' ? '🌍' : '🔒'}</div>
                    <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{v}</div>
                    <div style={{ fontSize: '0.73rem', marginTop: 2 }}>
                      {v === 'public' ? 'Searchable by anyone' : 'Only via course code'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 6, fontSize: '0.9rem' }}>Course Code</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', letterSpacing: '0.16em', color: 'var(--brand)', background: 'var(--bg-muted)', padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
                  {courseCode}
                </code>
                <CopyButton text={courseCode} />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
                Share this code with students to let them join directly.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Module Modal */}
      <Modal open={showAddModule} onClose={() => setShowAddModule(false)} title="Add Module"
        footer={<><Button variant="secondary" onClick={() => setShowAddModule(false)}>Cancel</Button><Button onClick={addModule}>Add</Button></>}>
        <Input label="Module Title" placeholder="e.g. Introduction" value={newModTitle} onChange={e => setNewModTitle(e.target.value)} />
      </Modal>

      {/* Add Lesson Modal */}
      <Modal open={showAddLesson} onClose={() => setShowAddLesson(false)} title="Add Lesson"
        footer={<><Button variant="secondary" onClick={() => setShowAddLesson(false)}>Cancel</Button><Button onClick={addLesson}>Add Lesson</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Lesson Title" placeholder="e.g. What is a Variable?" value={newLesson.title} onChange={e => setNewLesson(l => ({ ...l, title: e.target.value }))} />
          <Select label="Lesson Type" value={newLesson.type} onChange={e => setNewLesson(l => ({ ...l, type: e.target.value }))} options={LESSON_TYPES} />
          <Input label="Estimated Minutes" type="number" min={1} max={180} value={newLesson.estimatedMinutes} onChange={e => setNewLesson(l => ({ ...l, estimatedMinutes: e.target.value }))} />
        </div>
      </Modal>
    </div>
  )
}

// ── Lesson Editor ─────────────────────────────────────────────
function LessonEditor({ lesson, onChange }) {
  const content = lesson.content || {}
  return (
    <div className="card animate-fade-in" style={{ padding: 24 }}>
      <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{lesson.title}</h3>
      <div style={{ marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
        <Badge variant="muted">{lesson.type}</Badge>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lesson.estimatedMinutes} min</span>
      </div>

      {lesson.type === 'text' && (
        <RichTextArea label="Lesson Content" rows={12} value={content.body || ''}
          onChange={e => onChange({ ...content, body: e.target.value })}
          placeholder="Write your lesson content here. Use the toolbar to insert images, videos, and special characters…" />
      )}

      {lesson.type === 'image' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ImageInput label="Image URL" value={content.imageUrl || ''} onChange={e => onChange({ ...content, imageUrl: e.target.value })} />
          <Input label="Caption (optional)" value={content.caption || ''} onChange={e => onChange({ ...content, caption: e.target.value })} placeholder="Describe the image…" />
        </div>
      )}

      {lesson.type === 'video' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="YouTube URL" value={content.videoUrl || ''} onChange={e => {
            let url = e.target.value
            const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
            if (yt) url = `https://www.youtube.com/embed/${yt[1]}`
            onChange({ ...content, videoUrl: url })
          }} placeholder="https://www.youtube.com/watch?v=..." />
          {content.videoUrl && (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <iframe src={content.videoUrl} title="Preview" frameBorder="0" allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
            </div>
          )}
        </div>
      )}

      {lesson.type === 'quiz' && (
        <QuizEditor questions={content.questions || []} onChange={questions => onChange({ ...content, questions })} />
      )}

      {(lesson.type === 'questionnaire' || lesson.type === 'interactive') && (
        <RichTextArea label="Description / Instructions" rows={6} value={content.body || ''}
          onChange={e => onChange({ ...content, body: e.target.value })}
          placeholder="Describe this activity…" />
      )}
    </div>
  )
}

// ── Quiz Editor ───────────────────────────────────────────────
function QuizEditor({ questions, onChange }) {
  function addQ() {
    onChange([...questions, { id: generateId('q'), type: 'multiple_choice', prompt: '', options: ['', '', '', ''], answer: 0, explanation: '', points: 10 }])
  }
  function upQ(idx, field, val) { onChange(questions.map((q, i) => i === idx ? { ...q, [field]: val } : q)) }
  function upOpt(qi, oi, val) {
    onChange(questions.map((q, i) => { if (i !== qi) return q; const o = [...q.options]; o[oi] = val; return { ...q, options: o } }))
  }
  function delQ(idx) { onChange(questions.filter((_, i) => i !== idx)) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label className="input-label">Questions ({questions.length})</label>
        <Button size="sm" icon="plus" onClick={addQ}>Add Question</Button>
      </div>
      {questions.map((q, qi) => (
        <div key={q.id} className="card" style={{ padding: 16, background: 'var(--bg-muted)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-muted)' }}>Question {qi + 1}</span>
            <button className="btn btn-danger btn-sm" onClick={() => delQ(qi)}><Icon name="trash" size={13} /></button>
          </div>
          <Textarea label="Question Prompt" rows={2} value={q.prompt} onChange={e => upQ(qi, 'prompt', e.target.value)} placeholder="e.g. What is 2 + 2?" />
          <div style={{ marginTop: 12 }}>
            <label className="input-label">Options — click the circle to mark correct answer</label>
            {q.options.map((opt, oi) => (
              <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <button type="button" onClick={() => upQ(qi, 'answer', oi)} style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
                  border: `2px solid ${q.answer === oi ? 'var(--success)' : 'var(--border)'}`,
                  background: q.answer === oi ? 'var(--success)' : 'transparent', transition: 'var(--transition)',
                }} />
                <input className="input" placeholder={`Option ${oi + 1}`} value={opt}
                  onChange={e => upOpt(qi, oi, e.target.value)} style={{ flex: 1 }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <Textarea label="Explanation" rows={2} value={q.explanation} onChange={e => upQ(qi, 'explanation', e.target.value)} placeholder="Explain why this is correct…" />
          </div>
        </div>
      ))}
    </div>
  )
}

function defaultContent(type) {
  return { text: { body: '' }, image: { imageUrl: '', caption: '' }, video: { videoUrl: '' }, quiz: { questions: [] }, questionnaire: { body: '' }, interactive: { body: '' } }[type] || {}
}
