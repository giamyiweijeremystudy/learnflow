// ============================================================
// GRAPHICS.js — LearnFlow Visual System
// Colors, typography, spacing, animation configs, icon sets,
// and reusable styled primitives (all as plain JS/CSS-in-JS).
// ============================================================

// ─── COLOR PALETTE ───────────────────────────────────────────

export const COLORS = {
  // Base
  bg:          '#07090F',
  bgSurface:   '#0D1117',
  bgCard:      '#111827',
  bgCardHover: '#1a2233',
  bgMuted:     '#1E293B',

  // Borders
  border:      '#1E2D40',
  borderLight: '#253347',

  // Brand
  brand:       '#38BDF8',
  brandDark:   '#0284C7',
  brandGlow:   'rgba(56,189,248,0.15)',

  // Accents
  accent1:     '#818CF8', // indigo
  accent2:     '#34D399', // emerald
  accent3:     '#F59E0B', // amber
  accent4:     '#F472B6', // pink

  // Text
  textPrimary:   '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted:     '#475569',

  // Semantic
  success:  '#10B981',
  warning:  '#F59E0B',
  error:    '#EF4444',
  info:     '#38BDF8',
}

// ─── TYPOGRAPHY ───────────────────────────────────────────────

export const FONTS = {
  display: '"DM Serif Display", Georgia, serif',
  body:    '"Sora", system-ui, sans-serif',
  mono:    '"DM Mono", "Fira Code", monospace',
}

export const TYPE_SCALE = {
  xs:   '0.75rem',
  sm:   '0.875rem',
  base: '1rem',
  lg:   '1.125rem',
  xl:   '1.25rem',
  '2xl':'1.5rem',
  '3xl':'1.875rem',
  '4xl':'2.25rem',
  '5xl':'3rem',
  '6xl':'3.75rem',
}

// ─── SPACING ─────────────────────────────────────────────────

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
}

// ─── BORDER RADIUS ────────────────────────────────────────────

export const RADIUS = {
  sm:   '6px',
  md:   '10px',
  lg:   '16px',
  xl:   '24px',
  full: '9999px',
}

// ─── SHADOWS ──────────────────────────────────────────────────

export const SHADOWS = {
  sm:    '0 1px 3px rgba(0,0,0,0.4)',
  md:    '0 4px 16px rgba(0,0,0,0.5)',
  lg:    '0 8px 32px rgba(0,0,0,0.6)',
  brand: '0 0 24px rgba(56,189,248,0.2)',
  card:  '0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
}

// ─── TRANSITIONS ──────────────────────────────────────────────

export const TRANSITIONS = {
  fast:   'all 0.15s ease',
  base:   'all 0.25s ease',
  slow:   'all 0.4s ease',
  spring: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
}

// ─── GLOBAL CSS STRING ────────────────────────────────────────
// Injected via a <style> tag in App.jsx — single source of truth

