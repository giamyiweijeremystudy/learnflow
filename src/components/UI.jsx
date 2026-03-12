// ============================================================
// components/UI.jsx — Shared UI Components
// ============================================================

import { useState, useRef } from 'react'
import { Icons } from '../styles/GRAPHICS.js'
import { fileToDataUrl } from '../data/DATA.js'

// ── Icon ─────────────────────────────────────────────────────
export function Icon({ name, size = 18, style = {} }) {
  const svg = Icons[name]
  if (!svg) return null
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', width: size, height: size, flexShrink: 0, ...style }}
      dangerouslySetInnerHTML={{ __html: svg }} />
  )
}

// ── Button ───────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = '', icon, onClick, disabled, type = 'button', style = {} }) {
  return (
    <button type={type} className={`btn btn-${variant}${size ? ` btn-${size}` : ''}`}
      onClick={onClick} disabled={disabled} style={style}>
      {icon && <Icon name={icon} size={16} />}{children}
    </button>
  )
}

// ── Avatar ───────────────────────────────────────────────────
export function Avatar({ initials, size = 'md', style = {} }) {
  return <div className={`avatar${size === 'lg' ? ' avatar-lg' : ''}`} style={style}>{initials}</div>
}

// ── Badge ─────────────────────────────────────────────────────
export function Badge({ children, variant = 'brand', icon }) {
  return (
    <span className={`badge badge-${variant}`}>
      {icon && <Icon name={icon} size={10} />}{children}
    </span>
  )
}

// ── Input ─────────────────────────────────────────────────────
export function Input({ label, error, icon, ...props }) {
  return (
    <div className="form-group">
      {label && <label className="input-label">{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex' }}>
            <Icon name={icon} size={16} />
          </span>
        )}
        <input className={`input${error ? ' input-error' : ''}`} style={icon ? { paddingLeft: 38 } : {}} {...props} />
      </div>
      {error && <span className="error-text">{error}</span>}
    </div>
  )
}

// ── Textarea ──────────────────────────────────────────────────
export function Textarea({ label, error, rows = 4, ...props }) {
  return (
    <div className="form-group">
      {label && <label className="input-label">{label}</label>}
      <textarea className={`input${error ? ' input-error' : ''}`} rows={rows} style={{ resize: 'vertical', lineHeight: 1.6 }} {...props} />
      {error && <span className="error-text">{error}</span>}
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────
export function Select({ label, options = [], error, ...props }) {
  return (
    <div className="form-group">
      {label && <label className="input-label">{label}</label>}
      <select className={`input${error ? ' input-error' : ''}`} {...props}>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      {error && <span className="error-text">{error}</span>}
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="close" size={18} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}

// ── Alert ─────────────────────────────────────────────────────
export function Alert({ type = 'info', children, style = {} }) {
  const iconMap = { success: 'check', error: 'close', info: 'quiz' }
  return (
    <div className={`alert alert-${type}`} style={style}>
      <Icon name={iconMap[type] || 'quiz'} size={16} style={{ flexShrink: 0, marginTop: 2 }} />
      <span>{children}</span>
    </div>
  )
}

// ── Spinner ───────────────────────────────────────────────────
export function Spinner({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin" style={{ color: 'var(--brand)' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// ── Progress Bar ──────────────────────────────────────────────
export function ProgressBar({ value, max = 100 }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────
export function EmptyState({ icon = 'book', title, description, action }) {
  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-state-icon"><Icon name={icon} size={28} /></div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  )
}

// ── Copy Button ───────────────────────────────────────────────
export function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)
  return (
    <button className="btn btn-secondary btn-sm" onClick={() => {
      navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800) })
    }}>
      <Icon name={copied ? 'check' : 'copy'} size={14} />{copied ? 'Copied!' : label}
    </button>
  )
}

// ── Tabs ──────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '4px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
      {tabs.map(tab => (
        <button key={tab.value} onClick={() => onChange(tab.value)} style={{
          padding: '7px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 500,
          background: active === tab.value ? 'var(--bg-card)' : 'transparent',
          color: active === tab.value ? 'var(--text)' : 'var(--text-secondary)',
          border: active === tab.value ? '1px solid var(--border-light)' : '1px solid transparent',
          transition: 'var(--transition)', cursor: 'pointer', fontFamily: 'var(--font-body)',
        }}>{tab.label}</button>
      ))}
    </div>
  )
}

// ── Favourite Button ──────────────────────────────────────────
export function FavButton({ isFav, onToggle, style = {} }) {
  return (
    <button onClick={e => { e.stopPropagation(); onToggle() }} title={isFav ? 'Remove favourite' : 'Add to favourites'}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: isFav ? '#F59E0B' : 'var(--text-muted)', transition: 'var(--transition)', display: 'flex', alignItems: 'center', ...style }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    </button>
  )
}

