import { Link, useLocation } from 'react-router-dom'

const LINKS = [
  { path: '/', label: 'FEED' },
  { path: '/compartilhar', label: 'POSTAR' },
  { path: '/admin', label: 'ADMIN' },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 sm:hidden z-50 border-t"
      style={{ backgroundColor: '#0a0a0a', borderColor: '#2a2a2a' }}
    >
      <div className="flex items-stretch">
        {LINKS.map(({ path, label }) => {
          const active = path === '/' ? pathname === '/' : pathname.startsWith(path)
          return (
            <Link
              key={path}
              to={path}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5"
            >
              <span
                className="text-base font-bold leading-none"
                style={{ color: active ? '#e8b84b' : '#333' }}
              >
                +
              </span>
              <span
                className="text-[9px] tracking-widest"
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  color: active ? '#e8b84b' : '#333',
                }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
