import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { type Testemunho } from '@/types'
import TestemunhoCard from '@/components/testemunhos/TestemunhoCard'
import SectionHeader from '@/components/layout/Header'

const ROTATING_WORDS = [
  'hoje', 'agora', 'na semana passada', 'no hospital',
  'às 3 da manhã', 'no silêncio', 'na fila do banco',
]

function LiveCount({ count }: { count: number }) {
  const [n, setN] = useState(count)
  useEffect(() => {
    const id = setInterval(() => setN(v => v + (Math.random() < 0.35 ? 1 : 0)), 4200)
    return () => clearInterval(id)
  }, [])
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mute)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span className="ev-pulse-dot" />
      {n.toLocaleString('pt-BR')} testemunhos
    </span>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse" style={{ borderBottom: '1px solid var(--border)', padding: '12px 16px', display: 'flex', gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-elev)', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 14, width: 160, borderRadius: 4, background: 'var(--bg-elev)', marginBottom: 8 }} />
        <div style={{ height: 14, width: '90%', borderRadius: 4, background: 'var(--bg-elev)', marginBottom: 6 }} />
        <div style={{ height: 14, width: '75%', borderRadius: 4, background: 'var(--bg-elev)', marginBottom: 6 }} />
        <div style={{ height: 14, width: '60%', borderRadius: 4, background: 'var(--bg-elev)' }} />
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

  useEffect(() => {
    const id = setInterval(() => setRotIdx(i => (i + 1) % ROTATING_WORDS.length), 2400)
    return () => clearInterval(id)
  }, [])

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

      {/* Section header */}
      <SectionHeader title="Feed" />

      {/* Compose box */}
      <Link to="/compartilhar" style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          borderBottom: '1px solid var(--border)',
          padding: '12px 16px',
          display: 'flex', gap: 12, alignItems: 'flex-start',
          transition: 'background 0.15s',
          cursor: 'pointer',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {/* Anon avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: 'var(--accent-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: 'var(--accent)',
          }}>+</div>

          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 19, color: 'var(--text-mute)', margin: '8px 0 12px' }}>
              O que Deus fez{' '}
              <span
                key={rotIdx}
                className="ev-rotate-in"
                style={{ color: 'var(--accent)', borderBottom: '1px dashed var(--accent-dim)' }}
              >
                {ROTATING_WORDS[rotIdx]}
              </span>
              {' '}na sua vida?
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {total > 0 && <LiveCount count={total} />}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 18px', borderRadius: 9999,
                background: 'var(--accent)', color: '#000',
                fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700,
                marginLeft: 'auto',
              }}>
                Compartilhar
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Feed tabs (like X: "Para você") */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', position: 'sticky', top: 53, zIndex: 9, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
        <div style={{
          flex: 1, textAlign: 'center', padding: '14px 0',
          fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--text)',
          borderBottom: '2px solid var(--accent)', boxShadow: '0 4px 12px -6px var(--accent-glow-strong)',
        }}>
          Para você
        </div>
        <div style={{
          flex: 1, textAlign: 'center', padding: '14px 0',
          fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-dim)',
        }}>
          Recentes
        </div>
      </div>

      {/* Feed items */}
      {isLoading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

      {error && (
        <div style={{ padding: '60px 16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-dim)' }}>
            Erro ao carregar. Verifique a conexão.
          </p>
        </div>
      )}

      {!isLoading && !error && testemunhos?.length === 0 && (
        <div style={{ padding: '60px 16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 23, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
            Seja o primeiro.
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-dim)', marginBottom: 24 }}>
            Nenhum testemunho publicado ainda.
          </p>
          <Link
            to="/compartilhar"
            style={{ display: 'inline-block', padding: '10px 22px', borderRadius: 9999, background: 'var(--accent)', color: '#000', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}
          >
            Compartilhar agora
          </Link>
        </div>
      )}

      {testemunhos?.map(t => (
        <TestemunhoCard key={t.id} testemunho={t} />
      ))}

      {!isLoading && testemunhos && testemunhos.length > 0 && (
        <div style={{ padding: '32px 16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-mute)' }}>
            Você chegou ao fim. Glória a Deus.
          </p>
        </div>
      )}
    </>
  )
}