// ── Special Characters Toolbar ────────────────────────────────
const SPECIAL_CHARS = [
  { label: 'Math',    chars: ['∑', '∫', '√', '∞', '≈', '≠', '≤', '≥', 'π', 'Δ', 'θ', 'λ', 'μ', 'σ', 'Ω', '÷', '×', '±', '∂', '∇'] },
  { label: 'Science', chars: ['°', 'Å', '²', '³', '¹', 'α', 'β', 'γ', 'δ', 'ε', 'η', 'ρ', 'τ', 'φ', '⁻', '₀', '₁', '₂', '₃', '₄'] },
  { label: 'Arrows',  chars: ['→', '←', '↑', '↓', '↔', '⇒', '⇐', '⇔', '↗', '↘', '↺', '↻', '⊕', '⊗', '∈', '∉', '⊂', '⊃', '∧', '∨'] },
  { label: 'Punct',   chars: ['\u2026', '\u2014', '\u2013', '\u00AB', '\u00BB', '\u2022', '\u00B7', '\u2020', '\u00A7', '\u00B6', '\u00A9', '\u00AE', '\u2122', '\u00B0', '\u00BF', '\u00D7', '\u00F7', '\u2260', '\u2248', '\u221E'] },
  { label: 'Emoji',   chars: ['✓', '✗', '★', '☆', '♦', '♠', '♣', '♥', '⚡', '💡', '⚠', '✍', '📌', '🎯', '🔑', '💬', '📊', '🧪', '🌍', '🔬'] },
]

export function SpecialCharsToolbar({ onInsert }) {
  const [activeTab, setActiveTab] = useState('Math')
  const current = SPECIAL_CHARS.find(g => g.label === activeTab)
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 6 }}>
      <div style={{ display: 'flex', background: 'var(--bg-muted)', borderBottom: '1px solid var(--border)' }}>
        {SPECIAL_CHARS.map(g => (
          <button key={g.label} onClick={() => setActiveTab(g.label)} style={{
            padding: '5px 12px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
            background: activeTab === g.label ? 'var(--bg-card)' : 'transparent',
            color: activeTab === g.label ? 'var(--brand)' : 'var(--text-muted)',
            border: 'none', borderRight: '1px solid var(--border)',
            transition: 'var(--transition)', fontFamily: 'var(--font-body)',
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>{g.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, padding: 6, background: 'var(--bg-surface)' }}>
        {current?.chars.map((ch, i) => (
          <button key={i} onClick={() => onInsert(ch)} title={ch} style={{
            width: 30, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', cursor: 'pointer', borderRadius: 4,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: 'var(--text)', transition: 'var(--transition)', fontFamily: 'var(--font-mono)',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-glow)'; e.currentTarget.style.borderColor = 'var(--brand)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >{ch}</button>
        ))}
      </div>
    </div>
  )
}

// ── Rich Text Area ────────────────────────────────────────────
export function RichTextArea({ label, value, onChange, placeholder = '', rows = 8 }) {
  const textareaRef = useRef(null)
  const [showChars, setShowChars] = useState(false)
  const [showMedia, setShowMedia] = useState(false)
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaType, setMediaType] = useState('image')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  function insertAtCursor(text) {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const next = value.slice(0, start) + text + value.slice(end)
    onChange({ target: { value: next } })
    setTimeout(() => { el.focus(); el.setSelectionRange(start + text.length, start + text.length) }, 0)
  }

  function insertMedia() {
    if (!mediaUrl.trim()) return
    if (mediaType === 'image') {
      insertAtCursor(`\n[IMG:${mediaUrl.trim()}]\n`)
    } else {
      let url = mediaUrl.trim()
      const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
      if (yt) url = `https://www.youtube.com/embed/${yt[1]}`
      insertAtCursor(`\n[VID:${url}]\n`)
    }
    setMediaUrl(''); setShowMedia(false)
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const dataUrl = await fileToDataUrl(file)
      if (file.type.startsWith('image/')) {
        insertAtCursor(`\n[IMG:${dataUrl}]\n`)
      } else if (file.type.startsWith('video/')) {
        insertAtCursor(`\n[VID_FILE:${dataUrl}]\n`)
      }
    } catch {}
    setUploading(false)
    e.target.value = ''
  }

  return (
    <div className="form-group">
      {label && <label className="input-label">{label}</label>}
      <div style={{ display: 'flex', gap: 6, marginBottom: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setShowChars(s => !s); setShowMedia(false) }}>
          Ω Symbols
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setShowMedia(s => !s); setShowChars(false) }}>
          <Icon name="image" size={13} /> URL
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          <Icon name="image" size={13} /> {uploading ? 'Uploading…' : 'Upload File'}
        </button>
        <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFileUpload} />
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Images & videos stored locally</span>
      </div>

      {showChars && <SpecialCharsToolbar onInsert={insertAtCursor} />}

      {showMedia && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 6, padding: 12, background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 6, width: '100%' }}>
            {['image', 'video'].map(t => (
              <button key={t} type="button" onClick={() => setMediaType(t)} style={{
                padding: '4px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.8rem',
                background: mediaType === t ? 'var(--brand-glow)' : 'transparent',
                border: `1px solid ${mediaType === t ? 'var(--brand)' : 'var(--border)'}`,
                color: mediaType === t ? 'var(--brand)' : 'var(--text-secondary)', fontFamily: 'var(--font-body)',
              }}>{t === 'image' ? '🖼 Image URL' : '▶ YouTube URL'}</button>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input className="input" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)}
              placeholder={mediaType === 'image' ? 'https://example.com/image.jpg' : 'https://youtube.com/watch?v=...'}
              onKeyDown={e => e.key === 'Enter' && insertMedia()} style={{ fontSize: '0.85rem' }} />
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={insertMedia}>Insert</button>
        </div>
      )}

      <textarea ref={textareaRef} className="input" rows={rows} value={value} onChange={onChange}
        placeholder={placeholder} style={{ resize: 'vertical', lineHeight: 1.7, fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }} />
    </div>
  )
}

