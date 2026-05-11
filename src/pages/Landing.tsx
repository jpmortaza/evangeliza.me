import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

function CrossGlow({ size = 48 }: { size?: number }) {
  const vw = size, vh = size * 1.3, bw = size * 0.18, armY = vh * 0.30
  return (
    <svg width={vw} height={vh} viewBox={`0 0 ${vw} ${vh}`} fill="none">
      <defs>
        <linearGradient id="cg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.18 240)" />
          <stop offset="100%" stopColor="oklch(0.62 0.28 292)" />
        </linearGradient>
        <filter id="cf1" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={size * 0.12} result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x={vw / 2 - bw / 2} y={0} width={bw} height={vh} rx={bw / 2} fill="url(#cg1)" filter="url(#cf1)" />
      <rect x={0} y={armY - bw / 2} width={vw} height={bw} rx={bw / 2} fill="url(#cg1)" filter="url(#cf1)" />
    </svg>
  )
}

const FEATURES = [
  { icon: '✝', title: 'Deus no centro', sub: 'Cristo é a nossa base' },
  { icon: '⊛', title: 'Tecnologia a serviço do Reino', sub: 'Inovação com propósito' },
  { icon: '♡', title: 'Histórias que inspiram', sub: 'Edificam e alcançam' },
  { icon: '↗', title: 'Compartilhe esperança', sub: 'Seja luz onde estiver' },
]

export default function Landing() {
  return (
    <>
      <Helmet>
        <title>evangeliza.me — Deus não ficou no passado</title>
        <meta name="description" content="A Bíblia é o registro de como Deus agiu no passado. evangeliza.me é o registro de como Ele age hoje." />
      </Helmet>

      <div style={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse at 15% 40%, oklch(0.22 0.06 265 / 0.6), transparent 55%),
          radial-gradient(ellipse at 85% 80%, oklch(0.18 0.06 292 / 0.5), transparent 50%),
          oklch(0.07 0.022 265)
        `,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Hero */}
        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(40px,8vw,80px) clamp(24px,8vw,80px)' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 'clamp(32px,6vw,56px)' }}>
            <CrossGlow size={40} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(22px,3vw,28px)', fontWeight: 700, color: 'var(--text)', letterSpacing: -0.5 }}>
              evangeliza<span style={{ color: 'var(--accent)' }}>.me</span>
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(28px,5vw,54px)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: -1,
            margin: '0 0 clamp(16px,3vw,28px)',
            maxWidth: 680,
          }}>
            <span style={{ color: 'var(--text)' }}>
              A Bíblia é o registro de como Deus agiu no passado.{' '}
            </span>
            <span style={{ color: 'var(--accent)' }}>
              evangeliza.me é o registro de como Deus age hoje.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(15px,2vw,18px)',
            color: 'var(--text-dim)',
            lineHeight: 1.6,
            margin: '0 0 clamp(28px,5vw,48px)',
            maxWidth: 480,
          }}>
            Relatos reais. Propósitos eternos. Tecnologia para o Reino.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              to="/compartilhar"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 9999,
                background: 'var(--accent)', color: '#fff',
                fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 0 32px var(--accent-glow-strong)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 48px var(--accent-glow-strong)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 0 32px var(--accent-glow-strong)' }}
            >
              <span style={{ fontSize: 16 }}>✦</span> Compartilhe seu testemunho
            </Link>
            <Link
              to="/feed"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 9999,
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600,
                textDecoration: 'none',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text-dim)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              ▶ Ver como funciona
            </Link>
          </div>
        </section>

        {/* Features row */}
        <section style={{
          borderTop: '1px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 0,
        }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              padding: 'clamp(20px,3vw,32px) clamp(20px,3vw,28px)',
              borderRight: i < FEATURES.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ fontSize: 22, marginBottom: 10, color: 'var(--accent)' }}>{f.icon}</div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: '0 0 4px', lineHeight: 1.3 }}>{f.title}</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-mute)', margin: 0 }}>{f.sub}</p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <div style={{
          padding: 'clamp(20px,3vw,28px) clamp(24px,5vw,48px)',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-mute)', margin: 0 }}>
            ✦ Não é sobre nós. É sobre o que Ele faz através de nós. ✦
          </p>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>
            evangeliza.me
          </span>
        </div>
      </div>
    </>
  )
}
