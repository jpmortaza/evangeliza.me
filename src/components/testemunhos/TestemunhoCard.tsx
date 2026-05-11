import { useState } from 'react'
import { Link } from 'react-router-dom'
import { type Testemunho, CATEGORIAS } from '@/types'
import { formatarDataRelativa } from '@/lib/utils'

interface Props { testemunho: Testemunho }

function Avatar({ nome, size = 28 }: { nome: string; size?: number }) {
  const letra = nome === 'Anônimo' ? '?' : nome[0].toUpperCase()
  const isAnon = nome === 'Anônimo'
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: isAnon ? 'var(--accent-glow)' : 'linear-gradient(135deg, #c4b5fd, #818cf8)',
      border: '1.5px solid var(--accent-dim)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.42, fontWeight: 700,
      color: isAnon ? 'var(--accent)' : '#fff',
      userSelect: 'none',
    }}>
      {letra}
    </div>
  )
}

export default function TestemunhoCard({ testemunho }: Props) {
  const { id, titulo, conteudo, categoria, eh_anonimo, nome_anonimo, criado_em, usuarios } = testemunho
  const [amens, setAmens] = useState(0)
  const [amentou, setAmentou] = useState(false)
  const [copiado, setCopiado] = useState(false)

  const nomeRaw = eh_anonimo ? 'Anônimo' : (usuarios?.nome ?? nome_anonimo ?? 'Anônimo')
  const tempo = formatarDataRelativa(criado_em)
  const catLabel = categoria ? CATEGORIAS[categoria] : null
  const url = `${window.location.origin}/testemunho/${id}`

  const handleAmem = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (amentou) return
    setAmens(a => a + 1)
    setAmentou(true)
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    try {
      if (navigator.share) await navigator.share({ title: titulo, url })
      else {
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
    <Link to={`/testemunho/${id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        className="post-card"
        style={{
          background: 'var(--bg-elev)',
          borderRadius: 16,
          border: '1px solid var(--border)',
          padding: 20,
          boxShadow: 'var(--shadow-sm)',
          display: 'flex', flexDirection: 'column', gap: 12,
          height: '100%',
        }}
      >
        {/* Opening quote mark */}
        <div style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 52,
          lineHeight: 0.7,
          color: 'var(--accent)',
          opacity: 0.55,
          userSelect: 'none',
        }}>"</div>

        {/* Content */}
        <p className="line-clamp-5" style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 14,
          lineHeight: 1.65,
          color: 'var(--text)',
          margin: 0,
          flex: 1,
        }}>
          {conteudo}
        </p>

        {/* Category pill */}
        {catLabel && (
          <div>
            <span style={{
              display: 'inline-block',
              padding: '3px 10px', borderRadius: 9999,
              fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
              color: 'var(--accent)',
              background: 'var(--accent-glow)',
              border: '1px solid var(--accent-dim)',
              textTransform: 'uppercase', letterSpacing: 0.4,
            }}>{catLabel}</span>
          </div>
        )}

        {/* Author + actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
            <Avatar nome={nomeRaw} size={26} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {nomeRaw}
            </span>
            <span style={{ color: 'var(--text-mute)', fontSize: 12 }}>·</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-mute)', whiteSpace: 'nowrap' }}>
              {tempo}
            </span>
          </div>

          {/* Actions */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}
            onClick={e => e.preventDefault()}
          >
            <button
              className={`action-btn${amentou ? ' active' : ''}`}
              onClick={handleAmem}
              style={{ color: amentou ? '#f43f5e' : undefined }}
              onMouseEnter={e => { if (!amentou) { (e.currentTarget as HTMLElement).style.color = '#f43f5e'; (e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.08)' } }}
              onMouseLeave={e => { if (!amentou) { (e.currentTarget as HTMLElement).style.color = 'var(--text-mute)'; (e.currentTarget as HTMLElement).style.background = 'transparent' } }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill={amentou ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {amens > 0 && <span style={{ fontSize: 12 }}>{amens}</span>}
            </button>

            <button className="action-btn" onClick={handleShare}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              {copiado && <span style={{ fontSize: 11 }}>Copiado!</span>}
            </button>
          </div>
        </div>
      </article>
    </Link>
  )
}
