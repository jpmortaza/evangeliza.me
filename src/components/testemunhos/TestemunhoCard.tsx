import { Link } from 'react-router-dom'
import { type Testemunho, CATEGORIAS } from '@/types'
import { formatarDataRelativa, truncar } from '@/lib/utils'
import BotoesCompartilhar from '@/components/compartilhamento/BotoesCompartilhar'
import YouTubeEmbed from './YouTubeEmbed'

interface Props {
  testemunho: Testemunho
}

export default function TestemunhoCard({ testemunho }: Props) {
  const { id, titulo, conteudo, categoria, eh_anonimo, nome_anonimo, criado_em, usuarios, midias } = testemunho

  const autor = eh_anonimo ? 'Anônimo' : (usuarios?.nome ?? nome_anonimo ?? 'Anônimo')
  const midia = midias?.[0]
  const url = `${window.location.origin}/testemunho/${id}`

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {midia?.tipo === 'youtube' && (
        <div className="w-full">
          <YouTubeEmbed videoId={midia.url} title={titulo} />
        </div>
      )}
      {midia?.tipo === 'imagem' && (
        <img
          src={midia.url}
          alt={titulo}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      )}

      <div className="p-5">
        {categoria && (
          <span
            className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 text-white"
            style={{ backgroundColor: '#1E3A5F' }}
          >
            {CATEGORIAS[categoria]}
          </span>
        )}

        <h2 className="text-xl font-semibold leading-snug mb-2 text-gray-900" style={{ fontFamily: "'Lora', serif" }}>
          <Link to={`/testemunho/${id}`} className="hover:underline decoration-[#C9933B]">
            {titulo}
          </Link>
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
          {truncar(conteudo, 220)}
        </p>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs text-gray-400">
            <strong className="text-gray-500">{autor}</strong> · {formatarDataRelativa(criado_em)}
          </span>

          <div className="flex items-center gap-3">
            <BotoesCompartilhar titulo={titulo} conteudo={conteudo} url={url} />
            <Link
              to={`/testemunho/${id}`}
              className="text-xs font-semibold transition-colors"
              style={{ color: '#C9933B' }}
            >
              Ler →
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
