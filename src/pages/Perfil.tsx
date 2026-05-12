import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { type UsuarioPerfil, type Testemunho, CATEGORIAS } from '@/types'
import { formatarDataRelativa } from '@/lib/utils'
import AuthModal from '@/components/auth/AuthModal'

/* ── helpers ─────────────────────────────────────── */

function AvatarCircle({ perfil, size = 88, editavel = false, onUpload }: {
  perfil: UsuarioPerfil | null
  size?: number
  editavel?: boolean
  onUpload?: (file: File) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const letra = perfil?.nome?.[0]?.toUpperCase() ?? '?'

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {perfil?.avatar_url ? (
        <img
          src={perfil.avatar_url}
          alt={perfil.nome}
          style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--bg-elev)' }}
        />
      ) : (
        <div style={{
          width: size, height: size, borderRadius: '50%',
          background: 'linear-gradient(135deg, #c4b5fd, #818cf8)',
          border: '3px solid var(--bg-elev)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size * 0.38, fontWeight: 700, color: '#fff',
        }}>{letra}</div>
      )}
      {editavel && (
        <>
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--accent)', border: '2px solid var(--bg-elev)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff',
            }}
            title="Alterar foto"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
          <input
            ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f && onUpload) onUpload(f) }}
          />
        </>
      )}
    </div>
  )
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      title={label}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '6px 12px', borderRadius: 9999,
        border: '1px solid var(--border)', color: 'var(--text-dim)',
        textDecoration: 'none', fontSize: 13, fontFamily: 'var(--font-sans)',
        background: 'var(--bg-elev)',
        transition: 'border-color 0.15s, color 0.15s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)' }}
    >
      {icon}
      <span>{label}</span>
    </a>
  )
}

/* ── edit modal ──────────────────────────────────── */

interface EditForm {
  nome: string; bio: string
  instagram: string; twitter: string; youtube: string; website: string
}

