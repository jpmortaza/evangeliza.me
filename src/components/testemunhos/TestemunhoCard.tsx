import { Link } from 'react-router-dom'
import { type Testemunho, CATEGORIAS } from '@/types'
import { formatarDataRelativa, truncar, getDisplayId } from '@/lib/utils'
import BotoesCompartilhar from '@/components/compartilhamento/BotoesCompartilhar'

interface Props {
  testemunho: Testemunho
}

const MONO: React.CSSProperties = { fontFamily: '"Geist Mono", monospace' }

export default function TestemunhoCard({ testemunho }: Props) {
  const { id, titulo, conteudo, categoria, eh_anonimo, nome_anonimo, criado_em, usuarios, midias } = testemunho

  const autor = eh_anonimo ? 'ANÔNIMO' : (usuarios?.nome ?? nome_anonimo ?? 'ANÔNIMO').toUpperCase()
  const midia = midias?.[0]
  const url = `${window.location.origin}/testemunho/${id}`
  const displayId = getDisplayId(criado_em, id)
  const catLabel = categoria ? CATEGORIAS[categoria].toUpperCase() : null
  const tempo = formatarDataRelativa(criado_em).toUpperCase()

  return (
    <article className="border-t py-5 group" style={{ borderColor: '#2a2a2a' }}>
      {/* Meta row */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px]" style={{ ...MONO, color: '#e8b84b' }}>{displayId}</span>
        {catLabel && (
          <>
            <span style={{ color: '#333' }}>·</span>
            <span
              className="text-[10px] px-1.5 py-px border"
              style={{ ...MONO, color: '#888', borderColor: '#2a2a2a' }}
            >
              {catLabel}
            </span>
          </>
        )}
        <span style={{ color: '#333' }}>·</span>
        <span className="text-[10px]" style={{ ...MONO, color: '#444' }}>{tempo}</span>
      </div>

      {/* Thumbnail */}
      {midia?.tipo === 'imagem' && (
        <img
          src={midia.url}
          alt={titulo}
          className="w-full h-40 object-cover mb-3"
          style={{ borderColor: '#2a2a2a' }}
          loading="lazy"
        />
      )}

      {/* Title */}
      <h2 className="text-xl font-bold text-white leading-tight mb-2">
        <Link to={`/testemunho/${id}`} className="hover:text-[#e8b84b] transition-colors">
          {titulo}
        </Link>
      </h2>

      {/* Preview */}
      <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: '#888' }}>
        {truncar(conteudo, 200)}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px]" style={{ ...MONO, color: '#444' }}>{autor}</span>
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <BotoesCompartilhar titulo={titulo} conteudo={conteudo} url={url} />
          <Link
            to={`/testemunho/${id}`}
            className="text-[10px] tracking-widest transition-colors hover:text-white"
            style={{ ...MONO, color: '#555' }}
          >
            LER →
          </Link>
        </div>
      </div>
    </article>
  )
}
