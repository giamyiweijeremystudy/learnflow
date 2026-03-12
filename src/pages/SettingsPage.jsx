// ============================================================
// pages/SettingsPage.jsx — Settings + Account Switching
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext.jsx'
import { getUserById, saveUser } from '../data/DATA.js'
import { Input, Button, Alert, Icon } from '../components/UI.jsx'

export const THEMES = [
  { value: 'dark',   label: 'Dark',   desc: 'Easy on the eyes',  bg: '#07090F', accent: '#38BDF8' },
  { value: 'light',  label: 'Light',  desc: 'Clean and bright',  bg: '#F8FAFC', accent: '#0284C7' },
  { value: 'ocean',  label: 'Ocean',  desc: 'Deep blue tones',   bg: '#071520', accent: '#22D3EE' },
  { value: 'forest', label: 'Forest', desc: 'Calm and natural',  bg: '#071510', accent: '#34D399' },
  { value: 'purple', label: 'Purple', desc: 'Rich and vibrant',  bg: '#0D0714', accent: '#A78BFA' },
  { value: 'sunset', label: 'Sunset', desc: 'Warm amber tones',  bg: '#130A00', accent: '#FB923C' },
]

const THEME_VARS = {
  dark:   { bg: '#07090F', bgSurface: '#0D1117', bgCard: '#111827', bgMuted: '#1E293B', brand: '#38BDF8', text: '#F1F5F9', textSec: '#94A3B8', textMuted: '#475569', border: '#1E2D40', borderLight: '#253347' },
  light:  { bg: '#F8FAFC', bgSurface: '#F1F5F9', bgCard: '#FFFFFF', bgMuted: '#E2E8F0', brand: '#0284C7', text: '#0F172A', textSec: '#475569', textMuted: '#94A3B8', border: '#E2E8F0', borderLight: '#CBD5E1' },
  ocean:  { bg: '#071520', bgSurface: '#0A1E2E', bgCard: '#0F2438', bgMuted: '#142d45', brand: '#22D3EE', text: '#E0F2FE', textSec: '#7DD3FC', textMuted: '#38BDF8', border: '#1a3a52', borderLight: '#1e4a68' },
  forest: { bg: '#071510', bgSurface: '#0A1E15', bgCard: '#0F2418', bgMuted: '#142d1e', brand: '#34D399', text: '#DCFCE7', textSec: '#6EE7B7', textMuted: '#34D399', border: '#1a3a24', borderLight: '#1e4a2c' },
  purple: { bg: '#0D0714', bgSurface: '#130A1E', bgCard: '#1A0F28', bgMuted: '#1e1230', brand: '#A78BFA', text: '#EDE9FE', textSec: '#C4B5FD', textMuted: '#A78BFA', border: '#2d1a50', borderLight: '#3d2468' },
  sunset: { bg: '#130A00', bgSurface: '#1E1000', bgCard: '#291600', bgMuted: '#331b00', brand: '#FB923C', text: '#FFF7ED', textSec: '#FED7AA', textMuted: '#FB923C', border: '#4a2800', borderLight: '#5a3400' },
}

export function applyTheme(themeName) {
  const t = THEME_VARS[themeName] || THEME_VARS.dark
  const r = document.documentElement
  r.style.setProperty('--bg', t.bg)
  r.style.setProperty('--bg-surface', t.bgSurface)
  r.style.setProperty('--bg-card', t.bgCard)
  r.style.setProperty('--bg-card-hover', t.bgCard)
  r.style.setProperty('--bg-muted', t.bgMuted)
  r.style.setProperty('--brand', t.brand)
  r.style.setProperty('--brand-dark', t.brand)
  r.style.setProperty('--brand-glow', t.brand + '22')
  r.style.setProperty('--text', t.text)
  r.style.setProperty('--text-secondary', t.textSec)
  r.style.setProperty('--text-muted', t.textMuted)
  r.style.setProperty('--border', t.border)
  r.style.setProperty('--border-light', t.borderLight)
}

