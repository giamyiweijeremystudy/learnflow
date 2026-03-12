// ============================================================
// components/CourseCard.jsx — Course Card Display
// ============================================================

import { useNavigate } from 'react-router-dom'
import { getCoverTheme } from '../data/DATA.js'
import { useAuth } from '../utils/AuthContext.jsx'
import { Badge, Icon, FavButton } from './UI.jsx'

const DIFFICULTY_VARIANT = {
  beginner:     'success',
  intermediate: 'warning',
  advanced:     'accent1',
}

export default function CourseCard({ course, showActions, onEdit, animationDelay = 0, showFav = false }) {
  const navigate = useNavigate()
  const { toggleFavourite, isFavourite } = useAuth()
  const theme = getCoverTheme(course.coverImage)
  const fav = isFavourite(course.id)

  return (
    <div
      className="course-card animate-fade-in"
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={() => navigate(`/course/${course.id}`)}
    >
      {/* Cover */}
      <div className="course-card-cover" style={{
        background: course.coverImageUrl
          ? `url(${course.coverImageUrl}) center/cover`
          : `linear-gradient(135deg, ${theme.from}, ${theme.to})`
      }}>
        {!course.coverImageUrl && <div className="course-card-cover-icon">{theme.icon}</div>}
        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4, alignItems: 'center' }}>
          {showFav && (
            <FavButton isFav={fav} onToggle={() => toggleFavourite(course.id)}
              style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', padding: 4 }} />
          )}
          <Badge variant={course.visibility === 'public' ? 'brand' : 'muted'} icon={course.visibility === 'public' ? 'globe' : 'lock'}>
            {course.visibility}
          </Badge>
        </div>
        {fav && showFav && (
          <div style={{ position: 'absolute', top: 8, left: 8 }}>
            <span style={{ fontSize: '0.65rem', background: 'rgba(245,158,11,0.9)', color: '#000', padding: '2px 6px', borderRadius: 'var(--radius-full)', fontWeight: 700, letterSpacing: '0.06em' }}>★ FAV</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="course-card-body">
        <div className="course-card-meta">
          <Badge variant="muted">{course.category}</Badge>
          <Badge variant={DIFFICULTY_VARIANT[course.difficulty] || 'muted'}>{course.difficulty}</Badge>
        </div>
        <div className="course-card-title">{course.title}</div>
        <div className="course-card-desc">{course.description}</div>
      </div>

      {/* Footer */}
      <div className="course-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Icon name="users" size={13} />
          <span>{(course.enrolledCount || 0).toLocaleString()} students</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Icon name="layers" size={13} />
          <span>{course.modules?.length || 0} modules</span>
        </div>
        {showActions && (
          <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', marginLeft: 'auto' }}
            onClick={e => { e.stopPropagation(); onEdit && onEdit(course) }}>
            <Icon name="edit" size={14} /> Edit
          </button>
        )}
      </div>
    </div>
  )
}
