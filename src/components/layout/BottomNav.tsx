import { NavLink } from 'react-router-dom'

const TABS = [
  {
    to: '/', end: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/compartilhar', end: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/sobre', end: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v1M12 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/admin', end: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 sm:hidden z-50"
      style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '6px 0 env(safe-area-inset-bottom, 6px)' }}>
        {TABS.map(({ to, end, icon }) => (
          <NavLink key={to} to={to} end={end} style={{ textDecoration: 'none', flex: 1 }}>
            {({ isActive }) => (
              <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                padding: '10px 0',
                color: isActive ? 'var(--accent)' : 'var(--text-dim)',
              }}>
                {icon}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
