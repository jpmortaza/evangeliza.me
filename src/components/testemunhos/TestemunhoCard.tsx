import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { type Testemunho, CATEGORIAS } from '@/types'
import { formatarDataRelativa, getSessionKey } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface Props { testemunho: Testemunho }

const REACOES = [
  { tipo: 'amem',   emoji: '🙏', label: 'Amém'   },
  { tipo: 'orando', emoji: '🕊', label: 'Orando'  },
  { tipo: 'tocou',  emoji: '💛', label: 'Tocou'   },
] as const

type TipoReacao = typeof REACOES[number]['tipo']

const STORAGE_KEY = (id: string) => `ev_reacao_${id}`

function lerReacoesLocais(id: string): Set<TipoReacao> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(id))
    return new Set((raw ? JSON.parse(raw) : []) as TipoReacao[])
  } catch { return new Set() }
}

function salvarReacoesLocais(id: string, set: Set<TipoReacao>) {
  localStorage.setItem(STORAGE_KEY(id), JSON.stringify([...set]))
}

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
  const [reacoes, setReacoes] = useState<Set<TipoReacao>>(() => lerReacoesLocais(id))
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    setReacoes(lerReacoesLocais(id))
  }, [id])

  const nomeRaw = eh_anonimo ? 'Anônimo' : (usuarios?.nome ?? nome_anonimo ?? 'Anônimo')
  const tempo = formatarDataRelativa(criado_em)
  const catLabel = categoria ? CATEGORIAS[categoria] : null
  const url = `${window.location.origin}/testemunho/${id}`

  const handleReacao = async (e: React.MouseEvent, tipo: TipoReacao) => {
    e.preventDefault(); e.stopPropagation()
    const sk = getSessionKey()
    const novo = new Set(reacoes)

    if (novo.has(tipo)) {
      novo.delete(tipo)
      await supabase.from('reacoes').delete()
        .eq('testemunho_id', id).eq('tipo', tipo).eq('session_key', sk)
    } else {
      novo.add(tipo)
      await supabase.from('reacoes').upsert(
        { testemunho_id: id, tipo, session_key: sk },
        { onConflict: 'testemunho_id,tipo,session_key' }
      )
    }

    setReacoes(novo)
    salvarReacoesLocais(id, novo)
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
          fontSize: 52, lineHeight: 0.7,
          color: 'var(--accent)', opacity: 0.55, userSelect: 'none',
        }}>"</div>

        {/* Content */}
        <p className="line-clamp-5" style={{
          fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.65,
          color: 'var(--text)', margin: 0, flex: 1,
        }}>
          {conteudo}
        </p>

        {/* Category pill */}
        {catLabel && (
          <div>
            <span style={{
              display: 'inline-block', padding: '3px 10px', borderRadius: 9999,
              fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
              color: 'var(--accent)', background: 'var(--accent-glow)',
              border: '1px solid var(--accent-dim)',
              textTransform: 'uppercase', letterSpacing: 0.4,
            }}>{catLabel}</span>
          </div>
        )}

        {/* Author row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Avatar nome={nomeRaw} size={26} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {nomeRaw}
          </span>
          <span style={{ color: 'var(--text-mute)', fontSize: 12 }}>·</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-mute)', whiteSpace: 'nowrap' }}>
            {tempo}
          </span>
        </div>

        {/* Reactions + share */}
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: -4 }}
          onClick={e => e.preventDefault()}
        >
          <div style={{ display: 'flex', gap: 2 }}>
            {REACOES.map(({ tipo, emoji, label }) => {
              const ativo = reacoes.has(tipo)
              return (
                <button
                  key={tipo}
                  onClick={e => handleReacao(e, tipo)}
                  title={label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '5px 9px', borderRadius: 9999, border: 'none',
                    background: ativo ? 'var(--accent-glow)' : 'transparent',
                    color: ativo ? 'var(--accent)' : 'var(--text-mute)',
                    fontFamily: 'var(--font-sans)', fontSize: 13,
                    cursor: 'pointer', transition: 'background 0.12s, color 0.12s',
                  }}
                  onMouseEnter={e => { if (!ativo) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)' }}
                  onMouseLeave={e => { if (!ativo) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <span style={{ fontSize: 14 }}>{emoji}</span>
                  <span style={{ fontSize: 12 }}>{label}</span>
                </button>
              )
            })}
          </div>

          <button
            className="action-btn"
            onClick={handleShare}
            style={{ color: copiado ? 'var(--accent)' : undefined }}
            title="Compartilhar"
          >
            {copiado
              ? <span style={{ fontSize: 11, fontFamily: 'var(--font-sans)' }}>Copiado!</span>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
            }
          </button>
        </div>
      </article>
    </Link>
  )
}
