import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { type Testemunho, CATEGORIAS } from '@/types'
import { formatarData } from '@/lib/utils'
import YouTubeEmbed from '@/components/testemunhos/YouTubeEmbed'
import BotoesCompartilhar from '@/components/compartilhamento/BotoesCompartilhar'

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
        <div className="h-8 bg-gray-100 rounded w-3/4 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !t) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-6">Testemunho não encontrado.</p>
        <Link to="/" className="text-sm font-medium" style={{ color: '#1E3A5F' }}>
          ← Voltar ao feed
        </Link>
      </div>
    )
  }

  const autor = t.eh_anonimo ? 'Anônimo' : (t.usuarios?.nome ?? t.nome_anonimo ?? 'Anônimo')
  const midia = t.midias?.[0]
  const url = `${window.location.origin}/testemunho/${t.id}`

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

      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Todos os testemunhos
        </Link>

        {t.categoria && (
          <span
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 text-white"
            style={{ backgroundColor: '#1E3A5F' }}
          >
            {CATEGORIAS[t.categoria]}
          </span>
        )}

        <h1
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight"
          style={{ fontFamily: "'Lora', serif" }}
        >
          {t.titulo}
        </h1>

        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
          <span className="text-sm text-gray-500">
            <strong className="text-gray-700">{autor}</strong> · {formatarData(t.criado_em)}
          </span>
          <BotoesCompartilhar titulo={t.titulo} conteudo={t.conteudo} url={url} />
        </div>

        {midia?.tipo === 'youtube' && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <YouTubeEmbed videoId={midia.url} title={t.titulo} />
          </div>
        )}
        {midia?.tipo === 'imagem' && (
          <img
            src={midia.url}
            alt={t.titulo}
            className="w-full rounded-xl mb-8 max-h-96 object-cover"
          />
        )}

        <div className="prose prose-gray max-w-none">
          {t.conteudo.split('\n').map((paragrafo, i) =>
            paragrafo.trim() ? (
              <p key={i} className="text-gray-700 leading-relaxed mb-4 text-lg">
                {paragrafo}
              </p>
            ) : null
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-500 mb-4 text-sm">Este testemunho te tocou?</p>
          <BotoesCompartilhar titulo={t.titulo} conteudo={t.conteudo} url={url} />
        </div>

        <div
          className="mt-10 rounded-2xl p-8 text-white text-center"
          style={{ backgroundColor: '#1E3A5F' }}
        >
          <p className="text-lg font-medium mb-2" style={{ fontFamily: "'Lora', serif" }}>
            Você também tem uma história assim?
          </p>
          <p className="text-white/75 text-sm mb-5">
            Compartilhe como Deus agiu na sua vida. Pode ser anônimo.
          </p>
          <Link
            to="/compartilhar"
            className="inline-block font-semibold px-6 py-3 rounded-xl text-white transition-colors"
            style={{ backgroundColor: '#C9933B' }}
          >
            Compartilhar meu testemunho
          </Link>
        </div>
      </div>
    </>
  )
}
