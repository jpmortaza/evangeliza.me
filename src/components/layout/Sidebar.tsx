import { NavLink, Link } from 'react-router-dom'

function CrossIcon({ size = 28, stroke = 2.8 }: { size?: number; stroke?: number }) {
  const w = size, h = size * 1.25, armY = h * 0.32
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'inline-block', filter: 'drop-shadow(0 0 8px var(--accent-glow-strong))' }}>
      <rect x={w / 2 - stroke / 2} y={0} width={stroke} height={h} fill="currentColor" />
      <rect x={0} y={armY - stroke / 2} width={w} height={stroke} fill="currentColor" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function PenIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v1M12 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const NAV = [
  { to: '/', label: 'Feed', icon: HomeIcon, end: true },
  { to: '/compartilhar', label: 'Postar', icon: PenIcon, end: false },
  { to: '/sobre', label: 'Sobre', icon: InfoIcon, end: false },
  { to: '/admin', label: 'Admin', icon: ShieldIcon, end: false },
]

export default function Sidebar() {
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', padding: '8px 12px', height: '100%' }}>
      {/* Logo */}
      <Link
        to="/"
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '50%', marginBottom: 4, color: 'var(--accent)', textDecoration: 'none', transition: 'background 0.15s' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-glow)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <CrossIcon size={28} stroke={2.8} />
      </Link>

      {/* Nav items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 18,
                padding: '12px 16px', borderRadius: 9999,
                color: isActive ? 'var(--text)' : 'var(--text-dim)',
                transition: 'background 0.15s',
                fontFamily: 'var(--font-sans)', fontSize: 19,
                fontWeight: isActive ? 700 : 400,
                background: 'transparent',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <Icon />
                <span>{label}</span>
                {isActive && (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', marginLeft: -8, boxShadow: '0 0 8px var(--accent-glow-strong)' }} />
                )}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* Post button */}
      <Link
        to="/compartilhar"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 20, padding: '14px 0', borderRadius: 9999,
          background: 'var(--accent)', color: '#000',
          fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700,
          textDecoration: 'none', gap: 8, transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <rect x="7.6" y="0" width="2.8" height="18" fill="currentColor" />
          <rect x="0" y="7.6" width="18" height="2.8" fill="currentColor" />
        </svg>
        Compartilhar
      </Link>
    </nav>
  )
}
