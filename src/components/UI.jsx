// ============================================================
// components/UI.jsx — Shared Reusable UI Components
// ============================================================

import { useState } from 'react'
import { Icons } from '../styles/GRAPHICS.js'

// ── Icon Component ──────────────────────────────────────────
export function Icon({ name, size = 18, style = {} }) {
  const svg = Icons[name]
  if (!svg) return null
  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'center', width: size, height: size, flexShrink: 0, ...style }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

// ── Button ──────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = '', icon, onClick, disabled, type = 'button', style = {} }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}${size ? ` btn-${size}` : ''}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  )
}

// ── Avatar ──────────────────────────────────────────────────
export function Avatar({ initials, size = 'md', style = {} }) {
  return (
    <div className={`avatar${size === 'lg' ? ' avatar-lg' : ''}`} style={style}>
      {initials}
    </div>
  )
}

// ── Badge ───────────────────────────────────────────────────
export function Badge({ children, variant = 'brand', icon }) {
  return (
    <span className={`badge badge-${variant}`}>
      {icon && <Icon name={icon} size={10} />}
      {children}
    </span>
  )
}

// ── Input ───────────────────────────────────────────────────
export function Input({ label, error, icon, ...props }) {
  return (
    <div className="form-group">
      {label && <label className="input-label">{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex'
          }}>
            <Icon name={icon} size={16} />
          </span>
        )}
        <input
          className={`input${error ? ' input-error' : ''}`}
          style={icon ? { paddingLeft: 38 } : {}}
          {...props}
        />
      </div>
      {error && <span className="error-text">{error}</span>}
    </div>
  )
}

// ── Textarea ─────────────────────────────────────────────────
export function Textarea({ label, error, rows = 4, ...props }) {
  return (
    <div className="form-group">
      {label && <label className="input-label">{label}</label>}
      <textarea
        className={`input${error ? ' input-error' : ''}`}
        rows={rows}
        style={{ resize: 'vertical', lineHeight: 1.6 }}
        {...props}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  )
}

// ── Select ───────────────────────────────────────────────────
export function Select({ label, options = [], error, ...props }) {
  return (
    <div className="form-group">
      {label && <label className="input-label">{label}</label>}
      <select className={`input${error ? ' input-error' : ''}`} {...props}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="error-text">{error}</span>}
    </div>
  )
}

// ── Modal ───────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}

// ── Alert ───────────────────────────────────────────────────
export function Alert({ type = 'info', children }) {
  const iconMap = { success: 'check', error: 'close', info: 'quiz' }
  return (
    <div className={`alert alert-${type}`}>
      <Icon name={iconMap[type] || 'quiz'} size={16} style={{ flexShrink: 0, marginTop: 2 }} />
      <span>{children}</span>
    </div>
  )
}

// ── Spinner ──────────────────────────────────────────────────
export function Spinner({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin" style={{ color: 'var(--brand)' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// ── Progress Bar ─────────────────────────────────────────────
export function ProgressBar({ value, max = 100 }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}

// ── Empty State ──────────────────────────────────────────────
export function EmptyState({ icon = 'book', title, description, action }) {
  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-state-icon">
        <Icon name={icon} size={28} />
      </div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  )
}

// ── Copy Button ──────────────────────────────────────────────
export function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
      <Icon name={copied ? 'check' : 'copy'} size={14} />
      {copied ? 'Copied!' : label}
    </button>
  )
}

// ── Tabs ─────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 4, padding: '4px',
      background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)',
      width: 'fit-content',
    }}>
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          style={{
            padding: '7px 16px', borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem', fontWeight: 500,
            background: active === tab.value ? 'var(--bg-card)' : 'transparent',
            color: active === tab.value ? 'var(--text)' : 'var(--text-secondary)',
            border: active === tab.value ? '1px solid var(--border-light)' : '1px solid transparent',
            transition: 'var(--transition)', cursor: 'pointer',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
