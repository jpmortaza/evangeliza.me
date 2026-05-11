import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '@/lib/supabase'
import { type Testemunho } from '@/types'
import TestemunhoCard from '@/components/testemunhos/TestemunhoCard'
import SectionHeader from '@/components/layout/Header'

async function buscarPorTexto(q: string): Promise<Testemunho[]> {
  if (!q.trim()) return []
  const { data, error } = await supabase
    .from('testemunhos')
    .select('*, usuarios(nome, slug, avatar_url), midias(*)')
    .eq('status', 'aprovado')
    .or(`titulo.ilike.%${q}%,conteudo.ilike.%${q}%`)
    .limit(30)
  if (error) throw error
  return data as Testemunho[]
}

export default function Pesquisar() {
  const [query, setQuery] = useState('')
  const [busca, setBusca] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['busca', busca],
    queryFn: () => buscarPorTexto(busca),
    enabled: busca.length >= 3,
  })

  return (
    <>
      <Helmet><title>Pesquisar — evangeliza.me</title></Helmet>
      <SectionHeader title="Pesquisar" />

      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <form onSubmit={e => { e.preventDefault(); setBusca(query) }}>
          <div style={{ position: 'relative' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-mute)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar testemunhos…"
              style={{
                width: '100%', background: 'var(--bg-elev)',
                border: '1px solid var(--border)', borderRadius: 9999,
                color: 'var(--text)', padding: '10px 16px 10px 38px',
                fontSize: 15, fontFamily: 'var(--font-sans)',
              }}
            />
          </div>
        </form>
      </div>

      {busca && isLoading && (
        <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-mute)', fontFamily: 'var(--font-sans)', fontSize: 14 }}>
          Buscando…
        </div>
      )}

      {busca && !isLoading && data?.length === 0 && (
        <div style={{ padding: '60px 16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Nenhum resultado.</p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-dim)' }}>Tente outras palavras.</p>
        </div>
      )}

      {!busca && (
        <div style={{ padding: '60px 16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, color: 'var(--text-mute)' }}>Digite para buscar testemunhos.</p>
        </div>
      )}

      {data?.map(t => <TestemunhoCard key={t.id} testemunho={t} />)}
    </>
  )
}
