import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { type Testemunho } from '@/types'
import TestemunhoCard from '@/components/testemunhos/TestemunhoCard'

const MONO: React.CSSProperties = { fontFamily: '"Geist Mono", monospace' }

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

function SkeletonCard() {
  return (
    <div className="border-t py-5 animate-pulse" style={{ borderColor: '#2a2a2a' }}>
      <div className="h-2 rounded mb-3 w-40" style={{ backgroundColor: '#1e1e1e' }} />
      <div className="h-5 rounded mb-2 w-3/4" style={{ backgroundColor: '#1e1e1e' }} />
      <div className="space-y-1.5">
        <div className="h-3 rounded" style={{ backgroundColor: '#1e1e1e' }} />
        <div className="h-3 rounded w-5/6" style={{ backgroundColor: '#1e1e1e' }} />
        <div className="h-3 rounded w-4/6" style={{ backgroundColor: '#1e1e1e' }} />
      </div>
    </div>
  )
}

export default function Feed() {
  const { data: testemunhos, isLoading, error } = useQuery({
    queryKey: ['testemunhos'],
    queryFn: buscarTestemunhos,
    refetchInterval: 60_000,
  })

  const total = testemunhos?.length ?? 0

  return (
    <>
      <Helmet>
        <title>evangeliza.me — Deus não ficou no passado</title>
      </Helmet>

      {/* ── HERO ─────────────────────────────────── */}
      <section className="px-4 pt-10 pb-8 border-b" style={{ borderColor: '#2a2a2a' }}>
        <div className="max-w-3xl mx-auto">
          {/* Status badge */}
          <div className="flex items-center gap-2 mb-8">
            <span className="dot-live" style={{ color: '#e8b84b', fontSize: 8 }}>●</span>
            <span className="text-[10px] tracking-widest" style={{ ...MONO, color: '#555' }}>
              SISTEMA ATIVO · V0.1 · MVP
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-bold text-white leading-tight mb-5" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}>
            Deus não ficou<br />
            no passado.{' '}
            <span style={{ color: '#e8b84b' }}>+</span>
          </h1>

          {/* Body */}
          <p className="text-base leading-relaxed mb-8 max-w-xl" style={{ color: '#888' }}>
            Cada registro aqui é uma prova de que Ele continua agindo — agora, hoje, na semana
            passada. No quarto de hospital, na fila do banco, no silêncio das três da manhã.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <Link
              to="/compartilhar"
              className="flex items-center gap-1.5 px-5 py-3 text-sm font-bold tracking-wide transition-opacity hover:opacity-80"
              style={{ ...MONO, backgroundColor: '#e8b84b', color: '#0a0a0a' }}
            >
              + Compartilhar testemunho
            </Link>
            <a
              href="#feed"
              className="px-5 py-3 text-sm border transition-colors hover:border-white"
              style={{ ...MONO, color: '#fff', borderColor: '#2a2a2a' }}
            >
              Ler o feed
            </a>
          </div>

          {/* Live counter */}
          <div className="flex items-center gap-2">
            <span className="dot-live" style={{ color: '#e8b84b', fontSize: 8 }}>●</span>
            <span className="text-[10px] tracking-widest" style={{ ...MONO, color: '#555' }}>
              {total > 0 ? total.toLocaleString('pt-BR') : '—'} · TESTEMUNHOS · PUBLICADOS EM TEMPO REAL
            </span>
          </div>
        </div>
      </section>

      {/* ── FEED ─────────────────────────────────── */}
      <section id="feed" className="px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {/* Feed header */}
          <div className="flex items-center justify-between mb-2 pb-3 border-b" style={{ borderColor: '#1e1e1e' }}>
            <span className="text-[10px] tracking-widest" style={{ ...MONO, color: '#444' }}>
              REGISTROS RECENTES · ORDENADOS POR DATA
            </span>
            <span className="text-[10px] tracking-widest" style={{ ...MONO, color: '#e8b84b' }}>
              AUTO-REFRESH ATIVO
            </span>
          </div>

          {/* Loading */}
          {isLoading && (
            <div>
              {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="py-20 text-center">
              <p className="text-[11px] tracking-widest" style={{ ...MONO, color: '#555' }}>
                ERRO AO CARREGAR · VERIFIQUE A CONEXÃO
              </p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && testemunhos?.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <p className="text-2xl font-bold text-white">Seja o primeiro.</p>
              <p className="text-sm" style={{ color: '#555' }}>
                Nenhum testemunho publicado ainda.
              </p>
              <Link
                to="/compartilhar"
                className="inline-flex items-center gap-1.5 px-5 py-3 text-sm font-bold"
                style={{ ...MONO, backgroundColor: '#e8b84b', color: '#0a0a0a' }}
              >
                + Compartilhar agora
              </Link>
            </div>
          )}

          {/* Feed items */}
          {testemunhos?.map(t => (
            <TestemunhoCard key={t.id} testemunho={t} />
          ))}
        </div>
      </section>
    </>
  )
}
