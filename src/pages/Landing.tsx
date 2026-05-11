import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

/* ── Cross illustration with gradient + orbital ring ── */
function CrossHero() {
  return (
    <div style={{ position: 'relative', width: 220, height: 260, flexShrink: 0 }}>
      <svg width="220" height="260" viewBox="0 0 220 260" fill="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="ch-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="45%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
          </linearGradient>
          <filter id="ch-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ring-glow" x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glow circle */}
        <ellipse cx="110" cy="130" rx="90" ry="90" fill="url(#bg-glow)" />

        {/* Orbital ring */}
        <g transform="rotate(-22 110 130)" filter="url(#ring-glow)">
          <ellipse cx="110" cy="130" rx="86" ry="28" fill="none" stroke="url(#ring-grad)" strokeWidth="2.5" />
          {/* Bright dot on ring */}
          <circle cx="196" cy="130" r="5" fill="#38bdf8" opacity="0.9" />
        </g>

        {/* Cross vertical bar */}
        <rect x="96" y="10" width="28" height="240" rx="14" fill="url(#ch-grad)" filter="url(#ch-glow)" />
        {/* Cross horizontal bar */}
        <rect x="10" y="88" width="200" height="28" rx="14" fill="url(#ch-grad)" filter="url(#ch-glow)" />

        {/* Sparkles */}
        <g fill="#818cf8">
          <polygon points="20,20 23,26 29,26 24,30 26,37 20,33 14,37 16,30 11,26 17,26" transform="scale(0.7) translate(-2,-2)" opacity="0.7" />
          <circle cx="190" cy="40" r="3" opacity="0.6" />
          <circle cx="30" cy="200" r="2.5" opacity="0.5" />
          <circle cx="200" cy="210" r="4" opacity="0.4" />
        </g>
        <g fill="#38bdf8">
          <circle cx="10" cy="90" r="3" opacity="0.5" />
          <circle cx="195" cy="170" r="2" opacity="0.6" />
        </g>
      </svg>
    </div>
  )
}

/* ── Mini cross for logo ── */
function CrossMini() {
  return (
    <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
      <defs>
        <linearGradient id="cm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect x="8.5" y="0" width="5" height="28" rx="2.5" fill="url(#cm-g)" />
      <rect x="0" y="9" width="22" height="5" rx="2.5" fill="url(#cm-g)" />
    </svg>
  )
}

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8">
        <path d="M12 2L13.5 8.5L20 7L15.5 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L8.5 12L4 7L10.5 8.5Z" />
      </svg>
    ),
    title: 'Feed vivo',
    sub: 'Rolagem fluida com destaques e curadoria smart.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#a855f7" strokeWidth="1.8" />
        <rect x="10.5" y="5" width="3" height="14" rx="1.5" fill="#a855f7" />
        <rect x="5" y="10.5" width="14" height="3" rx="1.5" fill="#a855f7" />
      </svg>
    ),
    title: 'Compartilhe em 1 toque',
    sub: 'Rápido, intuitivo e inspirador.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Moderação inteligente',
    sub: 'Aprovação, filtros e insights limpos.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round">
        <polyline points="3 12 7 6 11 16 15 8 19 12" />
      </svg>
    ),
    title: 'Acompanhe o impacto',
    sub: 'Veja como Deus está alcançando mais vidas.',
  },
]

const BADGES = [
  { icon: '✦', label: 'Moderno', color: '#818cf8' },
  { icon: '⚡', label: 'Rápido', color: '#38bdf8' },
  { icon: '♡', label: 'Inspirador', color: '#a855f7' },
]

export default function Landing() {
  return (
    <>
      <Helmet>
        <title>evangeliza.me — Deus não ficou no passado</title>
        <meta name="description" content="A Bíblia é o registro de como Deus agiu no passado. evangeliza.me é o registro de como Ele age hoje." />
      </Helmet>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '85vh',
        background: 'linear-gradient(145deg, #f8faff 0%, #ede9ff 100%)',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative background circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #c4b5fd22, transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, #7dd3fc1a, transparent)', pointerEvents: 'none' }} />

        <div style={{
          maxWidth: 1160, margin: '0 auto',
          padding: 'clamp(48px,7vw,96px) clamp(24px,6vw,64px)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 'clamp(32px,5vw,64px)',
          alignItems: 'center',
          width: '100%',
        }}>
          {/* Left */}
          <div style={{ maxWidth: 640 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'clamp(32px,5vw,52px)' }}>
              <CrossMini />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 700, color: 'var(--text)', letterSpacing: -0.3 }}>
                evangeliza<span className="gradient-text">.me</span>
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(28px,4.5vw,52px)',
              fontWeight: 700,
              lineHeight: 1.18,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              margin: '0 0 clamp(16px,3vw,28px)',
            }}>
              A Bíblia é o registro de como Deus agiu no passado.{' '}
              <span style={{ fontWeight: 800 }}>
                evangeliza.me é o registro de como{' '}
                <span style={{
                  textDecoration: 'underline',
                  textDecorationColor: 'var(--accent)',
                  textDecorationThickness: 3,
                  textUnderlineOffset: 5,
                }}>Deus age hoje</span>.
              </span>
            </h1>

            {/* CTA */}
            <Link
              to="/compartilhar"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                padding: '14px 28px', borderRadius: 9999,
                background: '#fff',
                border: '1.5px solid var(--border)',
                color: 'var(--text)',
                fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 600,
                textDecoration: 'none',
                boxShadow: 'var(--shadow-sm)',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = '' }}
            >
              <span style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #38bdf8, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, color: '#fff', fontWeight: 700, flexShrink: 0,
              }}>✦</span>
              Compartilhe, testemunhe, inspire.
            </Link>
          </div>

          {/* Right: illustration */}
          <CrossHero />
        </div>
      </section>

      {/* ── Features (dark section) ── */}
      <section style={{ background: 'var(--bg-dark)', padding: 'clamp(40px,5vw,64px) clamp(24px,6vw,64px)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 40,
          }}>
            {FEATURES.map((f, i) => (
              <div key={i}>
                <div style={{ marginBottom: 14 }}>{f.icon}</div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>{f.title}</p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'oklch(0.62 0.015 260)', margin: 0, lineHeight: 1.55 }}>{f.sub}</p>
              </div>
            ))}
          </div>

          {/* Badge row */}
          <div style={{ marginTop: 52, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {BADGES.map(b => (
              <div key={b.label} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 22px', borderRadius: 9999,
                background: `${b.color}22`,
                border: `1px solid ${b.color}55`,
                color: b.color,
                fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600,
              }}>
                <span>{b.icon}</span> {b.label}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'oklch(0.50 0.015 260)', margin: 0 }}>
              ✦ Não é sobre nós. É sobre o que Ele faz através de nós. ✦
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