// ── Rich Content Renderer ─────────────────────────────────────
export function RichContent({ text = '' }) {
  if (!text) return null
  const parts = text.split(/(\[IMG:[^\]]+\]|\[VID:[^\]]+\]|\[VID_FILE:[^\]]{1,200}\])/g)
  return (
    <div style={{ lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
      {parts.map((part, i) => {
        const imgMatch = part.match(/^\[IMG:(.+)\]$/)
        // VID_FILE is a base64 video
        const vidFileMatch = part.match(/^\[VID_FILE:(data:video[^\]]+)\]$/) || part.match(/^\[VID_FILE:(data:.+)\]$/)
        const vidMatch = !vidFileMatch && part.match(/^\[VID:(.+)\]$/)

        if (imgMatch) {
          return (
            <div key={i} style={{ margin: '16px 0' }}>
              <img src={imgMatch[1]} alt="Lesson image"
                style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'block' }}
                onError={e => { e.target.style.display = 'none' }} />
            </div>
          )
        }
        if (vidFileMatch) {
          return (
            <div key={i} style={{ margin: '16px 0' }}>
              <video controls src={vidFileMatch[1]}
                style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'block' }} />
            </div>
          )
        }
        if (vidMatch) {
          return (
            <div key={i} style={{ margin: '16px 0', position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <iframe src={vidMatch[1]} title="Video" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
            </div>
          )
        }
        return <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>
      })}
    </div>
  )
}

// ── Image/Cover Input with URL + File Upload ───────────────────
export function ImageInput({ label, value, onChange, placeholder, showPreview = true }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const dataUrl = await fileToDataUrl(file)
      onChange({ target: { value: dataUrl } })
    } catch {}
    setUploading(false)
    e.target.value = ''
  }

  return (
    <div className="form-group">
      {label && <label className="input-label">{label}</label>}
      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
        <input className="input" value={value} onChange={onChange}
          placeholder={placeholder || 'https://example.com/image.jpg'}
          style={{ flex: 1, fontSize: '0.875rem' }} />
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
          <Icon name="image" size={13} /> {uploading ? '…' : 'Upload'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>
      {showPreview && value && (
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', maxHeight: 160 }}>
          <img src={value} alt="Preview" style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 160 }}
            onError={e => { e.target.style.display = 'none' }} />
        </div>
      )}
    </div>
  )
}

// ── Video Input with URL + File Upload ────────────────────────
export function VideoInput({ label, value, onChange, placeholder }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [inputMode, setInputMode] = useState('url') // 'url' | 'file'

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const dataUrl = await fileToDataUrl(file)
      onChange({ target: { value: dataUrl, isFile: true } })
      setInputMode('file')
    } catch {}
    setUploading(false)
    e.target.value = ''
  }

  const isDataUrl = value?.startsWith('data:')

  return (
    <div className="form-group">
      {label && <label className="input-label">{label}</label>}

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        {['url', 'file'].map(m => (
          <button key={m} type="button" onClick={() => setInputMode(m)} style={{
            padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', cursor: 'pointer',
            background: inputMode === m ? 'var(--brand-glow)' : 'var(--bg-muted)',
            border: `1px solid ${inputMode === m ? 'var(--brand)' : 'var(--border)'}`,
            color: inputMode === m ? 'var(--brand)' : 'var(--text-secondary)', fontFamily: 'var(--font-body)',
          }}>{m === 'url' ? '🔗 YouTube URL' : '📁 Upload File'}</button>
        ))}
      </div>

      {inputMode === 'url' && (
        <input className="input" value={isDataUrl ? '' : (value || '')} onChange={onChange}
          placeholder={placeholder || 'https://www.youtube.com/watch?v=...'} />
      )}

      {inputMode === 'file' && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" className="btn btn-secondary" onClick={() => fileRef.current?.click()} disabled={uploading}
            style={{ flex: 1 }}>
            <Icon name="video" size={15} /> {uploading ? 'Uploading…' : isDataUrl ? 'Replace Video File' : 'Choose Video File'}
          </button>
          <input ref={fileRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={handleFile} />
          {isDataUrl && <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>✓ File loaded</span>}
        </div>
      )}

      {/* Preview */}
      {value && (
        <div style={{ marginTop: 10 }}>
          {isDataUrl ? (
            <video controls src={value} style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'block' }} />
          ) : value.includes('youtube.com/embed') || value.includes('youtu') ? (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <iframe src={value} title="Preview" frameBorder="0" allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
