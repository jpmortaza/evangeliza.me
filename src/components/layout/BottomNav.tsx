import { NavLink, Link } from 'react-router-dom'

const TABS = [
  {
    to: '/feed', end: true, label: 'Feed',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>,
  },
  {
    to: '/pesquisar', end: false, label: 'Buscar',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" /><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
  },
  { to: '/compartilhar', end: false, label: 'Postar', icon: null },
  {
    to: '/favoritos', end: false, label: 'Favoritos',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>,
  },
  {
    to: '/perfil', end: false, label: 'Perfil',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" /><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
  },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 sm:hidden z-50"
      style={{
        background: 'oklch(0.07 0.022 265 / 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '6px 0 env(safe-area-inset-bottom, 6px)' }}>
        {TABS.map(({ to, end, label, icon }) => {
          if (icon === null) {
            return (
              <Link key={to} to={to} style={{ textDecoration: 'none', flex: 1, display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 2,
                  boxShadow: '0 0 20px var(--accent-glow)',
                  fontSize: 22, color: '#fff', fontWeight: 700,
                }}>+</div>
              </Link>
            )
          }
          return (
            <NavLink key={to} to={to} end={end} style={{ textDecoration: 'none', flex: 1 }}>
              {({ isActive }) => (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '8px 0',
                  color: isActive ? 'var(--accent)' : 'var(--text-dim)',
                  gap: 3,
                }}>
                  {icon}
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: isActive ? 700 : 400 }}>{label}</span>
                </div>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
