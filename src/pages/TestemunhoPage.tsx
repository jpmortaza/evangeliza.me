import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '@/lib/supabase'
import { type Testemunho, CATEGORIAS } from '@/types'
import { formatarDataRelativa, getDisplayId } from '@/lib/utils'
import YouTubeEmbed from '@/components/testemunhos/YouTubeEmbed'
import BotoesCompartilhar from '@/components/compartilhamento/BotoesCompartilhar'
import SectionHeader from '@/components/layout/Header'

async function buscarTestemunho(id: string): Promise<Testemunho> {
  const { data, error } = await supabase
    .from('testemunhos')
    .select('*, usuarios(nome, slug, avatar_url), midias(*)')
    .eq('id', id)
    .eq('status', 'aprovado')
    .single()
  if (error) throw error
  return data as Testemunho
}

function Avatar({ nome, size = 40 }: { nome: string; size?: number }) {
  const letra = nome === 'Anônimo' ? '+' : nome[0].toUpperCase()
  const isAnon = letra === '+'
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: isAnon ? 'var(--accent-dim)' : 'var(--bg-elev)',
      border: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: isAnon ? size * 0.5 : size * 0.44, fontWeight: 700,
      color: isAnon ? 'var(--accent)' : 'var(--text)',
    }}>
      {letra}
    </div>
  )
}

export default function TestemunhoPage() {
  const { id } = useParams<{ id: string }>()

  const { data: t, isLoading, error } = useQuery({
    queryKey: ['testemunho', id],
    queryFn: () => buscarTestemunho(id!),
    enabled: !!id,
  })

  useEffect(() => {
    if (t?.id) {
      supabase.from('testemunhos').update({ visualizacoes: (t.visualizacoes ?? 0) + 1 }).eq('id', t.id).then(() => {})
    }
  }, [t?.id])

  if (isLoading) {
    return (
      <>
        <SectionHeader title="Testemunho" />
        <div className="animate-pulse" style={{ padding: '16px' }}>
          <div style={{ height: 20, width: '70%', borderRadius: 4, background: 'var(--bg-elev)', marginBottom: 12 }} />
          <div style={{ height: 14, borderRadius: 4, background: 'var(--bg-elev)', marginBottom: 8 }} />
          <div style={{ height: 14, width: '80%', borderRadius: 4, background: 'var(--bg-elev)' }} />
        </div>
      </>
    )
  }

  if (error || !t) {
    return (
      <>
        <SectionHeader title="Testemunho" />
        <div style={{ padding: '60px 16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 23, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Não encontrado.</p>
          <Link to="/feed" style={{ color: 'var(--accent)', fontFamily: 'var(--font-sans)', fontSize: 15 }}>← Voltar ao feed</Link>
        </div>
      </>
    )
  }

  const autor = t.eh_anonimo ? 'Anônimo' : (t.usuarios?.nome ?? t.nome_anonimo ?? 'Anônimo')
  const midia = t.midias?.[0]
  const url = `${window.location.origin}/testemunho/${t.id}`
  const displayId = getDisplayId(t.criado_em, t.id)
  const tempo = formatarDataRelativa(t.criado_em)
  const catLabel = t.categoria ? CATEGORIAS[t.categoria] : null

  return (
    <>
      <Helmet>
        <title>{t.titulo} — evangeliza.me</title>
        <meta name="description" content={t.conteudo.slice(0, 160)} />
        <meta property="og:title" content={t.titulo} />
        <meta property="og:description" content={t.conteudo.slice(0, 200)} />
        <meta property="og:url" content={url} />
        {midia?.tipo === 'imagem' && <meta property="og:image" content={midia.url} />}
      </Helmet>

      <SectionHeader title="Testemunho" />

      <article style={{ padding: '16px' }}>
        {/* Author row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <Avatar nome={autor} size={48} />
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{autor}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-dim)' }}>{displayId}</span>
              <span style={{ color: 'var(--text-mute)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-dim)' }}>{tempo}</span>
              {catLabel && (
                <>
                  <span style={{ color: 'var(--text-mute)' }}>·</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase' }}>{catLabel}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 22, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, margin: '0 0 12px' }}>
          {t.titulo}
        </h1>

        {/* Media */}
        {midia?.tipo === 'youtube' && <div style={{ marginBottom: 16, borderRadius: 12, overflow: 'hidden' }}><YouTubeEmbed videoId={midia.url} title={t.titulo} /></div>}
        {midia?.tipo === 'imagem' && <img src={midia.url} alt={t.titulo} style={{ width: '100%', borderRadius: 12, marginBottom: 16, maxHeight: 400, objectFit: 'cover' }} />}

        {/* Content */}
        <div style={{ marginBottom: 16 }}>
          {t.conteudo.split('\n').map((p, i) =>
            p.trim() ? (
              <p key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: 17, lineHeight: 1.6, color: 'var(--text)', margin: '0 0 12px' }}>{p}</p>
            ) : null
          )}
        </div>

        {/* Divider + stats */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-dim)' }}>
            {tempo} · evangeliza.me
          </span>
        </div>

        {/* Share bar */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 360 }}>
          <BotoesCompartilhar titulo={t.titulo} conteudo={t.conteudo} url={url} />
        </div>
      </article>

      {/* CTA */}
      <div style={{ margin: '0 16px', borderRadius: 16, padding: 20, background: 'var(--bg-elev)', border: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
          Você também tem uma história assim?
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-dim)', marginBottom: 16 }}>
          Compartilhe como Deus agiu na sua vida. Pode ser anônimo.
        </p>
        <Link to="/compartilhar" style={{ display: 'inline-block', padding: '10px 22px', borderRadius: 9999, background: 'var(--accent)', color: '#000', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
          Compartilhar
        </Link>
      </div>
    </>
  )
}
