import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { type Testemunho, type Categoria, CATEGORIAS } from '@/types'
import TestemunhoCard from '@/components/testemunhos/TestemunhoCard'
import SectionHeader from '@/components/layout/Header'

async function buscarTestemunhos(categoria?: Categoria): Promise<Testemunho[]> {
  let q = supabase
    .from('testemunhos')
    .select('*, usuarios(nome, slug, avatar_url), midias(*)')
    .eq('status', 'aprovado')
    .order('criado_em', { ascending: false })
    .limit(60)
  if (categoria) q = q.eq('categoria', categoria)
  const { data, error } = await q
  if (error) throw error
  return data as Testemunho[]
}

function SkeletonCard() {
  return (
    <div className="animate-pulse" style={{
      background: 'var(--bg-elev)', borderRadius: 16,
      border: '1px solid var(--border)', padding: 20,
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ width: 32, height: 24, borderRadius: 4, background: 'var(--bg-hover)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ height: 14, borderRadius: 4, background: 'var(--bg-hover)' }} />
        <div style={{ height: 14, width: '85%', borderRadius: 4, background: 'var(--bg-hover)' }} />
        <div style={{ height: 14, width: '70%', borderRadius: 4, background: 'var(--bg-hover)' }} />
      </div>
      <div style={{ height: 24, width: 60, borderRadius: 9999, background: 'var(--bg-hover)' }} />
      <div style={{ height: 12, width: '50%', borderRadius: 4, background: 'var(--bg-hover)' }} />
    </div>
  )
}

export default function Feed() {
  const [catFiltro, setCatFiltro] = useState<Categoria | undefined>(undefined)

  const { data: testemunhos, isLoading, error } = useQuery({
    queryKey: ['testemunhos', catFiltro],
    queryFn: () => buscarTestemunhos(catFiltro),
    refetchInterval: 60_000,
  })

  const total = testemunhos?.length ?? 0

  return (
    <>
      <Helmet>
        <title>evangeliza.me — Deus não ficou no passado</title>
      </Helmet>

      <SectionHeader
        title="Veja como Deus está agindo hoje ✨"
        action={
          <Link
            to="/compartilhar"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 9999,
              background: 'var(--bg-dark)', color: '#fff',
              fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            + Novo testemunho
          </Link>
        }
      />

      {/* Category filter pills */}
      <div style={{
        display: 'flex', gap: 8, padding: '12px 16px',
        overflowX: 'auto', borderBottom: '1px solid var(--border)',
        scrollbarWidth: 'none',
      }}>
        <button
          onClick={() => setCatFiltro(undefined)}
          style={{
            padding: '6px 16px', borderRadius: 9999, border: 'none',
            cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
            flexShrink: 0,
            background: !catFiltro ? 'var(--accent)' : 'var(--bg-elev)',
            color: !catFiltro ? '#fff' : 'var(--text-dim)',
            transition: 'background 0.15s, color 0.15s',
          }}
        >Todos</button>
        {Object.entries(CATEGORIAS).map(([k, v]) => {
          const active = catFiltro === k
          return (
            <button
              key={k}
              onClick={() => setCatFiltro(active ? undefined : k as Categoria)}
              style={{
                padding: '6px 16px', borderRadius: 9999,
                border: '1px solid var(--border)',
                cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
                flexShrink: 0,
                background: active ? 'var(--accent)' : 'var(--bg-elev)',
                color: active ? '#fff' : 'var(--text-dim)',
                transition: 'background 0.15s, color 0.15s, border-color 0.15s',
              }}
            >{v}</button>
          )
        })}
      </div>

      {/* Live count */}
      {total > 0 && (
        <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="ev-pulse-dot" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mute)' }}>
            {total.toLocaleString('pt-BR')} testemunhos
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: '48px 16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-dim)' }}>Erro ao carregar. Verifique a conexão.</p>
        </div>
      )}

      {/* Card grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16, padding: 16,
      }}>
        {isLoading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        {testemunhos?.map(t => <TestemunhoCard key={t.id} testemunho={t} />)}
      </div>

      {/* Empty state */}
      {!isLoading && !error && testemunhos?.length === 0 && (
        <div style={{ padding: '60px 16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Seja o primeiro.</p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-dim)', marginBottom: 24 }}>
            {catFiltro ? 'Nenhum testemunho nessa categoria ainda.' : 'Nenhum testemunho publicado ainda.'}
          </p>
          <Link
            to="/compartilhar"
            style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 9999, background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}
          >Compartilhar agora</Link>
        </div>
      )}

      {!isLoading && testemunhos && testemunhos.length > 0 && (
        <div style={{ padding: '32px 16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-mute)' }}>Glória a Deus por cada história. ✦</p>
        </div>
      )}
    </>
  )
}