function EditarPerfilModal({ perfil, onClose, onSave }: {
  perfil: UsuarioPerfil
  onClose: () => void
  onSave: (data: Partial<UsuarioPerfil>) => Promise<void>
}) {
  const [form, setForm] = useState<EditForm>({
    nome: perfil.nome,
    bio: perfil.bio ?? '',
    instagram: perfil.instagram ?? '',
    twitter: perfil.twitter ?? '',
    youtube: perfil.youtube ?? '',
    website: perfil.website ?? '',
  })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  const set = (k: keyof EditForm, v: string) => setForm(p => ({ ...p, [k]: v }))

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome.trim()) { setErro('Nome é obrigatório.'); return }
    setSalvando(true)
    try {
      await onSave({
        nome: form.nome.trim(),
        bio: form.bio.trim() || null,
        instagram: form.instagram.replace(/^@/, '').trim() || null,
        twitter: form.twitter.replace(/^@/, '').trim() || null,
        youtube: form.youtube.trim() || null,
        website: form.website.trim() || null,
      })
      onClose()
    } catch {
      setErro('Erro ao salvar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 8, color: 'var(--text)', padding: '10px 12px',
    fontSize: 14, fontFamily: 'var(--font-sans)', boxSizing: 'border-box',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto',
        background: 'var(--bg-elev)', borderRadius: 18,
        border: '1px solid var(--border)', padding: '28px 24px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            Editar perfil
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mute)', fontSize: 20, lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={salvar} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text-mute)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 }}>Nome</label>
            <input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Seu nome" maxLength={80} style={inp} required />
          </div>

          <div>
            <label style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text-mute)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 }}>Bio</label>
            <textarea
              value={form.bio} onChange={e => set('bio', e.target.value.slice(0, 300))}
              placeholder="Conte um pouco sobre você…" rows={3}
              style={{ ...inp, resize: 'vertical' }}
            />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mute)', margin: '4px 0 0', textAlign: 'right' }}>
              {form.bio.length}/300
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text-mute)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.4 }}>Redes sociais</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 32, textAlign: 'center', fontSize: 16 }}>📸</span>
                <input value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="Instagram (@handle ou URL)" style={{ ...inp }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 32, textAlign: 'center', fontSize: 16 }}>𝕏</span>
                <input value={form.twitter} onChange={e => set('twitter', e.target.value)} placeholder="Twitter / X (@handle)" style={{ ...inp }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 32, textAlign: 'center', fontSize: 16 }}>▶️</span>
                <input value={form.youtube} onChange={e => set('youtube', e.target.value)} placeholder="YouTube (canal ou URL)" style={{ ...inp }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 32, textAlign: 'center', fontSize: 16 }}>🌐</span>
                <input value={form.website} onChange={e => set('website', e.target.value)} placeholder="Site pessoal (https://…)" style={{ ...inp }} />
              </div>
            </div>
          </div>

          {erro && <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#ef4444' }}>{erro}</p>}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
            <button type="button" onClick={onClose} style={{
              padding: '10px 20px', borderRadius: 9999,
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-dim)', fontFamily: 'var(--font-sans)', fontSize: 14, cursor: 'pointer',
            }}>Cancelar</button>
            <button type="submit" disabled={salvando} style={{
              padding: '10px 24px', borderRadius: 9999, border: 'none',
              background: 'var(--accent)', color: '#fff',
              fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700,
              cursor: salvando ? 'default' : 'pointer', opacity: salvando ? 0.6 : 1,
            }}>{salvando ? 'Salvando…' : 'Salvar'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── testimony mini-card ─────────────────────────── */

function MiniCard({ t }: { t: Testemunho }) {
  const catLabel = t.categoria ? CATEGORIAS[t.categoria] : null
  return (
    <Link to={`/testemunho/${t.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          background: 'var(--bg-elev)', borderRadius: 14, border: '1px solid var(--border)',
          padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8,
          transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer',
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = 'var(--shadow)'; el.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)' }}
      >
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700,
          color: 'var(--text)', margin: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{t.titulo}</p>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-dim)', margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{t.conteudo}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {catLabel ? (
            <span style={{
              fontSize: 11, fontFamily: 'var(--font-sans)', fontWeight: 600,
              color: 'var(--accent)', background: 'var(--accent-glow)',
              border: '1px solid var(--accent-dim)', borderRadius: 9999,
              padding: '2px 8px', textTransform: 'uppercase', letterSpacing: 0.4,
            }}>{catLabel}</span>
          ) : <span />}
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-mute)' }}>
            {formatarDataRelativa(t.criado_em)}
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ── main page ───────────────────────────────────── */

export default function Perfil() {
  const { user, loading } = useAuth()
  const qc = useQueryClient()
  const [editando, setEditando] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  const { data: perfil } = useQuery({
    queryKey: ['perfil', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuarios').select('*').eq('id', user!.id).single()
      if (error) throw error
      return data as UsuarioPerfil
    },
    enabled: !!user,
  })

  const { data: testemunhos } = useQuery({
    queryKey: ['meus-testemunhos', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testemunhos')
        .select('*, midias(*)')
        .eq('usuario_id', user!.id)
        .order('criado_em', { ascending: false })
      if (error) throw error
      return data as Testemunho[]
    },
    enabled: !!user,
  })

  const salvarPerfil = useMutation({
    mutationFn: async (dados: Partial<UsuarioPerfil>) => {
      const { error } = await supabase.from('usuarios').update(dados).eq('id', user!.id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['perfil', user?.id] }),
  })

  const uploadAvatar = async (file: File) => {
    if (!user) return
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${user.id}/avatar.${ext}`
    const { error: upErr } = await supabase.storage
      .from('avatares').upload(path, file, { upsert: true })
    if (upErr) { alert('Erro ao enviar foto.'); return }
    const { data: { publicUrl } } = supabase.storage.from('avatares').getPublicUrl(path)
    await salvarPerfil.mutateAsync({ avatar_url: publicUrl })
  }

  if (loading) return null

  if (!user) {
    return (
      <>
        <Helmet><title>Perfil — evangeliza.me</title></Helmet>
        <div style={{ padding: '80px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--accent-glow)', border: '2px solid var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
          }}>👤</div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Faça login para ver seu perfil</p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-dim)', margin: 0 }}>Salve seus testemunhos e personalize seu perfil.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              onClick={() => setShowAuth(true)}
              style={{
                padding: '10px 24px', borderRadius: 9999, border: 'none',
                background: 'var(--accent)', color: '#fff',
                fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >Entrar / Criar conta</button>
          </div>
        </div>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultMode="entrar" />}
      </>
    )
  }

  const socialLinks = buildSocialLinks(perfil)
  const aprovados = testemunhos?.filter(t => t.status === 'aprovado') ?? []
  const pendentes = testemunhos?.filter(t => t.status === 'pendente') ?? []

  return (
    <>
      <Helmet><title>{perfil?.nome ?? 'Meu perfil'} — evangeliza.me</title></Helmet>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, oklch(0.65 0.22 215 / 0.12), oklch(0.55 0.26 290 / 0.08), transparent)',
        borderBottom: '1px solid var(--border)',
        padding: '32px 24px 24px',
      }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', maxWidth: 680, margin: '0 auto' }}>
          <AvatarCircle perfil={perfil ?? null} size={88} editavel onUpload={uploadAvatar} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: '0 0 2px' }}>
                  {perfil?.nome ?? '…'}
                </h1>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-mute)', margin: '0 0 10px' }}>
                  @{perfil?.slug}
                </p>
              </div>
              <button
                onClick={() => setEditando(true)}
                style={{
                  padding: '7px 16px', borderRadius: 9999,
                  border: '1px solid var(--border)', background: 'var(--bg-elev)',
                  color: 'var(--text)', fontFamily: 'var(--font-sans)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >✏️ Editar perfil</button>
            </div>

            {perfil?.bio && (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-dim)', margin: '0 0 12px', lineHeight: 1.55 }}>
                {perfil.bio}
              </p>
            )}

            {socialLinks.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {socialLinks.map(s => <SocialLink key={s.label} {...s} />)}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 24, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', maxWidth: 680, margin: '20px auto 0' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{aprovados.length}</p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-mute)', margin: 0 }}>aprovados</p>
          </div>
          {pendentes.length > 0 && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, color: '#f59e0b', margin: 0 }}>{pendentes.length}</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-mute)', margin: 0 }}>em revisão</p>
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              {perfil?.criado_em ? new Date(perfil.criado_em).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : '—'}
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-mute)', margin: 0 }}>membro desde</p>
          </div>
        </div>
      </div>

      {/* Testimonies */}
      <div style={{ padding: '24px 16px', maxWidth: 760, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {(testemunhos?.length ?? 0) === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Você ainda não tem testemunhos.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-dim)', marginBottom: 20 }}>
              Compartilhe o que Deus fez por você.
            </p>
            <Link to="/compartilhar" style={{
              display: 'inline-block', padding: '10px 24px', borderRadius: 9999,
              background: 'var(--accent)', color: '#fff',
              fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, textDecoration: 'none',
            }}>✦ Compartilhar</Link>
          </div>
        ) : (
          <>
            {pendentes.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: '#f59e0b', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  ⏳ Em revisão ({pendentes.length})
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                  {pendentes.map(t => <MiniCard key={t.id} t={t} />)}
                </div>
              </div>
            )}

            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--text-mute)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Testemunhos ({aprovados.length})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {aprovados.map(t => <MiniCard key={t.id} t={t} />)}
            </div>
          </>
        )}
      </div>

      {editando && perfil && (
        <EditarPerfilModal
          perfil={perfil}
          onClose={() => setEditando(false)}
          onSave={dados => salvarPerfil.mutateAsync(dados)}
        />
      )}
    </>
  )
}

