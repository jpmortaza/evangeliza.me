import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-100 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" style={{ fill: '#1E3A5F' }} aria-hidden="true">
            <rect x="10" y="2" width="4" height="20" rx="1" />
            <rect x="3" y="8" width="18" height="4" rx="1" />
          </svg>
          <span>
            <strong className="text-gray-700">evangeliza.me</strong> — feito com amor para Deus
          </span>
        </div>

        <nav className="flex items-center gap-5">
          <Link to="/" className="hover:text-gray-800 transition-colors">
            Testemunhos
          </Link>
          <Link to="/compartilhar" className="hover:text-gray-800 transition-colors">
            Compartilhar
          </Link>
          <Link to="/sobre" className="hover:text-gray-800 transition-colors">
            Sobre
          </Link>
          <a
            href="https://github.com/jpmortaza/evangeliza.me"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800 transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
      <div className="text-center pb-6 text-xs text-gray-400">
        <em>"Ide por todo o mundo e pregai o evangelho a toda criatura." — Marcos 16:15</em>
      </div>
    </footer>
  )
}
