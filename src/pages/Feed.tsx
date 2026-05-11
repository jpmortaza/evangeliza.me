import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { type Testemunho } from '@/types'
import TestemunhoCard from '@/components/testemunhos/TestemunhoCard'

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)' }

const ROTATING_WORDS = [
  'hoje', 'agora', 'na semana passada', 'no hospital',
  'às 3 da manhã', 'no silêncio', 'na fila do banco',
]

function CrossIcon({ size = 44, stroke = 3, glow = false }: { size?: number; stroke?: number; glow?: boolean }) {
  const w = size
  const h = size * 1.25
  const armY = h * 0.32
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', filter: glow ? 'drop-shadow(0 0 8px var(--accent-glow-strong))' : 'none' }}>
      <rect x={w / 2 - stroke / 2} y={0} width={stroke} height={h} fill="currentColor" />
      <rect x={0} y={armY - stroke / 2} width={w} height={stroke} fill="currentColor" />
    </svg>
  )
}

function LiveBadge({ count }: { count: number }) {
  const [n, setN] = useState(count)
  useEffect(() => {
    const id = setInterval(() => setN(v => v + (Math.random() < 0.35 ? 1 : 0)), 4200)
    return () => clearInterval(id)
  }, [])
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, ...MONO, fontSize: 10.5, letterSpacing: 0.6, textTransform: 'uppercase' as const, color: 'var(--text-dim)' }}>
      <span className="ev-pulse-dot" />
      <span style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
        {n.toLocaleString('pt-BR')}
      </span>
      <span>· Testemunhos · publicados em tempo real</span>
    </span>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse" style={{ padding: '20px 0', borderTop: '1px solid var(--border-soft)' }}>
      <div style={{ height: 8, borderRadius: 2, marginBottom: 12, width: 160, background: 'var(--bg-elev)' }} />
      <div style={{ height: 20, borderRadius: 2, marginBottom: 8, width: '75%', background: 'var(--bg-elev)' }} />
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
        <div style={{ height: 12, borderRadius: 2, background: 'var(--bg-elev)' }} />
        <div style={{ height: 12, borderRadius: 2, width: '83%', background: 'var(--bg-elev)' }} />
        <div style={{ height: 12, borderRadius: 2, width: '66%', background: 'var(--bg-elev)' }} />
      </div>
    </div>
  )
}

async function buscarTestemunhos(): Promise<Testemunho[]> {
  const { data, error } = await supabase
    .from('testemunhos')
    .select('*, usuarios(nome, slug, avatar_url), midias(*)')
    .eq('status', 'aprovado')
    .order('criado_em', { ascending: false })
    .limit(50)
  if (error) throw error
  return data as Testemunho[]
}

