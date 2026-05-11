import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '@/lib/supabase'
import { type Testemunho, CATEGORIAS } from '@/types'
import { formatarDataRelativa, getDisplayId } from '@/lib/utils'
import YouTubeEmbed from '@/components/testemunhos/YouTubeEmbed'
import BotoesCompartilhar from '@/components/compartilhamento/BotoesCompartilhar'

const MONO: React.CSSProperties = { fontFamily: '"Geist Mono", monospace' }

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
      <div className="max-w-2xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-2 rounded mb-6 w-32" style={{ backgroundColor: '#1e1e1e' }} />
        <div className="h-8 rounded mb-4 w-3/4" style={{ backgroundColor: '#1e1e1e' }} />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-3 rounded" style={{ backgroundColor: '#1e1e1e' }} />
          ))}
        </div>
      </div>
    )
  }

  if (error || !t) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="text-4xl" style={{ color: '#333' }}>+</span>
        <p className="mt-4 text-[11px] tracking-widest mb-6" style={{ ...MONO, color: '#555' }}>
          REGISTRO NÃO ENCONTRADO
        </p>
        <Link
          to="/"
          className="text-[10px] tracking-widest transition-colors hover:text-white"
          style={{ ...MONO, color: '#444' }}
        >
          ← VOLTAR AO FEED
        </Link>
      </div>
    )
  }

  const autor = t.eh_anonimo ? 'ANÔNIMO' : (t.usuarios?.nome ?? t.nome_anonimo ?? 'ANÔNIMO').toUpperCase()
  const midia = t.midias?.[0]
  const url = `${window.location.origin}/testemunho/${t.id}`
  const displayId = getDisplayId(t.criado_em, t.id)
  const catLabel = t.categoria ? CATEGORIAS[t.categoria].toUpperCase() : null
  const tempo = formatarDataRelativa(t.criado_em).toUpperCase()

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

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Back */}
        <Link
          to="/"
          className="inline-block text-[10px] tracking-widest mb-8 transition-colors hover:text-white"
          style={{ ...MONO, color: '#444' }}
        >
          ← FEED
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-[11px]" style={{ ...MONO, color: '#e8b84b' }}>{displayId}</span>
          {catLabel && (
            <>
              <span style={{ color: '#333' }}>·</span>
              <span className="text-[10px] px-1.5 py-px border" style={{ ...MONO, color: '#888', borderColor: '#2a2a2a' }}>
                {catLabel}
              </span>
            </>
          )}
          <span style={{ color: '#333' }}>·</span>
          <span className="text-[10px]" style={{ ...MONO, color: '#444' }}>{tempo}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">{t.titulo}</h1>

        {/* Author + share */}
        <div className="flex items-center justify-between gap-3 mb-8 pb-6 border-b" style={{ borderColor: '#2a2a2a' }}>
          <span className="text-[10px]" style={{ ...MONO, color: '#444' }}>{autor}</span>
          <BotoesCompartilhar titulo={t.titulo} conteudo={t.conteudo} url={url} />
        </div>

        {/* Media */}
        {midia?.tipo === 'youtube' && (
          <div className="mb-8">
            <YouTubeEmbed videoId={midia.url} title={t.titulo} />
          </div>
        )}
        {midia?.tipo === 'imagem' && (
          <img
            src={midia.url}
            alt={t.titulo}
            className="w-full mb-8 max-h-96 object-cover"
          />
        )}

        {/* Content */}
        <div className="space-y-4">
          {t.conteudo.split('\n').map((paragrafo, i) =>
            paragrafo.trim() ? (
              <p key={i} className="text-base leading-relaxed" style={{ color: '#aaa' }}>
                {paragrafo}
              </p>
            ) : null
          )}
        </div>

        {/* Bottom share */}
        <div className="mt-12 pt-8 border-t text-center space-y-3" style={{ borderColor: '#2a2a2a' }}>
          <p className="text-[10px] tracking-widest" style={{ ...MONO, color: '#444' }}>
            ESTE TESTEMUNHO TE TOCOU?
          </p>
          <BotoesCompartilhar titulo={t.titulo} conteudo={t.conteudo} url={url} />
        </div>

        {/* CTA */}
        <div className="mt-10 border p-8 text-center" style={{ borderColor: '#2a2a2a' }}>
          <p className="text-[10px] tracking-widest mb-3" style={{ ...MONO, color: '#555' }}>
            VOCÊ TAMBÉM TEM UMA HISTÓRIA ASSIM?
          </p>
          <p className="text-sm mb-6" style={{ color: '#888' }}>
            Compartilhe como Deus agiu na sua vida. Pode ser anônimo.
          </p>
          <Link
            to="/compartilhar"
            className="inline-block text-sm font-bold px-6 py-3 tracking-widest transition-opacity hover:opacity-80"
            style={{ ...MONO, backgroundColor: '#e8b84b', color: '#0a0a0a' }}
          >
            + COMPARTILHAR
          </Link>
        </div>
      </div>
    </>
  )
}
