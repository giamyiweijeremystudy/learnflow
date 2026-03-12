// ============================================================
// pages/AdminPage.jsx — Administrator Panel
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext.jsx'
import { getAllUsers, MOCK_COURSES, grantAdmin, revokeAdmin, deleteUser, deleteCourse, getUserById } from '../data/DATA.js'
import { Icon, Button, Badge, Modal, Alert, Tabs } from '../components/UI.jsx'

export default function AdminPage() {
  const { user, isAdmin, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('users')
  const [flash, setFlash] = useState('')
  const [confirmModal, setConfirmModal] = useState(null)

  if (!isAdmin) {
    return (
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--error)' }}>
          <Icon name="lock" size={32} style={{ marginBottom: 12 }} />
          <div style={{ fontWeight: 700 }}>Access Denied</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Admin access required.</div>
        </div>
      </div>
    )
  }

  const users = getAllUsers()
  const courses = [...MOCK_COURSES]

  function showFlash(msg) { setFlash(msg); setTimeout(() => setFlash(''), 3000) }

  function confirmAction() {
    const { type, targetId } = confirmModal
    if (type === 'grant')         { grantAdmin(targetId); showFlash('Admin access granted.') }
    if (type === 'revoke')        { revokeAdmin(targetId); showFlash('Admin access revoked.') }
    if (type === 'delete_user')   { deleteUser(targetId); showFlash('User deleted.') }
    if (type === 'delete_course') { deleteCourse(targetId); showFlash('Course deleted.') }
    refreshUser()
    setConfirmModal(null)
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Admin Panel ⚡</h1>
        <p className="page-subtitle">Full site management. Handle with care.</p>
      </div>

      <div className="content-area">
        {flash && (
          <div className="alert alert-success animate-fade-in" style={{ marginBottom: 20 }}>
            <Icon name="check" size={16} />{flash}
          </div>
        )}

        {/* Stats */}
        <div className="grid-4 animate-fade-in" style={{ marginBottom: 28 }}>
          {[
            { label: 'Total Users',    value: users.length,                                       icon: 'users',  color: 'var(--brand)' },
            { label: 'Admins',         value: users.filter(u => u.isAdmin).length,                icon: 'star',   color: 'var(--accent3)' },
            { label: 'Total Courses',  value: courses.length,                                     icon: 'layers', color: 'var(--accent2)' },
            { label: 'Public Courses', value: courses.filter(c => c.visibility === 'public').length, icon: 'globe',  color: 'var(--accent1)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Icon name={s.icon} size={18} style={{ color: s.color }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{s.label}</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 20 }}>
          <Tabs tabs={[{ label: 'Users', value: 'users' }, { label: 'Courses', value: 'courses' }]} active={tab} onChange={setTab} />
        </div>

        {/* Users Table */}
        {tab === 'users' && (
          <div className="card animate-fade-in" style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-muted)' }}>
                  {['User', 'Email', 'Joined', 'Role', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                          background: 'linear-gradient(135deg, var(--brand), var(--accent1))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.7rem', fontWeight: 700, color: '#07090F',
                        }}>{u.avatar}</div>
                        <span style={{ fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {u.isSuperAdmin ? <Badge variant="accent1">⭐ Super Admin</Badge>
                        : u.isAdmin ? <Badge variant="warning">⚡ Admin</Badge>
                        : <Badge variant="muted">User</Badge>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {u.isSuperAdmin || u.id === user.id ? (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {u.id === user.id ? 'You' : 'Protected'}
                        </span>
                      ) : (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {u.isAdmin ? (
                            <Button size="sm" variant="secondary" onClick={() => setConfirmModal({ type: 'revoke', targetId: u.id, targetName: u.name })}>
                              Revoke Admin
                            </Button>
                          ) : (
                            <Button size="sm" variant="secondary" onClick={() => setConfirmModal({ type: 'grant', targetId: u.id, targetName: u.name })}>
                              Make Admin
                            </Button>
                          )}
                          <Button size="sm" variant="danger" icon="trash" onClick={() => setConfirmModal({ type: 'delete_user', targetId: u.id, targetName: u.name })}>
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Courses Table */}
        {tab === 'courses' && (
          <div className="card animate-fade-in" style={{ overflow: 'auto' }}>
            {courses.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No courses yet.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', minWidth: 560 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-muted)' }}>
                    {['Course', 'Code', 'Visibility', 'Students', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {courses.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600 }}>{c.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.category}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand)', letterSpacing: '0.1em' }}>{c.code}</code>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge variant={c.visibility === 'public' ? 'brand' : 'muted'}>{c.visibility}</Badge>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{c.enrolledCount || 0}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Button size="sm" variant="secondary" icon="edit" onClick={() => navigate(`/teach/edit/${c.id}`)}>Edit</Button>
                          <Button size="sm" variant="danger" icon="trash" onClick={() => setConfirmModal({ type: 'delete_course', targetId: c.id, targetName: c.title })}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <Modal
        open={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title="Confirm Action"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmModal(null)}>Cancel</Button>
            <Button
              variant={confirmModal?.type === 'grant' ? 'primary' : 'danger'}
              onClick={confirmAction}
            >
              Confirm
            </Button>
          </>
        }
      >
        {confirmModal && (
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {confirmModal.type === 'grant' && <>Grant admin access to <strong>{confirmModal.targetName}</strong>? They will be able to manage all courses and users.</>}
            {confirmModal.type === 'revoke' && <>Revoke admin access from <strong>{confirmModal.targetName}</strong>?</>}
            {confirmModal.type === 'delete_user' && <>Permanently delete user <strong>{confirmModal.targetName}</strong>? This cannot be undone.</>}
            {confirmModal.type === 'delete_course' && <>Permanently delete course <strong>"{confirmModal.targetName}"</strong>? This cannot be undone.</>}
          </p>
        )}
      </Modal>
    </div>
  )
}