const SIDE_TABS = [
  { value: 'profile',    label: 'Profile',    icon: 'user' },
  { value: 'password',   label: 'Password',   icon: 'lock' },
  { value: 'appearance', label: 'Appearance', icon: 'star' },
  { value: 'accounts',   label: 'Accounts',   icon: 'users' },
  { value: 'danger',     label: 'Account',    icon: 'trash' },
]

export default function SettingsPage() {
  const { user, updateProfile, refreshUser, switchAccount, unlinkAccount, getLinkedAccountObjects, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('profile')
  const [saved, setSaved] = useState('')
  const [error, setError] = useState('')
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [selectedTheme, setSelectedTheme] = useState(user?.theme || 'dark')

  function flash(msg, isErr = false) {
    if (isErr) { setError(msg); setSaved('') }
    else { setSaved(msg); setError('') }
    setTimeout(() => { setSaved(''); setError('') }, 3000)
  }

  function saveProfile() {
    if (!name.trim()) { flash('Name cannot be empty.', true); return }
    if (!email.trim()) { flash('Email cannot be empty.', true); return }
    updateProfile({ name: name.trim(), email: email.trim().toLowerCase() })
    flash('Profile updated!')
  }

  function savePassword() {
    const fresh = getUserById(user.id)
    if (!fresh) return
    if (fresh.password !== currentPw) { flash('Current password is incorrect.', true); return }
    if (newPw.length < 6) { flash('New password must be at least 6 characters.', true); return }
    if (newPw !== confirmPw) { flash('Passwords do not match.', true); return }
    saveUser({ ...fresh, password: newPw })
    refreshUser()
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    flash('Password changed!')
  }

  function pickTheme(theme) {
    setSelectedTheme(theme)
    applyTheme(theme)
    updateProfile({ theme })
    flash('Theme applied!')
  }

  function handleSwitch(userId) {
    switchAccount(userId)
    navigate('/dashboard')
  }

  function handleUnlink(userId) {
    unlinkAccount(userId)
    flash('Account removed from quick-switch.')
    refreshUser()
  }

  const linkedAccounts = getLinkedAccountObjects()

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Settings ✦</h1>
        <p className="page-subtitle">Manage your account and preferences.</p>
      </div>
      <div className="content-area">
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, maxWidth: 860 }}>
          {/* Side Nav */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SIDE_TABS.map(t => (
              <button key={t.value} onClick={() => setTab(t.value)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                borderRadius: 'var(--radius-md)', cursor: 'pointer',
                background: tab === t.value ? 'var(--brand-glow)' : 'transparent',
                border: tab === t.value ? '1px solid rgba(56,189,248,0.2)' : '1px solid transparent',
                color: tab === t.value ? 'var(--brand)' : 'var(--text-secondary)',
                fontWeight: tab === t.value ? 600 : 400, fontSize: '0.875rem',
                transition: 'var(--transition)', fontFamily: 'var(--font-body)',
              }}>
                <Icon name={t.icon} size={16} />{t.label}
                {t.value === 'accounts' && linkedAccounts.length > 0 && (
                  <span style={{ marginLeft: 'auto', background: 'var(--brand)', color: '#07090F', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>
                    {linkedAccounts.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="card animate-fade-in" style={{ padding: 28 }}>
            {saved && <div className="alert alert-success" style={{ marginBottom: 20 }}><Icon name="check" size={16} />{saved}</div>}
            {error && <div className="alert alert-error" style={{ marginBottom: 20 }}><Icon name="close" size={16} />{error}</div>}

            {/* ── Profile ── */}
            {tab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h2 style={{ fontWeight: 700, marginBottom: 4 }}>Profile Information</h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Update your display name and email.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand), var(--accent1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700, color: '#07090F', flexShrink: 0 }}>
                    {user?.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{user?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                    {user?.isAdmin && <span className="badge badge-brand" style={{ marginTop: 4 }}>⚡ Admin</span>}
                  </div>
                </div>
                <Input label="Display Name" value={name} onChange={e => setName(e.target.value)} />
                <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                <Button onClick={saveProfile} icon="check">Save Changes</Button>
              </div>
            )}

            {/* ── Password ── */}
            {tab === 'password' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h2 style={{ fontWeight: 700, marginBottom: 4 }}>Change Password</h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Minimum 6 characters.</p>
                </div>
                <Input label="Current Password" type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="••••••••" />
                <Input label="New Password" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="••••••••" />
                <Input label="Confirm New Password" type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="••••••••" />
                <Button onClick={savePassword} icon="lock">Update Password</Button>
              </div>
            )}

            {/* ── Appearance ── */}
            {tab === 'appearance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h2 style={{ fontWeight: 700, marginBottom: 4 }}>Appearance</h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Choose a colour theme for your interface.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {THEMES.map(theme => (
                    <button key={theme.value} onClick={() => pickTheme(theme.value)} style={{
                      padding: '16px 12px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                      border: `2px solid ${selectedTheme === theme.value ? theme.accent : 'transparent'}`,
                      background: theme.bg, transition: 'var(--transition)', textAlign: 'center',
                      boxShadow: selectedTheme === theme.value ? `0 0 20px ${theme.accent}44` : '0 2px 8px rgba(0,0,0,0.4)',
                    }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: theme.accent, margin: '0 auto 8px' }} />
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: theme.value === 'light' ? '#0F172A' : '#F1F5F9' }}>{theme.label}</div>
                      <div style={{ fontSize: '0.7rem', color: theme.value === 'light' ? '#64748B' : '#94A3B8', marginTop: 2 }}>{theme.desc}</div>
                      {selectedTheme === theme.value && (
                        <div style={{ marginTop: 6, color: theme.accent, display: 'flex', justifyContent: 'center' }}>
                          <Icon name="check" size={14} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Accounts / Switch ── */}
            {tab === 'accounts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h2 style={{ fontWeight: 700, marginBottom: 4 }}>Linked Accounts</h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Accounts you've previously logged into on this device. Switch between them instantly — no password needed.
                  </p>
                </div>

                {/* Current account */}
                <div style={{ padding: 16, background: 'var(--brand-glow)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--brand)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                    Current Account
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand), var(--accent1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#07090F', flexShrink: 0 }}>
                      {user?.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{user?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'var(--brand)', color: '#07090F', fontSize: '0.7rem', fontWeight: 700 }}>Active</span>
                    </div>
                  </div>
                </div>

                {/* Linked accounts */}
                {linkedAccounts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '28px 16px', color: 'var(--text-muted)', fontSize: '0.875rem', background: 'var(--bg-muted)', borderRadius: 'var(--radius-lg)' }}>
                    No other accounts linked yet. Log into another account on this device to link it here.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {linkedAccounts.map(acct => (
                      <div key={acct.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', transition: 'var(--transition)' }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent1), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#07090F', flexShrink: 0 }}>
                          {acct.avatar}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{acct.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{acct.email}</div>
                          {acct.isAdmin && <span style={{ fontSize: '0.68rem', color: 'var(--brand)', fontWeight: 600 }}>⚡ Admin</span>}
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Button size="sm" variant="primary" onClick={() => handleSwitch(acct.id)}>
                            Switch
                          </Button>
                          <button onClick={() => handleUnlink(acct.id)} title="Remove from quick-switch" style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '4px 8px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-body)' }}>
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                    Want to add another account? Sign out and log in with a different account — it will automatically appear here.
                  </p>
                  <Button variant="secondary" onClick={() => { logout(); navigate('/login') }}>
                    Sign Out & Switch Account
                  </Button>
                </div>
              </div>
            )}

            {/* ── Danger Zone ── */}
            {tab === 'danger' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h2 style={{ fontWeight: 700, marginBottom: 4 }}>Account</h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Irreversible actions.</p>
                </div>
                <div style={{ padding: 20, border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-lg)', background: 'rgba(239,68,68,0.05)' }}>
                  <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--error)' }}>Delete Account</div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                    Permanently delete your account. This cannot be undone.
                    {user?.isSuperAdmin && ' The original admin account cannot be deleted.'}
                  </p>
                  <button className="btn btn-danger" disabled={!!user?.isSuperAdmin}
                    onClick={() => flash('Account deletion requires a backend — coming soon.', true)}>
                    <Icon name="trash" size={15} /> Delete My Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
