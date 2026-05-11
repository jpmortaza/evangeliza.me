import { NavLink, Link } from 'react-router-dom'

function CrossLogo({ size = 32 }: { size?: number }) {
  const vw = size, vh = size * 1.28, bw = size * 0.19, armY = vh * 0.30
  return (
    <svg width={vw} height={vh} viewBox={`0 0 ${vw} ${vh}`} fill="none">
      <defs>
        <linearGradient id="sl-cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.80 0.18 240)" />
          <stop offset="100%" stopColor="oklch(0.62 0.28 292)" />
        </linearGradient>
        <filter id="sl-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation={size * 0.14} result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x={vw / 2 - bw / 2} y={0} width={bw} height={vh} rx={bw / 2} fill="url(#sl-cg)" filter="url(#sl-glow)" />
      <rect x={0} y={armY - bw / 2} width={vw} height={bw} rx={bw / 2} fill="url(#sl-cg)" filter="url(#sl-glow)" />
    </svg>
  )
}

function HomeIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg> }
function SearchIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" /><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> }
function PenIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg> }
function HeartIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg> }
function InfoIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path d="M12 8v1M12 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> }
function UserIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" /><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> }
function ShieldIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg> }

const NAV = [
  { to: '/feed', label: 'Feed', Icon: HomeIcon, end: true },
  { to: '/pesquisar', label: 'Pesquisar', Icon: SearchIcon, end: false },
  { to: '/compartilhar', label: 'Postar', Icon: PenIcon, end: false },
  { to: '/favoritos', label: 'Favoritos', Icon: HeartIcon, end: false },
  { to: '/sobre', label: 'Sobre', Icon: InfoIcon, end: false },
  { to: '/perfil', label: 'Perfil', Icon: UserIcon, end: false },
  { to: '/admin', label: 'Admin', Icon: ShieldIcon, end: false },
]

export default function Sidebar() {
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', padding: '8px 12px', height: '100%' }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 8px 20px', textDecoration: 'none' }}>
        <CrossLogo size={30} />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, letterSpacing: -0.3, color: 'var(--text)' }}>
          evangeliza<span style={{ color: 'var(--accent)' }}>.me</span>
        </span>
      </Link>

      {/* Nav items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {NAV.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '11px 14px', borderRadius: 9999,
                  color: isActive ? 'var(--accent)' : 'var(--text)',
                  background: isActive ? 'var(--accent-glow)' : 'transparent',
                  fontFamily: 'var(--font-sans)', fontSize: 17,
                  fontWeight: isActive ? 700 : 400,
                  transition: 'background 0.15s, color 0.15s',
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

      {/* Compartilhar CTA */}
      <div style={{ padding: '16px 8px 24px' }}>
        <Link
          to="/compartilhar"
          style={{
            display: 'block', textAlign: 'center',
            padding: '14px 0', borderRadius: 9999,
            background: 'var(--accent)', color: '#fff',
            fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 0 24px var(--accent-glow)',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          ✦ Compartilhar
        </Link>
      </div>
    </nav>
  )
}
