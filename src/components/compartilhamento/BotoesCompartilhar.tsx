import { useState } from 'react'

interface Props {
  titulo: string
  conteudo: string
  url: string
}

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)' }

export default function BotoesCompartilhar({ titulo, conteudo, url }: Props) {
  const [copiado, setCopiado] = useState(false)

  const compartilharWhatsApp = () => {
    const texto = encodeURIComponent(`"${titulo}"\n\n${conteudo.slice(0, 150)}...\n\n${url}`)
    window.open(`https://wa.me/?text=${texto}`, '_blank', 'noopener')
  }

  const copiarLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: titulo, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopiado(true)
        setTimeout(() => setCopiado(false), 2000)
      }
    } catch {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  const btnBase: React.CSSProperties = {
    ...MONO, fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase',
    padding: '5px 9px', background: 'transparent', cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <button
        onClick={compartilharWhatsApp}
        style={{ ...btnBase, border: '1px solid var(--border)', color: 'var(--text-mute)' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-mute)' }}
      >
        WPP
      </button>
      <button
        onClick={copiarLink}
        style={{
          ...btnBase,
          border: `1px solid ${copiado ? 'var(--accent)' : 'var(--border)'}`,
          color: copiado ? 'var(--accent)' : 'var(--text-mute)',
        }}
        onMouseEnter={e => { if (!copiado) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' } }}
        onMouseLeave={e => { if (!copiado) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-mute)' } }}
      >
        {copiado ? 'COPIADO' : 'LINK'}
      </button>
    </div>
  )
}
