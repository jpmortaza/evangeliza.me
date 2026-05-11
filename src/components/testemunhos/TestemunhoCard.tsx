import { useState } from 'react'
import { Link } from 'react-router-dom'
import { type Testemunho, CATEGORIAS } from '@/types'
import { formatarDataRelativa, getDisplayId } from '@/lib/utils'

interface Props { testemunho: Testemunho }

function Avatar({ nome, size = 40 }: { nome: string; size?: number }) {
  const letra = nome === 'ANÔNIMO' || nome === 'Anônimo' ? '+' : nome[0].toUpperCase()
  const isAnon = letra === '+'
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: isAnon ? 'var(--accent-dim)' : 'var(--bg-elev)',
      border: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: isAnon ? 'inherit' : 'var(--font-sans)',
      fontSize: isAnon ? size * 0.5 : size * 0.44,
      fontWeight: 700,
      color: isAnon ? 'var(--accent)' : 'var(--text)',
      userSelect: 'none',
    }}>
      {letra}
    </div>
  )
}

function AmenIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <polyline points="16 6 12 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function TestemunhoCard({ testemunho }: Props) {
  const { id, titulo, conteudo, categoria, eh_anonimo, nome_anonimo, criado_em, usuarios } = testemunho
  const [amens, setAmens] = useState(0)
  const [amentou, setAmentou] = useState(false)
  const [copiado, setCopiado] = useState(false)

  const nomeRaw = eh_anonimo ? 'Anônimo' : (usuarios?.nome ?? nome_anonimo ?? 'Anônimo')
  const displayId = getDisplayId(criado_em, id)
  const tempo = formatarDataRelativa(criado_em)
  const catLabel = categoria ? CATEGORIAS[categoria] : null
  const url = `${window.location.origin}/testemunho/${id}`

  const handleAmem = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (amentou) return
    setAmens(a => a + 1)
    setAmentou(true)
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
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
        style={{ borderBottom: '1px solid var(--border)', padding: '12px 16px', display: 'flex', gap: 12 }}
      >
        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          <Avatar nome={nomeRaw} size={40} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
              {nomeRaw}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-dim)' }}>
              {displayId}
            </span>
            <span style={{ color: 'var(--text-mute)', fontSize: 13 }}>·</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-dim)' }}>
              {tempo}
            </span>
            {catLabel && (
              <span style={{
                fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
                color: 'var(--accent)', background: 'var(--accent-glow)',
                border: '1px solid var(--accent-dim)',
                padding: '2px 8px', borderRadius: 9999, textTransform: 'uppercase', letterSpacing: 0.3,
              }}>{catLabel}</span>
            )}
          </div>

          {/* Title */}
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: '0 0 4px', lineHeight: 1.3 }}>
            {titulo}
          </p>

          {/* Body */}
          <p className="line-clamp-4" style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-dim)', lineHeight: 1.5, margin: 0 }}>
            {conteudo}
          </p>

          {/* Action bar */}
          <div
            style={{ display: 'flex', alignItems: 'center', marginTop: 10, gap: 0, justifyContent: 'space-between', maxWidth: 360 }}
            onClick={e => e.preventDefault()}
          >
            {/* Amém */}
            <button
              className={`action-btn${amentou ? ' active' : ''}`}
              onClick={handleAmem}
              style={{ color: amentou ? '#f91880' : undefined }}
              onMouseEnter={e => { if (!amentou) { (e.currentTarget as HTMLElement).style.color = '#f43f5e'; (e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.1)' } }}
              onMouseLeave={e => { if (!amentou) { (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)'; (e.currentTarget as HTMLElement).style.background = 'transparent' } }}
            >
              <AmenIcon filled={amentou} />
              {amens > 0 && <span style={{ fontSize: 13 }}>{amens}</span>}
              <span style={{ fontSize: 13, color: 'inherit' }}>Amém</span>
            </button>

            {/* Compartilhar */}
            <button className="action-btn" onClick={handleShare}>
              <ShareIcon />
              <span style={{ fontSize: 13 }}>{copiado ? 'Copiado!' : 'Compartilhar'}</span>
            </button>

            {/* Ler mais */}
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--accent)', padding: '6px 8px' }}>
              Ler →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