export default function Feed() {
  const [rotIdx, setRotIdx] = useState(0)
  const feedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setInterval(() => setRotIdx(i => (i + 1) % ROTATING_WORDS.length), 2200)
    return () => clearInterval(id)
  }, [])

  const { data: testemunhos, isLoading, error } = useQuery({
    queryKey: ['testemunhos'],
    queryFn: buscarTestemunhos,
    refetchInterval: 60_000,
  })

  const total = testemunhos?.length ?? 2847

  return (
    <>
      <Helmet>
        <title>evangeliza.me — Deus não ficou no passado</title>
      </Helmet>

      {/* ── HERO ─────────────────────────────────── */}
      <section style={{ padding: 'clamp(28px, 6vw, 72px) clamp(20px, 5vw, 64px)', borderBottom: '1px solid var(--border-soft)', position: 'relative', overflow: 'hidden' }}>
        {/* Radial glow */}
        <div aria-hidden style={{
          position: 'absolute', top: -180, right: -160,
          width: 560, height: 560,
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800 }}>
          {/* Status badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '3px 8px', border: '1px solid var(--accent-dim)',
              color: 'var(--accent)', ...MONO, fontSize: 10, letterSpacing: 0.6,
              textTransform: 'uppercase' as const,
            }}>
              <span className="ev-pulse-dot" />
              SISTEMA ATIVO
            </span>
            <span style={{ ...MONO, fontSize: 10, letterSpacing: 0.6, color: 'var(--text-mute)', textTransform: 'uppercase' as const }}>
              v0.1 · MVP
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(38px, 8vw, 76px)',
            fontWeight: 500,
            letterSpacing: 'clamp(-1.5px, -0.04em, -3.2px)',
            lineHeight: 0.97,
            margin: 0,
            color: 'var(--text)',
          }}>
            Deus não ficou<br />
            no passado.
            <span style={{ color: 'var(--accent)', marginLeft: 8, display: 'inline-block', verticalAlign: 'middle' }}>
              <CrossIcon size={44} stroke={3} glow />
            </span>
          </h1>

          {/* Rotating tagline */}
          <div style={{
            marginTop: 28,
            display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' as const, gap: '0 10px',
            fontFamily: 'var(--font-sans)', fontSize: 'clamp(15px, 2.5vw, 19px)',
            color: 'var(--text-dim)', lineHeight: 1.45,
          }}>
            <span>Veja o que ele fez</span>
            <span
              key={rotIdx}
              className="ev-rotate-in"
              style={{
                color: 'var(--accent)',
                borderBottom: '1px dashed var(--accent-dim)',
                minWidth: 160,
              }}
            >
              {ROTATING_WORDS[rotIdx]}
            </span>
            <span>— de uma pessoa comum.</span>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const, marginTop: 36 }}>
            <Link
              to="/compartilhar"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 18px', background: 'var(--accent)',
                color: 'var(--bg-page)', fontFamily: 'var(--font-sans)',
                fontSize: 13.5, fontWeight: 500, textDecoration: 'none',
                letterSpacing: 0.1, transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <svg width="10" height="10" viewBox="0 0 10 10">
                <rect x="4.3" y="0" width="1.4" height="10" fill="currentColor" />
                <rect x="0" y="4.3" width="10" height="1.4" fill="currentColor" />
              </svg>
              Compartilhar testemunho
            </Link>
            <button
              onClick={() => feedRef.current?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '11px 18px', background: 'transparent',
                color: 'var(--text)', fontFamily: 'var(--font-sans)',
                fontSize: 13.5, border: '1px solid var(--border)',
                cursor: 'pointer', letterSpacing: 0.1, transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              Ler o feed
            </button>
          </div>

          {/* Live counter */}
          <div style={{ marginTop: 44, paddingTop: 20, borderTop: '1px solid var(--border-soft)' }}>
            <LiveBadge count={total} />
          </div>
        </div>
      </section>

      {/* ── FEED ─────────────────────────────────── */}
      <section ref={feedRef} style={{ padding: 'clamp(20px, 4vw, 32px) clamp(16px, 5vw, 32px) 80px' }}>
        <div className="max-w-3xl mx-auto">
          {/* Feed header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border-soft)', marginBottom: 0 }}>
            <span style={{ ...MONO, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase' as const, color: 'var(--text-mute)' }}>
              Registros recentes · ordenados por data
            </span>
            <span style={{ ...MONO, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase' as const, color: 'var(--accent)' }}>
              auto-refresh ativo
            </span>
          </div>

          {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}

          {error && (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <p style={{ ...MONO, fontSize: 11, color: 'var(--text-mute)', letterSpacing: 0.6, textTransform: 'uppercase' as const }}>
                ERRO AO CARREGAR · VERIFIQUE A CONEXÃO
              </p>
            </div>
          )}

          {!isLoading && !error && testemunhos?.length === 0 && (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>
                Seja o primeiro.
              </p>
              <p style={{ ...MONO, fontSize: 11, color: 'var(--text-mute)', marginBottom: 24, textTransform: 'uppercase' as const }}>
                Nenhum testemunho publicado ainda.
              </p>
              <Link
                to="/compartilhar"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 18px', background: 'var(--accent)', color: 'var(--bg-page)', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}
              >
                + Compartilhar agora
              </Link>
            </div>
          )}

          {testemunhos?.map(t => (
            <TestemunhoCard key={t.id} testemunho={t} />
          ))}

          {!isLoading && testemunhos && testemunhos.length > 0 && (
            <div style={{ padding: '32px 0', textAlign: 'center' }}>
              <span style={{ ...MONO, fontSize: 10, color: 'var(--text-mute)', letterSpacing: 0.6, textTransform: 'uppercase' as const }}>
                fim dos registros visíveis
              </span>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
