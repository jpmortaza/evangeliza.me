import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b h-12 flex items-center"
      style={{ backgroundColor: '#0a0a0a', borderColor: '#2a2a2a' }}
    >
      <div className="flex items-center justify-between w-full px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-base" style={{ color: '#e8b84b' }}>+</span>
          <span
            className="text-sm font-medium text-white tracking-tight"
            style={{ fontFamily: '"Geist Mono", monospace' }}
          >
            evangeliza.me
          </span>
        </Link>

        {/* Desktop nav — center */}
        <nav className="hidden sm:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {[
            { to: '/', label: 'Feed', end: true },
            { to: '/compartilhar', label: 'Postar', end: false },
            { to: '/admin', label: 'Admin', end: false },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className="text-sm pb-px transition-colors"
              style={({ isActive }) => ({
                fontFamily: '"Geist", sans-serif',
                color: isActive ? '#fff' : '#555',
                borderBottom: isActive ? '1px solid #e8b84b' : '1px solid transparent',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <span
            className="hidden sm:flex items-center gap-1.5 text-[10px] tracking-widest"
            style={{ fontFamily: '"Geist Mono", monospace', color: '#555' }}
          >
            <span className="dot-live" style={{ color: '#e8b84b' }}>●</span>
            ATIVO
          </span>
          <Link
            to="/compartilhar"
            className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold tracking-wide transition-opacity hover:opacity-80"
            style={{
              fontFamily: '"Geist Mono", monospace',
              backgroundColor: '#e8b84b',
              color: '#0a0a0a',
            }}
          >
            + <span className="hidden sm:inline">Compartilhar</span>
            <span className="sm:hidden">Postar</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
