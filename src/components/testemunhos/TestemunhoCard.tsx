import { useState } from 'react'
import { Link } from 'react-router-dom'
import { type Testemunho, CATEGORIAS } from '@/types'
import { formatarDataRelativa, truncar, getDisplayId } from '@/lib/utils'
interface Props {
  testemunho: Testemunho
}

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)' }

export default function TestemunhoCard({ testemunho }: Props) {
  const { id, titulo, conteudo, categoria, eh_anonimo, nome_anonimo, criado_em, usuarios, midias } = testemunho
  const [amens, setAmens] = useState(0)
  const [amentou, setAmentou] = useState(false)

  const autor = eh_anonimo ? 'Anônimo' : (usuarios?.nome ?? nome_anonimo ?? 'Anônimo')
  const midia = midias?.[0]
  const url = `${window.location.origin}/testemunho/${id}`
  const displayId = getDisplayId(criado_em, id)
  const catLabel = categoria ? CATEGORIAS[categoria].toUpperCase() : null
  const tempo = formatarDataRelativa(criado_em).toUpperCase()

  const handleAmem = () => {
    if (amentou) return
    setAmens(a => a + 1)
    setAmentou(true)
  }

  return (
    <article className="ev-card" style={{ padding: '24px 0', borderBottom: '1px solid var(--border-soft)' }}>
      {/* Meta */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 12 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' as const }}>
          <span style={{ ...MONO, fontSize: 11, letterSpacing: 0.4, color: 'var(--accent)' }}>{displayId}</span>
          {catLabel && (
            <>
              <span style={{ color: 'var(--text-mute)' }}>·</span>
              <span style={{
                ...MONO, fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase' as const,
                color: 'var(--text-dim)', padding: '2px 6px',
                border: '1px solid var(--border)', borderRadius: 2,
              }}>{catLabel}</span>
            </>
          )}
        </div>
        <span style={{ ...MONO, fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase' as const, color: 'var(--text-mute)' }}>{tempo}</span>
      </header>

      {/* Thumbnail */}
      {midia?.tipo === 'imagem' && (
        <img src={midia.url} alt={titulo} className="w-full h-40 object-cover mb-3" loading="lazy" />
      )}

      {/* Title */}
      <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 500, lineHeight: 1.15, letterSpacing: -0.5, margin: '0 0 10px', color: 'var(--text)' }}>
        <Link to={`/testemunho/${id}`} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text)')}
        >
          {titulo}
        </Link>
      </h2>

      {/* Preview */}
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.55, color: 'var(--text-dim)', margin: '0 0 16px', maxWidth: 680 }}>
        {truncar(conteudo, 200)}
      </p>

      {/* Footer */}
      <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <span style={{ ...MONO, fontSize: 11, letterSpacing: 0.4, color: 'var(--text-mute)', textTransform: 'uppercase' as const }}>
          {autor.toUpperCase()}
        </span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            className="ev-amen"
            onClick={handleAmem}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'transparent',
              border: amentou ? '1px solid var(--accent)' : '1px solid var(--border-soft)',
              color: amentou ? 'var(--accent)' : 'var(--text-mute)',
              padding: '6px 10px', borderRadius: 0,
              ...MONO, fontSize: 10.5, letterSpacing: 0.5,
              textTransform: 'uppercase' as const, cursor: amentou ? 'default' : 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
            }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8">
              <rect x="3.3" y="0" width="1.4" height="8" fill="currentColor" />
              <rect x="0" y="3.3" width="8" height="1.4" fill="currentColor" />
            </svg>
            Amém{amens > 0 && ` · ${amens}`}
          </button>
          <button
            className="ev-share"
            onClick={() => {
              if (navigator.share) navigator.share({ title: titulo, url }).catch(() => {})
              else navigator.clipboard.writeText(url)
            }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'transparent',
              border: '1px solid var(--accent-dim)',
              color: 'var(--accent)',
              padding: '6px 10px', borderRadius: 0,
              ...MONO, fontSize: 10.5, letterSpacing: 0.5,
              textTransform: 'uppercase' as const, cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5 L8 5 M5 2 L8 5 L5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
            </svg>
            Compartilhar
          </button>
          <Link
            to={`/testemunho/${id}`}
            style={{ ...MONO, fontSize: 10, letterSpacing: 0.5, color: 'var(--text-mute)', textDecoration: 'none', padding: '6px 4px', transition: 'color 0.15s', textTransform: 'uppercase' as const }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-mute)')}
          >
            Ler →
          </Link>
        </div>
      </footer>
    </article>
  )
}
