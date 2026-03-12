// ============================================================
// pages/ExplorePage.jsx — Public Course Search & Discovery
// ============================================================

import { useState, useMemo } from 'react'
import { searchCourses, CATEGORIES, DIFFICULTIES } from '../data/DATA.js'
import { Icon, Input, Badge, EmptyState } from '../components/UI.jsx'
import CourseCard from '../components/CourseCard.jsx'

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')

  const results = useMemo(() => {
    let courses = searchCourses(query)
    if (category) courses = courses.filter(c => c.category === category)
    if (difficulty) courses = courses.filter(c => c.difficulty === difficulty)
    return courses
  }, [query, category, difficulty])

  function clearFilters() {
    setQuery(''); setCategory(''); setDifficulty('')
  }

  const hasFilters = query || category || difficulty

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Explore Courses ✦</h1>
        <p className="page-subtitle">Discover from {results.length} public course{results.length !== 1 ? 's' : ''}.</p>
      </div>

      <div className="content-area">
        {/* Search Bar */}
        <div className="animate-fade-in" style={{ marginBottom: 20 }}>
          <div style={{ position: 'relative', maxWidth: 560 }}>
            <span style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none',
            }}>
              <Icon name="search" size={18} />
            </span>
            <input
              className="input"
              placeholder="Search by topic, category, keyword…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ paddingLeft: 44, fontSize: '1rem', height: 48 }}
            />
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
          <FilterPill
            label="All Categories" value="" current={category}
            onSelect={setCategory} options={CATEGORIES}
          />
          <FilterPill
            label="All Levels" value="" current={difficulty}
            onSelect={setDifficulty} options={DIFFICULTIES}
            capitalize
          />
          {hasFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ color: 'var(--text-muted)' }}>
              <Icon name="close" size={14} /> Clear filters
            </button>
          )}
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <EmptyState
            icon="search"
            title="No courses found"
            description={`No public courses match "${query}". Try a different keyword or clear your filters.`}
          />
        ) : (
          <div className="grid-3">
            {results.map((course, i) => (
              <CourseCard key={course.id} course={course} animationDelay={i * 50} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterPill({ label, value, current, onSelect, options, capitalize }) {
  const [open, setOpen] = useState(false)
  const active = current !== ''
  const displayLabel = active
    ? (capitalize ? current.charAt(0).toUpperCase() + current.slice(1) : current)
    : label

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', borderRadius: 'var(--radius-full)',
          background: active ? 'var(--brand-glow)' : 'var(--bg-muted)',
          border: `1px solid ${active ? 'rgba(56,189,248,0.4)' : 'var(--border)'}`,
          color: active ? 'var(--brand)' : 'var(--text-secondary)',
          fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', transition: 'var(--transition)',
        }}
      >
        {displayLabel}
        <Icon name="chevronDown" size={14} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 10,
          background: 'var(--bg-card)', border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          minWidth: 180, overflow: 'hidden', animation: 'fadeIn 0.15s ease',
        }}>
          {[{ label, value: '' }, ...options.map(o => ({ label: capitalize ? o.charAt(0).toUpperCase() + o.slice(1) : o, value: o }))].map(opt => (
            <button
              key={opt.value}
              onClick={() => { onSelect(opt.value); setOpen(false) }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '9px 14px', fontSize: '0.875rem',
                background: current === opt.value ? 'var(--brand-glow)' : 'transparent',
                color: current === opt.value ? 'var(--brand)' : 'var(--text-secondary)',
                cursor: 'pointer', transition: 'var(--transition)',
                borderBottom: '1px solid var(--border)',
              }}
              onMouseEnter={e => { if (current !== opt.value) e.target.style.background = 'var(--bg-muted)' }}
              onMouseLeave={e => { if (current !== opt.value) e.target.style.background = 'transparent' }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
