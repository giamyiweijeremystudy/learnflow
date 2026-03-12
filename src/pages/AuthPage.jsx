// ============================================================
// pages/AuthPage.jsx — Login & Registration
// ============================================================

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext.jsx'
import { Input, Button, Alert, Spinner } from '../components/UI.jsx'

export default function AuthPage({ mode = 'login' }) {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    let result
    if (isLogin) {
      result = await login(form.email, form.password)
    } else {
      if (!form.name.trim()) { setError('Please enter your name.'); setLoading(false); return }
      result = await register(form.name, form.email, form.password, form.role)
    }
    setLoading(false)
    if (result.error) { setError(result.error); return }
    navigate('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', background: 'var(--bg)',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      {/* Background decor */}
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
      }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)',
        }} />
      </div>

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span dangerouslySetInnerHTML={{ __html: `<svg width="36" height="36" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="7" fill="#38BDF8"/><path d="M7 9 L14 5 L21 9 L21 19 L14 23 L7 19 Z" stroke="white" stroke-width="1.5" fill="none"/><circle cx="14" cy="14" r="2.5" fill="white"/></svg>` }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontStyle: 'italic', color: 'var(--text)' }}>
              LearnFlow
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {isLogin ? 'Welcome back — continue your journey.' : 'Create your account and start learning.'}
          </p>
        </div>

        {/* Card */}
        <div className="card animate-fade-in" style={{ padding: '32px' }}>
          {/* Mode Toggle */}
          <div style={{
            display: 'flex', background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)',
            padding: '4px', marginBottom: 24,
          }}>
            {['Login', 'Sign Up'].map((label, i) => {
              const active = isLogin ? i === 0 : i === 1
              return (
                <button
                  key={label}
                  onClick={() => { setIsLogin(i === 0); setError('') }}
                  style={{
                    flex: 1, padding: '9px', borderRadius: 'var(--radius-sm)',
                    background: active ? 'var(--bg-card)' : 'transparent',
                    border: active ? '1px solid var(--border-light)' : '1px solid transparent',
                    color: active ? 'var(--text)' : 'var(--text-muted)',
                    fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >{label}</button>
              )
            })}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!isLogin && (
              <Input
                label="Full Name"
                placeholder="Your name"
                value={form.name}
                onChange={set('name')}
                icon="user"
                required
              />
            )}
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              icon="user"
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              icon="lock"
              required
            />

            {!isLogin && (
              <div className="form-group">
                <label className="input-label">I am a…</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {['student', 'teacher'].map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, role }))}
                      style={{
                        padding: '12px', borderRadius: 'var(--radius-md)',
                        border: `1px solid ${form.role === role ? 'var(--brand)' : 'var(--border)'}`,
                        background: form.role === role ? 'var(--brand-glow)' : 'var(--bg-muted)',
                        color: form.role === role ? 'var(--brand)' : 'var(--text-secondary)',
                        fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                        textTransform: 'capitalize', transition: 'var(--transition)',
                      }}
                    >
                      {role === 'student' ? '🎓 Student' : '🏫 Teacher'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <Alert type="error">{error}</Alert>}

            <Button type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
              {loading ? <Spinner size={16} /> : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Demo hint */}
          <div style={{
            marginTop: 20, padding: '12px', background: 'var(--bg-muted)',
            borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-muted)',
          }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Demo accounts:</strong><br />
            Teacher: <code style={{ color: 'var(--brand)' }}>alex@example.com</code> / password123<br />
            Student: <code style={{ color: 'var(--brand)' }}>jamie@example.com</code> / password123
          </div>
        </div>
      </div>
    </div>
  )
}
