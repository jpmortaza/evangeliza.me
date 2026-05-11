import { Link, NavLink } from 'react-router-dom'

function CrossIcon({ size = 14, stroke = 1.6 }: { size?: number; stroke?: number }) {
  const w = size
  const h = size * 1.25
  const armY = h * 0.32
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <rect x={w / 2 - stroke / 2} y={0} width={stroke} height={h} fill="currentColor" />
      <rect x={0} y={armY - stroke / 2} width={w} height={stroke} fill="currentColor" />
    </svg>
  )
}

export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center border-b"
      style={{ background: 'var(--bg)', borderColor: 'var(--border-soft)' }}
    >
      <div className="flex items-center justify-between w-full px-4 sm:px-7">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" style={{ color: 'var(--text)' }}>
          <span style={{ color: 'var(--accent)', display: 'inline-flex', filter: 'drop-shadow(0 0 6px var(--accent-glow-strong))' }}>
            <CrossIcon size={14} stroke={1.6} />
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500, letterSpacing: -0.2 }}>
            evangeliza<span style={{ color: 'var(--accent)' }}>.me</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {[
            { to: '/', label: 'Feed', end: true },
            { to: '/compartilhar', label: 'Postar', end: false },
            { to: '/admin', label: 'Admin', end: false },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                letterSpacing: 0.1,
                padding: '8px 14px',
                color: isActive ? 'var(--text)' : 'var(--text-mute)',
                fontWeight: isActive ? 500 : 400,
                position: 'relative' as const,
                textDecoration: 'none',
              })}
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <span style={{
                      position: 'absolute', left: 14, right: 14, bottom: 4,
                      height: 1, background: 'var(--accent)',
                      boxShadow: '0 0 6px var(--accent-glow-strong)',
                    }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <span
            className="hidden sm:flex items-center gap-2"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--text-dim)' }}
          >
            <span className="ev-pulse-dot" />
            ATIVO
          </span>
          <Link
            to="/compartilhar"
            className="flex items-center gap-1.5 px-3 py-1.5 transition-opacity hover:opacity-80"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.5,
              background: 'var(--accent)',
              color: 'var(--bg-page)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <svg width="9" height="9" viewBox="0 0 9 9">
                <rect x="3.8" y="0" width="1.4" height="9" fill="currentColor" />
                <rect x="0" y="3.8" width="9" height="1.4" fill="currentColor" />
              </svg>
            </span>
            <span className="hidden sm:inline">Compartilhar</span>
            <span className="sm:hidden">Postar</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
