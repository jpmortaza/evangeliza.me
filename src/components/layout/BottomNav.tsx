import { NavLink, Link } from 'react-router-dom'

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 sm:hidden z-50"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -4px 24px rgba(15,23,96,0.06)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '6px 16px env(safe-area-inset-bottom, 6px)' }}>

        {/* Feed */}
        <NavLink to="/" end style={{ textDecoration: 'none', flex: 1 }}>
          {({ isActive }) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0', gap: 3, color: isActive ? 'var(--accent)' : 'var(--text-mute)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: isActive ? 700 : 400 }}>Feed</span>
            </div>
          )}
        </NavLink>

        {/* Favoritos */}
        <NavLink to="/favoritos" style={{ textDecoration: 'none', flex: 1 }}>
          {({ isActive }) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0', gap: 3, color: isActive ? 'var(--accent)' : 'var(--text-mute)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: isActive ? 700 : 400 }}>Favoritos</span>
            </div>
          )}
        </NavLink>

        {/* Center + button */}
        <Link to="/compartilhar" style={{ textDecoration: 'none', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, oklch(0.65 0.22 215), var(--accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px var(--accent-glow-strong)',
            fontSize: 24, color: '#fff', fontWeight: 700,
          }}>+</div>
        </Link>

        {/* Pesquisar */}
        <NavLink to="/pesquisar" style={{ textDecoration: 'none', flex: 1 }}>
          {({ isActive }) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0', gap: 3, color: isActive ? 'var(--accent)' : 'var(--text-mute)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" /><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: isActive ? 700 : 400 }}>Buscar</span>
            </div>
          )}
        </NavLink>

        {/* Perfil */}
        <NavLink to="/perfil" style={{ textDecoration: 'none', flex: 1 }}>
          {({ isActive }) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0', gap: 3, color: isActive ? 'var(--accent)' : 'var(--text-mute)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" /><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: isActive ? 700 : 400 }}>Perfil</span>
            </div>
          )}
        </NavLink>

      </div>
    </nav>
  )
}
