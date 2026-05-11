import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/auth/AuthModal'

function CrossMini() {
  return (
    <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
      <defs>
        <linearGradient id="sb-cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect x="8.5" y="0" width="5" height="28" rx="2.5" fill="url(#sb-cg)" />
      <rect x="0" y="9" width="22" height="5" rx="2.5" fill="url(#sb-cg)" />
    </svg>
  )
}

function HomeIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg> }
function PlusIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="11" y="3" width="2" height="18" rx="1" fill="currentColor" /><rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" /></svg> }
function HeartIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg> }
function ShieldIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg> }
function SearchIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" /><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> }
function InfoIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path d="M12 8v1M12 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> }

const NAV_BASE = [
  { to: '/', label: 'Feed', Icon: HomeIcon, end: true },
  { to: '/compartilhar', label: 'Novo Testemunho', Icon: PlusIcon, end: false },
  { to: '/pesquisar', label: 'Pesquisar', Icon: SearchIcon, end: false },
  { to: '/favoritos', label: 'Meus Favoritos', Icon: HeartIcon, end: false },
  { to: '/sobre', label: 'Sobre', Icon: InfoIcon, end: false },
]

const NAV_ADMIN = { to: '/admin', label: 'Admin', Icon: ShieldIcon, end: false }

export default function Sidebar() {
  const { user, isZelador, signOut } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'entrar' | 'cadastrar'>('entrar')

  const openAuth = (mode: 'entrar' | 'cadastrar') => {
    setAuthMode(mode)
    setShowAuth(true)
  }

  const displayName = user?.user_metadata?.nome ?? user?.email?.split('@')[0] ?? 'Conta'
  const initials = displayName[0].toUpperCase()

  return (
    <>
      <nav style={{
        display: 'flex', flexDirection: 'column',
        padding: '16px 12px',
        height: '100%',
        background: 'var(--bg-elev)',
      }}>
      {/* Logo */}
      <Link
        to="/"
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px 24px', textDecoration: 'none' }}
      >
        <CrossMini />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700, letterSpacing: -0.3, color: 'var(--text)' }}>
          evangeliza<span style={{
            background: 'linear-gradient(135deg, #38bdf8, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>.me</span>
        </span>
      </Link>

      {/* Nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {[...NAV_BASE, ...(isZelador ? [NAV_ADMIN] : [])].map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 10,
                  color: isActive ? 'var(--accent)' : 'var(--text-dim)',
                  background: isActive ? 'var(--accent-glow)' : 'transparent',
                  fontFamily: 'var(--font-sans)', fontSize: 15,
                  fontWeight: isActive ? 700 : 400,
                  transition: 'background 0.12s, color 0.12s',
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

      {/* CTA */}
      <Link
        to="/compartilhar"
        style={{
          display: 'block', textAlign: 'center',
          margin: '8px 4px 12px',
          padding: '12px 0', borderRadius: 10,
          background: 'linear-gradient(135deg, oklch(0.65 0.22 215), var(--accent))',
          color: '#fff',
          fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 4px 16px var(--accent-glow)',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        ✦ Compartilhar
      </Link>

      {/* Auth section */}
      {user ? (
        <div style={{ padding: '0 4px 16px', display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #c4b5fd, #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</p>
          </div>
          <button
            onClick={signOut}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mute)', fontSize: 12, fontFamily: 'var(--font-sans)', padding: '4px 6px', borderRadius: 6, flexShrink: 0 }}
            title="Sair"
          >Sair</button>
        </div>
      ) : (
        <div style={{ padding: '0 4px 16px', display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <button
            onClick={() => openAuth('entrar')}
            style={{
              padding: '9px 0', borderRadius: 9, border: '1.5px solid var(--border)',
              background: 'var(--bg-elev)', color: 'var(--text)',
              fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >Entrar</button>
          <button
            onClick={() => openAuth('cadastrar')}
            style={{
              padding: '9px 0', borderRadius: 9, border: 'none',
              background: 'linear-gradient(135deg, oklch(0.65 0.22 215), var(--accent))',
              color: '#fff',
              fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
              cursor: 'pointer',
            }}
          >Criar conta</button>
        </div>
      )}
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultMode={authMode} />}
    </>
  )
}
