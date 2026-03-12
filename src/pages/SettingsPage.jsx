// ============================================================
// pages/SettingsPage.jsx — Settings + Account Switching
// Theme is stored in user profile and applied via AuthContext
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, applyUserTheme } from '../utils/AuthContext.jsx'
import { getUserById, saveUser } from '../data/DATA.js'
import { Input, Button, Icon } from '../components/UI.jsx'

export const THEMES = [
  { value: 'dark',   label: 'Dark',   desc: 'Easy on the eyes',  bg: '#07090F', accent: '#38BDF8' },
  { value: 'light',  label: 'Light',  desc: 'Clean and bright',  bg: '#F8FAFC', accent: '#0284C7' },
  { value: 'ocean',  label: 'Ocean',  desc: 'Deep blue tones',   bg: '#071520', accent: '#22D3EE' },
  { value: 'forest', label: 'Forest', desc: 'Calm and natural',  bg: '#071510', accent: '#34D399' },
  { value: 'purple', label: 'Purple', desc: 'Rich and vibrant',  bg: '#0D0714', accent: '#A78BFA' },
  { value: 'sunset', label: 'Sunset', desc: 'Warm amber tones',  bg: '#130A00', accent: '#FB923C' },
]

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
    updateProfile({ theme }) // saves to profile + applies via AuthContext
    flash('Theme applied!')
  }

  function handleSwitch(userId) {
    switchAccount(userId) // also applies that account's saved theme
    navigate('/dashboard')
  }

  function handleUnlink(userId) {
    unlinkAccount(userId)
    flash('Account removed from quick-switch.')
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
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Your theme is saved to your profile — it follows you across devices and account switches.
                  </p>
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

            {/* ── Accounts ── */}
            {tab === 'accounts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h2 style={{ fontWeight: 700, marginBottom: 4 }}>Linked Accounts</h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Switch between accounts instantly — no password needed. Each account keeps its own theme.
                  </p>
                </div>

                {/* Current */}
                <div style={{ padding: 16, background: 'var(--brand-glow)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--brand)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Current Account</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand), var(--accent1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#07090F', flexShrink: 0 }}>
                      {user?.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{user?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'var(--brand)', color: '#07090F', fontSize: '0.7rem', fontWeight: 700 }}>Active</span>
                  </div>
                </div>

                {linkedAccounts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '28px 16px', color: 'var(--text-muted)', fontSize: '0.875rem', background: 'var(--bg-muted)', borderRadius: 'var(--radius-lg)' }}>
                    No other accounts linked yet. Sign out and log in with a different account — it will appear here automatically.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {linkedAccounts.map(acct => (
                      <div key={acct.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent1), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#07090F', flexShrink: 0 }}>
                          {acct.avatar}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{acct.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{acct.email}</div>
                          {acct.isAdmin && <span style={{ fontSize: '0.68rem', color: 'var(--brand)', fontWeight: 600 }}>⚡ Admin</span>}
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Button size="sm" onClick={() => handleSwitch(acct.id)}>Switch</Button>
                          <button onClick={() => handleUnlink(acct.id)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '4px 8px', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.75rem' }}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                  <Button variant="secondary" onClick={() => { logout(); navigate('/login') }}>
                    Sign Out & Switch Account
                  </Button>
                </div>
              </div>
            )}

            {/* ── Danger ── */}
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
