import { NavLink } from 'react-router-dom'

function PlusIcon({ size = 10, stroke = 1.4 }: { size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'inline-block' }}>
      <rect x={size / 2 - stroke / 2} y={0} width={stroke} height={size} fill="currentColor" />
      <rect x={0} y={size / 2 - stroke / 2} width={size} height={stroke} fill="currentColor" />
    </svg>
  )
}

function CrossIcon({ size = 14, stroke = 1.6, glow = false }: { size?: number; stroke?: number; glow?: boolean }) {
  const w = size
  const h = size * 1.25
  const armY = h * 0.32
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}
      style={{ display: 'inline-block', filter: glow ? 'drop-shadow(0 0 6px var(--accent-glow-strong))' : 'none' }}>
      <rect x={w / 2 - stroke / 2} y={0} width={stroke} height={h} fill="currentColor" />
      <rect x={0} y={armY - stroke / 2} width={w} height={stroke} fill="currentColor" />
    </svg>
  )
}

const TABS = [
  { to: '/', label: 'Feed', end: true, primary: false },
  { to: '/compartilhar', label: 'Postar', end: false, primary: true },
  { to: '/admin', label: 'Admin', end: false, primary: false },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 sm:hidden z-50 border-t"
      style={{ background: 'var(--bg)', borderColor: 'var(--border-soft)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {TABS.map(({ to, label, end, primary }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            style={{ flex: 1, textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 4, padding: '10px 0',
                color: (primary || isActive) ? 'var(--accent)' : 'var(--text-mute)',
              }}>
                <span style={{ display: 'inline-flex', color: (primary || isActive) ? 'var(--accent)' : 'var(--text-mute)' }}>
                  {primary
                    ? <CrossIcon size={14} stroke={1.6} glow={isActive} />
                    : <PlusIcon size={10} stroke={1.4} />
                  }
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 0.5, textTransform: 'uppercase' as const }}>
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
