import { Link, NavLink } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_GROUP_LINK

export default function Header() {
  return (
    <header style={{ backgroundColor: '#1E3A5F' }} className="text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <rect x="10" y="2" width="4" height="20" rx="1" />
            <rect x="3" y="8" width="18" height="4" rx="1" />
          </svg>
          <span className="font-bold text-lg tracking-tight">evangeliza.me</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'font-semibold' : 'text-white/75 hover:text-white transition-colors'
            }
            style={({ isActive }) => (isActive ? { color: '#C9933B' } : {})}
          >
            Testemunhos
          </NavLink>
          <NavLink
            to="/sobre"
            className={({ isActive }) =>
              isActive ? 'font-semibold' : 'text-white/75 hover:text-white transition-colors'
            }
            style={({ isActive }) => (isActive ? { color: '#C9933B' } : {})}
          >
            Sobre
          </NavLink>
          {WHATSAPP && (
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/75 hover:text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Comunidade
            </a>
          )}
        </nav>

        <Link
          to="/compartilhar"
          className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors text-white shrink-0"
          style={{ backgroundColor: '#C9933B' }}
          onMouseEnter={e => ((e.target as HTMLElement).style.backgroundColor = '#b8832d')}
          onMouseLeave={e => ((e.target as HTMLElement).style.backgroundColor = '#C9933B')}
        >
          Compartilhar
        </Link>
      </div>
    </header>
  )
}