/* ── social link builder ─────────────────────────── */

function buildSocialLinks(perfil: UsuarioPerfil | undefined) {
  if (!perfil) return []
  const links: { href: string; icon: React.ReactNode; label: string }[] = []

  if (perfil.instagram) links.push({
    href: perfil.instagram.startsWith('http') ? perfil.instagram : `https://instagram.com/${perfil.instagram.replace(/^@/, '')}`,
    icon: <span style={{ fontSize: 14 }}>📸</span>,
    label: `@${perfil.instagram.replace(/^@/, '')}`,
  })
  if (perfil.twitter) links.push({
    href: perfil.twitter.startsWith('http') ? perfil.twitter : `https://x.com/${perfil.twitter.replace(/^@/, '')}`,
    icon: <span style={{ fontSize: 14, fontWeight: 700 }}>𝕏</span>,
    label: `@${perfil.twitter.replace(/^@/, '')}`,
  })
  if (perfil.youtube) links.push({
    href: perfil.youtube.startsWith('http') ? perfil.youtube : `https://youtube.com/@${perfil.youtube.replace(/^@/, '')}`,
    icon: <span style={{ fontSize: 14 }}>▶️</span>,
    label: perfil.youtube.replace(/^@/, ''),
  })
  if (perfil.website) links.push({
    href: perfil.website.startsWith('http') ? perfil.website : `https://${perfil.website}`,
    icon: <span style={{ fontSize: 14 }}>🌐</span>,
    label: perfil.website.replace(/^https?:\/\//, '').replace(/\/$/, ''),
  })
  return links
}
