import { useState } from 'react'

interface Props {
  titulo: string
  conteudo: string
  url: string
}

const MONO: React.CSSProperties = { fontFamily: '"Geist Mono", monospace' }

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

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={compartilharWhatsApp}
        className="text-[10px] tracking-widest border px-2 py-1 transition-colors hover:border-[#e8b84b] hover:text-[#e8b84b]"
        style={{ ...MONO, color: '#555', borderColor: '#2a2a2a' }}
      >
        WPP
      </button>
      <button
        onClick={copiarLink}
        className="text-[10px] tracking-widest border px-2 py-1 transition-colors hover:border-[#e8b84b] hover:text-[#e8b84b]"
        style={{ ...MONO, color: copiado ? '#e8b84b' : '#555', borderColor: copiado ? '#e8b84b' : '#2a2a2a' }}
      >
        {copiado ? 'COPIADO' : 'LINK'}
      </button>
    </div>
  )
}