export const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:           ${COLORS.bg};
    --bg-surface:   ${COLORS.bgSurface};
    --bg-card:      ${COLORS.bgCard};
    --bg-card-hover:${COLORS.bgCardHover};
    --bg-muted:     ${COLORS.bgMuted};
    --border:       ${COLORS.border};
    --border-light: ${COLORS.borderLight};
    --brand:        ${COLORS.brand};
    --brand-dark:   ${COLORS.brandDark};
    --brand-glow:   ${COLORS.brandGlow};
    --accent1:      ${COLORS.accent1};
    --accent2:      ${COLORS.accent2};
    --accent3:      ${COLORS.accent3};
    --accent4:      ${COLORS.accent4};
    --text:         ${COLORS.textPrimary};
    --text-secondary:${COLORS.textSecondary};
    --text-muted:   ${COLORS.textMuted};
    --success:      ${COLORS.success};
    --warning:      ${COLORS.warning};
    --error:        ${COLORS.error};
    --font-display: ${FONTS.display};
    --font-body:    ${FONTS.body};
    --font-mono:    ${FONTS.mono};
    --radius-sm:    ${RADIUS.sm};
    --radius-md:    ${RADIUS.md};
    --radius-lg:    ${RADIUS.lg};
    --radius-xl:    ${RADIUS.xl};
    --radius-full:  ${RADIUS.full};
    --shadow-card:  ${SHADOWS.card};
    --shadow-brand: ${SHADOWS.brand};
    --transition:   ${TRANSITIONS.base};
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; }
  input, textarea, select {
    font-family: inherit;
    background: var(--bg-muted);
    border: 1px solid var(--border);
    color: var(--text);
    outline: none;
    transition: var(--transition);
  }
  input:focus, textarea:focus, select:focus {
    border-color: var(--brand);
    box-shadow: 0 0 0 3px var(--brand-glow);
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg-surface); }
  ::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 12px rgba(56,189,248,0.2); }
    50%       { box-shadow: 0 0 28px rgba(56,189,248,0.5); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6px); }
  }

  .animate-fade-in { animation: fadeIn 0.4s ease both; }
  .animate-slide-in { animation: slideIn 0.3s ease both; }
  .animate-pulse { animation: pulse 2s infinite; }
  .animate-spin { animation: spin 1s linear infinite; }
  .animate-float { animation: float 3s ease-in-out infinite; }

  /* Staggered animation helpers */
  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.10s; }
  .stagger-3 { animation-delay: 0.15s; }
  .stagger-4 { animation-delay: 0.20s; }
  .stagger-5 { animation-delay: 0.25s; }
  .stagger-6 { animation-delay: 0.30s; }

  /* Utility classes */
  .visually-hidden {
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }
  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.08);
  }
