import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { type UsuarioPerfil, type Testemunho, type Comentario, CATEGORIAS } from '@/types'
import { formatarDataRelativa } from '@/lib/utils'
import AuthModal from '@/components/auth/AuthModal'

/* ── Avatar ─────────────────────────────────────── */
function Avatar({ perfil, size = 88 }: { perfil: UsuarioPerfil; size?: number }) {
  const letra = perfil.nome?.[0]?.toUpperCase() ?? '?'
  return perfil.avatar_url ? (
    <img
      src={perfil.avatar_url} alt={perfil.nome}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--bg-elev)', flexShrink: 0 }}
    />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, #c4b5fd, #818cf8)',
      border: '3px solid var(--bg-elev)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, color: '#fff',
    }}>{letra}</div>
  )
}

/* ── Social links ────────────────────────────────── */
function buildLinks(p: UsuarioPerfil) {
  const out: { href: string; icon: string; label: string }[] = []
  if (p.instagram) out.push({ icon: '📸', label: `@${p.instagram.replace(/^@/, '')}`, href: p.instagram.startsWith('http') ? p.instagram : `https://instagram.com/${p.instagram.replace(/^@/, '')}` })
  if (p.twitter) out.push({ icon: '𝕏', label: `@${p.twitter.replace(/^@/, '')}`, href: p.twitter.startsWith('http') ? p.twitter : `https://x.com/${p.twitter.replace(/^@/, '')}` })
  if (p.youtube) out.push({ icon: '▶️', label: p.youtube.replace(/^@/, ''), href: p.youtube.startsWith('http') ? p.youtube : `https://youtube.com/@${p.youtube.replace(/^@/, '')}` })
  if (p.website) out.push({ icon: '🌐', label: p.website.replace(/^https?:\/\//, '').replace(/\/$/, ''), href: p.website.startsWith('http') ? p.website : `https://${p.website}` })
  return out
}

/* ── Testimony card ──────────────────────────────── */
function TestemunhoItem({ t }: { t: Testemunho }) {
  const [aberto, setAberto] = useState(false)
  const catLabel = t.categoria ? CATEGORIAS[t.categoria] : null
  const foto = t.midias?.find(m => m.tipo === 'imagem')
  const youtube = t.midias?.find(m => m.tipo === 'youtube')

  return (
    <div style={{
      background: 'var(--bg-elev)', borderRadius: 16, border: '1px solid var(--border)',
      overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Foto de capa */}
      {foto && (
        <img
          src={foto.url} alt=""
          style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
        />
      )}

      {/* YouTube embed */}
      {!foto && youtube && (
        <div style={{ position: 'relative', paddingBottom: '52%', background: '#000' }}>
          <iframe
            src={`https://www.youtube.com/embed/${youtube.url}`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="vídeo"
          />
        </div>
      )}

      <div style={{ padding: '20px 20px 16px' }}>
        {/* Título */}
        <Link to={`/testemunho/${t.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700,
            color: 'var(--text)', margin: '0 0 8px', lineHeight: 1.3,
          }}>{t.titulo}</h3>
        </Link>

        {/* Conteúdo */}
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-dim)',
          lineHeight: 1.65, margin: '0 0 12px',
          display: aberto ? 'block' : '-webkit-box',
          WebkitLineClamp: aberto ? undefined : 4,
          WebkitBoxOrient: 'vertical',
          overflow: aberto ? 'visible' : 'hidden',
        }}>{t.conteudo}</p>

        {t.conteudo.length > 300 && (
          <button
            onClick={() => setAberto(o => !o)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--accent)', fontFamily: 'var(--font-sans)', fontSize: 13,
              fontWeight: 600, padding: '0 0 8px',
            }}
          >{aberto ? 'Ver menos ↑' : 'Ver mais ↓'}</button>
        )}

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {catLabel && (
              <span style={{
                fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-sans)',
                color: 'var(--accent)', background: 'var(--accent-glow)',
                border: '1px solid var(--accent-dim)', borderRadius: 9999,
                padding: '2px 9px', textTransform: 'uppercase', letterSpacing: 0.4,
              }}>{catLabel}</span>
            )}
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-mute)' }}>
              {formatarDataRelativa(t.criado_em)}
            </span>
          </div>
          <Link
            to={`/testemunho/${t.id}`}
            style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
          >Ver comentários →</Link>
        </div>
      </div>

      {/* Inline comments preview */}
      <ComentariosPreview testemunhoId={t.id} />
    </div>
  )
}

/* ── Comments preview ────────────────────────────── */
function ComentariosPreview({ testemunhoId }: { testemunhoId: string }) {
  const { user } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'entrar' | 'cadastrar'>('entrar')
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)

  const { data: comentarios, refetch } = useQuery({
    queryKey: ['comentarios-preview', testemunhoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comentarios')
        .select('*, usuarios(nome, avatar_url)')
        .eq('testemunho_id', testemunhoId)
        .order('criado_em', { ascending: false })
        .limit(3)
      if (error) throw error
      return data as Comentario[]
    },
  })

  const enviarComentario = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !texto.trim()) return
    setEnviando(true)
    await supabase.from('comentarios').insert({
      testemunho_id: testemunhoId,
      usuario_id: user.id,
      conteudo: texto.trim(),
    })
    setTexto('')
    setEnviando(false)
    refetch()
  }

  if (!comentarios?.length && !user) return null

  return (
    <div style={{ borderTop: '1px solid var(--border)', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Comments list */}
      {comentarios?.map(c => (
        <div key={c.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <AvatarMini nome={c.usuarios?.nome ?? 'Anônimo'} url={c.usuarios?.avatar_url ?? null} />
          <div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
              {c.usuarios?.nome ?? 'Anônimo'}
            </span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-dim)', marginLeft: 6 }}>
              {c.conteudo}
            </span>
          </div>
        </div>
      ))}

      {/* Comment form or CTA */}
      {user ? (
        <form onSubmit={enviarComentario} style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <AvatarMini nome={user.user_metadata?.nome ?? 'eu'} url={null} />
          <input
            value={texto}
            onChange={e => setTexto(e.target.value.slice(0, 500))}
            placeholder="Escreva um comentário…"
            style={{
              flex: 1, background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 9999, padding: '7px 14px',
              fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)',
            }}
          />
          <button
            type="submit" disabled={enviando || !texto.trim()}
            style={{
              padding: '7px 16px', borderRadius: 9999, border: 'none',
              background: 'var(--accent)', color: '#fff',
              fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
              cursor: texto.trim() ? 'pointer' : 'default',
              opacity: (enviando || !texto.trim()) ? 0.5 : 1,
            }}
          >↑</button>
        </form>
      ) : (
        <button
          onClick={() => { setAuthMode('entrar'); setShowAuth(true) }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--accent)',
            textAlign: 'left', padding: 0, fontWeight: 600,
          }}
        >💬 Faça login para comentar</button>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultMode={authMode} />}
    </div>
  )
}

function AvatarMini({ nome, url }: { nome: string; url: string | null }) {
  const letra = nome[0]?.toUpperCase() ?? '?'
  return url ? (
    <img src={url} alt={nome} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  ) : (
    <div style={{
      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, #c4b5fd, #818cf8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 700, color: '#fff',
    }}>{letra}</div>
  )
}

/* ── Main page ───────────────────────────────────── */
export default function PerfilPublico() {
  const { slug } = useParams<{ slug: string }>()

  const { data: perfil, isLoading, error } = useQuery({
    queryKey: ['perfil-publico', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuarios').select('*').eq('slug', slug!).single()
      if (error) throw error
      return data as UsuarioPerfil
    },
    enabled: !!slug,
  })

  const { data: testemunhos } = useQuery({
    queryKey: ['testemunhos-perfil', perfil?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testemunhos')
        .select('*, usuarios!testemunhos_usuario_id_fkey(nome, slug, avatar_url), midias(*)')
        .eq('usuario_id', perfil!.id)
        .eq('status', 'aprovado')
        .order('criado_em', { ascending: false })
      if (error) throw error
      return data as Testemunho[]
    },
    enabled: !!perfil?.id,
  })

  if (isLoading) return (
    <div style={{ padding: '60px 16px', textAlign: 'center', color: 'var(--text-mute)', fontFamily: 'var(--font-sans)' }}>
      Carregando…
    </div>
  )

  if (error || !perfil) return (
    <div style={{ padding: '60px 16px', textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Perfil não encontrado.</p>
      <Link to="/" style={{ color: 'var(--accent)', fontFamily: 'var(--font-sans)', fontSize: 14 }}>← Voltar ao feed</Link>
    </div>
  )

  const socialLinks = buildLinks(perfil)

  return (
    <>
      <Helmet><title>{perfil.nome} — evangeliza.me</title></Helmet>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, oklch(0.65 0.22 215 / 0.12), oklch(0.55 0.26 290 / 0.08), transparent)',
        borderBottom: '1px solid var(--border)',
        padding: '32px 24px 28px',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <Avatar perfil={perfil} size={88} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: '0 0 2px' }}>
                {perfil.nome}
              </h1>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-mute)', margin: '0 0 10px' }}>
                @{perfil.slug}
              </p>

              {perfil.bio && (
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-dim)', margin: '0 0 12px', lineHeight: 1.6 }}>
                  {perfil.bio}
                </p>
              )}

              {socialLinks.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {socialLinks.map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '5px 12px', borderRadius: 9999,
                        border: '1px solid var(--border)', background: 'var(--bg-elev)',
                        color: 'var(--text-dim)', textDecoration: 'none',
                        fontSize: 13, fontFamily: 'var(--font-sans)',
                        transition: 'border-color 0.15s, color 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)' }}
                    >
                      <span style={{ fontSize: 14 }}>{s.icon}</span>
                      <span>{s.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 24, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
                {testemunhos?.length ?? 0}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-mute)', marginLeft: 6 }}>testemunhos</span>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-mute)' }}>
                Membro desde {new Date(perfil.criado_em).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonies */}
      <div style={{ padding: '24px 16px', maxWidth: 760, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {!testemunhos?.length ? (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-mute)' }}>
              Nenhum testemunho publicado ainda.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {testemunhos.map(t => <TestemunhoItem key={t.id} t={t} />)}
          </div>
        )}
      </div>
    </>
  )
}
