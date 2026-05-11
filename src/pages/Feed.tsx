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
    .select('*, usuarios!testemunhos_usuario_id_fkey(nome, slug, avatar_url), midias(*)')
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
        <div style={{ padding: '64px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚡</div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
            Não foi possível carregar
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-dim)', marginBottom: 20 }}>
            Verifique sua conexão e tente novamente.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '9px 22px', borderRadius: 9999,
              background: 'var(--accent)', color: '#fff', border: 'none',
              fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >Tentar novamente</button>
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
        <div style={{ padding: '48px 16px 64px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', marginBottom: 20,
            background: 'linear-gradient(135deg, oklch(0.65 0.22 215 / 0.15), var(--accent-glow))',
            border: '2px solid var(--accent-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="32" height="32" viewBox="0 0 32 40" fill="none">
              <rect x="12" y="0" width="8" height="40" rx="4" fill="url(#eg-grad)" />
              <rect x="0" y="13" width="32" height="8" rx="4" fill="url(#eg-grad)" />
              <defs>
                <linearGradient id="eg-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8, lineHeight: 1.3 }}>
            {catFiltro ? 'Nenhum testemunho aqui ainda.' : 'Seja o primeiro a testemunhar.'}
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-dim)', marginBottom: 28, lineHeight: 1.6 }}>
            {catFiltro
              ? 'Ainda não há testemunhos nessa categoria. Que tal compartilhar o seu?'
              : 'O seu relato pode encorajar alguém que está esperando um milagre. Conte o que Deus fez por você.'}
          </p>
          <Link
            to="/compartilhar"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 9999,
              background: 'linear-gradient(135deg, oklch(0.65 0.22 215), var(--accent))',
              color: '#fff', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700,
              textDecoration: 'none', boxShadow: '0 4px 20px var(--accent-glow)',
            }}
          >✦ Compartilhar meu testemunho</Link>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-mute)', marginTop: 16 }}>
            Sem login obrigatório · pode postar como anônimo
          </p>
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
