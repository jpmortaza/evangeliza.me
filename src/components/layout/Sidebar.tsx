import { NavLink, Link } from 'react-router-dom'

function CrossMini() {
  return (
    <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
      <defs>
        <linearGradient id="sb-cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect x="8.5" y="0" width="5" height="28" rx="2.5" fill="url(#sb-cg)" />
      <rect x="0" y="9" width="22" height="5" rx="2.5" fill="url(#sb-cg)" />
    </svg>
  )
}

function HomeIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg> }
function PlusIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="11" y="3" width="2" height="18" rx="1" fill="currentColor" /><rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" /></svg> }
function HeartIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg> }
function ShieldIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg> }
function SearchIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" /><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> }
function InfoIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path d="M12 8v1M12 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> }

const NAV = [
  { to: '/feed', label: 'Feed', Icon: HomeIcon, end: true },
  { to: '/compartilhar', label: 'Novo Testemunho', Icon: PlusIcon, end: false },
  { to: '/pesquisar', label: 'Pesquisar', Icon: SearchIcon, end: false },
  { to: '/favoritos', label: 'Meus Favoritos', Icon: HeartIcon, end: false },
  { to: '/sobre', label: 'Sobre', Icon: InfoIcon, end: false },
  { to: '/admin', label: 'Admin', Icon: ShieldIcon, end: false },
]

export default function Sidebar() {
  return (
    <nav style={{
      display: 'flex', flexDirection: 'column',
      padding: '16px 12px',
      height: '100%',
      background: 'var(--bg-elev)',
    }}>
      {/* Logo */}
      <Link
        to="/"
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px 24px', textDecoration: 'none' }}
      >
        <CrossMini />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700, letterSpacing: -0.3, color: 'var(--text)' }}>
          evangeliza<span style={{
            background: 'linear-gradient(135deg, #38bdf8, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>.me</span>
        </span>
      </Link>

      {/* Nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {NAV.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 10,
                  color: isActive ? 'var(--accent)' : 'var(--text-dim)',
                  background: isActive ? 'var(--accent-glow)' : 'transparent',
                  fontFamily: 'var(--font-sans)', fontSize: 15,
                  fontWeight: isActive ? 700 : 400,
                  transition: 'background 0.12s, color 0.12s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)' }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <Icon />
                {label}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* CTA */}
      <Link
        to="/compartilhar"
        style={{
          display: 'block', textAlign: 'center',
          margin: '8px 4px 12px',
          padding: '12px 0', borderRadius: 10,
          background: 'linear-gradient(135deg, oklch(0.65 0.22 215), var(--accent))',
          color: '#fff',
          fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 4px 16px var(--accent-glow)',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        ✦ Compartilhar
      </Link>
    </nav>
  )
}
