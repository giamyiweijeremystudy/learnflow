// ============================================================
// components/CourseCard.jsx — Course Card Display
// ============================================================

import { useNavigate } from 'react-router-dom'
import { getCoverTheme } from '../data/DATA.js'
import { Badge, Icon } from './UI.jsx'

const DIFFICULTY_VARIANT = {
  beginner:     'success',
  intermediate: 'warning',
  advanced:     'accent1',
}

export default function CourseCard({ course, showActions, onEdit, animationDelay = 0 }) {
  const navigate = useNavigate()
  const theme = getCoverTheme(course.coverImage)

  return (
    <div
      className="course-card animate-fade-in"
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={() => navigate(`/course/${course.id}`)}
    >
      {/* Cover */}
      <div
        className="course-card-cover"
        style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
      >
        <div className="course-card-cover-icon">{theme.icon}</div>
        {/* Visibility badge top-right */}
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <Badge variant={course.visibility === 'public' ? 'brand' : 'muted'} icon={course.visibility === 'public' ? 'globe' : 'lock'}>
            {course.visibility}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="course-card-body">
        <div className="course-card-meta">
          <Badge variant="muted">{course.category}</Badge>
          <Badge variant={DIFFICULTY_VARIANT[course.difficulty] || 'muted'}>
            {course.difficulty}
          </Badge>
        </div>
        <div className="course-card-title">{course.title}</div>
        <div className="course-card-desc">{course.description}</div>
      </div>

      {/* Footer */}
      <div className="course-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="users" size={13} />
          <span>{course.enrolledCount.toLocaleString()} students</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="layers" size={13} />
          <span>{course.modules.length} modules</span>
        </div>
        {showActions && (
          <button
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px 8px', marginLeft: 'auto' }}
            onClick={e => { e.stopPropagation(); onEdit && onEdit(course) }}
          >
            <Icon name="edit" size={14} />
            Edit
          </button>
        )}
      </div>
    </div>
  )
}