`

// ─── ICON COMPONENTS (inline SVG, no dependency) ─────────────

export const Icons = {
  logo: (size = 28) => `
    <svg width="${size}" height="${size}" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="7" fill="#38BDF8"/>
      <path d="M7 9 L14 5 L21 9 L21 19 L14 23 L7 19 Z" stroke="white" stroke-width="1.5" fill="none"/>
      <circle cx="14" cy="14" r="2.5" fill="white"/>
    </svg>`,

  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,18 15,12 9,6"/></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,9 12,15 18,9"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>`,
  video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23,7 16,12 23,17"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  quiz: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  arrowLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`,
  award: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 2,7 12,12 22,7"/><polyline points="2,17 12,22 22,17"/><polyline points="2,12 12,17 22,12"/></svg>`,
  key: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`,
  drag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
}

// ─── REUSABLE COMPONENT STYLES (CSS snippets) ────────────────

export const COMPONENT_STYLES = `
  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: var(--radius-md);
    font-family: var(--font-body); font-size: 0.9rem; font-weight: 600;
    transition: var(--transition); cursor: pointer; border: none;
    letter-spacing: 0.01em; white-space: nowrap;
  }
  .btn svg { width: 16px; height: 16px; flex-shrink: 0; }
  .btn-primary {
    background: var(--brand); color: #07090F;
  }
  .btn-primary:hover { background: #7DD3FC; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(56,189,248,0.3); }
  .btn-secondary {
    background: var(--bg-muted); color: var(--text); border: 1px solid var(--border);
  }
  .btn-secondary:hover { background: var(--bg-card-hover); border-color: var(--border-light); }
  .btn-ghost {
    background: transparent; color: var(--text-secondary);
  }
  .btn-ghost:hover { color: var(--text); background: var(--bg-muted); }
  .btn-danger {
    background: rgba(239,68,68,0.15); color: var(--error); border: 1px solid rgba(239,68,68,0.25);
  }
  .btn-danger:hover { background: rgba(239,68,68,0.25); }
  .btn-sm { padding: 6px 14px; font-size: 0.8rem; }
  .btn-lg { padding: 14px 28px; font-size: 1rem; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

  /* ── Cards ── */
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    transition: var(--transition);
  }
  .card-hover:hover {
    background: var(--bg-card-hover);
    border-color: var(--border-light);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }

  /* ── Form Elements ── */
  .input {
    width: 100%; padding: 10px 14px; border-radius: var(--radius-md);
    background: var(--bg-muted); border: 1px solid var(--border);
    color: var(--text); font-size: 0.9rem;
    transition: var(--transition);
  }
  .input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-glow); }
  .input::placeholder { color: var(--text-muted); }
  .input-label {
    display: block; font-size: 0.82rem; font-weight: 600;
    color: var(--text-secondary); margin-bottom: 6px; letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .input-error { border-color: var(--error) !important; }
  .error-text { color: var(--error); font-size: 0.8rem; margin-top: 4px; }

  /* ── Badge ── */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: var(--radius-full);
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .badge-brand { background: rgba(56,189,248,0.15); color: var(--brand); border: 1px solid rgba(56,189,248,0.25); }
  .badge-success { background: rgba(16,185,129,0.15); color: var(--success); border: 1px solid rgba(16,185,129,0.25); }
  .badge-warning { background: rgba(245,158,11,0.15); color: var(--warning); border: 1px solid rgba(245,158,11,0.25); }
  .badge-muted { background: var(--bg-muted); color: var(--text-muted); border: 1px solid var(--border); }
  .badge-accent1 { background: rgba(129,140,248,0.15); color: var(--accent1); border: 1px solid rgba(129,140,248,0.25); }

  /* ── Progress Bar ── */
  .progress-bar {
    width: 100%; height: 6px; border-radius: var(--radius-full);
    background: var(--bg-muted); overflow: hidden;
  }
  .progress-fill {
    height: 100%; border-radius: var(--radius-full);
    background: linear-gradient(90deg, var(--brand), var(--accent1));
    transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* ── Divider ── */
  .divider {
    border: none; border-top: 1px solid var(--border);
    margin: 24px 0;
  }

  /* ── Skeleton Loader ── */
  .skeleton {
    background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-card-hover) 50%, var(--bg-muted) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: var(--radius-sm);
  }

  /* ── Toast / Alert ── */
  .alert {
    padding: 12px 16px; border-radius: var(--radius-md);
    font-size: 0.875rem; border: 1px solid;
    display: flex; align-items: flex-start; gap: 10px;
  }
  .alert-success { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.3); color: #6EE7B7; }
  .alert-error   { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3);  color: #FCA5A5; }
  .alert-info    { background: rgba(56,189,248,0.1); border-color: rgba(56,189,248,0.3); color: var(--brand); }

  /* ── Modal ── */
  .modal-backdrop {
    position: fixed; inset: 0; background: rgba(7,9,15,0.85);
    backdrop-filter: blur(6px); z-index: 50;
    display: flex; align-items: center; justify-content: center;
    padding: 16px; animation: fadeIn 0.2s ease;
  }
  .modal {
    background: var(--bg-card); border: 1px solid var(--border-light);
    border-radius: var(--radius-xl); max-width: 520px; width: 100%;
    box-shadow: 0 24px 64px rgba(0,0,0,0.7);
    animation: fadeIn 0.25s ease;
  }
  .modal-header {
    padding: 24px 24px 0; display: flex;
    justify-content: space-between; align-items: flex-start;
  }
  .modal-body { padding: 20px 24px; }
  .modal-footer {
    padding: 0 24px 24px; display: flex;
    justify-content: flex-end; gap: 10px;
  }

  /* ── Tag ── */
  .tag {
    display: inline-block; padding: 2px 8px;
    background: var(--bg-muted); color: var(--text-secondary);
    border-radius: var(--radius-sm); font-size: 0.75rem;
  }

  /* ── Sidebar Nav ── */
  .nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: var(--radius-md);
    color: var(--text-secondary); font-size: 0.875rem; font-weight: 500;
    transition: var(--transition); cursor: pointer;
  }
  .nav-link svg { width: 18px; height: 18px; flex-shrink: 0; }
  .nav-link:hover { color: var(--text); background: var(--bg-muted); }
  .nav-link.active { color: var(--brand); background: var(--brand-glow); }

  /* ── Course Card ── */
  .course-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden; cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: var(--shadow-card);
  }
  .course-card:hover {
    border-color: var(--border-light);
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
  }
  .course-card-cover {
    height: 140px; position: relative;
    display: flex; align-items: center; justify-content: center;
  }
  .course-card-cover-icon {
    font-size: 3rem; z-index: 1;
    text-shadow: 0 2px 16px rgba(0,0,0,0.5);
  }
  .course-card-body { padding: 16px; }
  .course-card-meta {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 8px; flex-wrap: wrap;
  }
  .course-card-title {
    font-size: 1rem; font-weight: 700; color: var(--text);
    margin-bottom: 6px; line-height: 1.4;
  }
  .course-card-desc {
    font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .course-card-footer {
    padding: 12px 16px; border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    font-size: 0.8rem; color: var(--text-muted);
  }

  /* ── Empty State ── */
  .empty-state {
    text-align: center; padding: 64px 24px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  .empty-state-icon {
    width: 64px; height: 64px; border-radius: var(--radius-xl);
    background: var(--bg-muted); display: flex;
    align-items: center; justify-content: center;
    color: var(--text-muted);
  }
  .empty-state-icon svg { width: 28px; height: 28px; }
  .empty-state h3 { font-size: 1.1rem; font-weight: 600; color: var(--text); }
  .empty-state p { font-size: 0.875rem; color: var(--text-secondary); max-width: 360px; }
`

// ─── LAYOUT STYLES ────────────────────────────────────────────

export const LAYOUT_STYLES = `
  .app-shell {
    display: flex; min-height: 100vh;
  }
  .sidebar {
    width: 240px; flex-shrink: 0;
    background: var(--bg-surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    position: sticky; top: 0; height: 100vh;
    overflow-y: auto; z-index: 20;
    transition: width 0.3s ease;
  }
  .sidebar-logo {
    padding: 20px 20px 16px;
    display: flex; align-items: center; gap: 10px;
    border-bottom: 1px solid var(--border);
    text-decoration: none;
  }
  .sidebar-logo-text {
    font-family: var(--font-display);
    font-size: 1.3rem; color: var(--text);
    font-style: italic;
  }
  .sidebar-nav {
    padding: 12px; flex: 1;
    display: flex; flex-direction: column; gap: 2px;
  }
  .sidebar-section-label {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--text-muted);
    padding: 8px 14px 4px;
  }
  .sidebar-footer {
    padding: 12px; border-top: 1px solid var(--border);
  }
  .sidebar-user {
    display: flex; align-items: center; gap: 10px;
    padding: 10px; border-radius: var(--radius-md);
    transition: var(--transition); cursor: pointer;
  }
  .sidebar-user:hover { background: var(--bg-muted); }
  .avatar {
    width: 34px; height: 34px; border-radius: var(--radius-full);
    background: linear-gradient(135deg, var(--brand), var(--accent1));
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 700; color: #07090F;
    flex-shrink: 0;
  }
  .avatar-lg { width: 48px; height: 48px; font-size: 1rem; }
  .main-content {
    flex: 1; min-width: 0;
    background: var(--bg);
  }
  .page-header {
    padding: 28px 32px 0;
    border-bottom: 1px solid var(--border);
    padding-bottom: 24px;
    margin-bottom: 28px;
  }
  .page-title {
    font-family: var(--font-display); font-size: 2rem;
    color: var(--text); font-style: italic;
    margin-bottom: 4px;
  }
  .page-subtitle { color: var(--text-secondary); font-size: 0.9rem; }
  .content-area { padding: 0 32px 48px; }
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  @media (max-width: 1200px) { .grid-4 { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 960px)  { .grid-3, .grid-4 { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 700px)  { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } .sidebar { display: none; } }
`
