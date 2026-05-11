import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '@/lib/supabase'
import { type Testemunho, type Comentario, CATEGORIAS } from '@/types'
import { formatarDataRelativa, getDisplayId } from '@/lib/utils'
import YouTubeEmbed from '@/components/testemunhos/YouTubeEmbed'
import BotoesCompartilhar from '@/components/compartilhamento/BotoesCompartilhar'
import SectionHeader from '@/components/layout/Header'
import AuthModal from '@/components/auth/AuthModal'
import { useAuth } from '@/contexts/AuthContext'

async function buscarTestemunho(id: string): Promise<Testemunho> {
  const { data, error } = await supabase
    .from('testemunhos')
    .select('*, usuarios!testemunhos_usuario_id_fkey(nome, slug, avatar_url), midias(*)')
    .eq('id', id)
    .eq('status', 'aprovado')
    .single()
  if (error) throw error
  return data as Testemunho
}

async function buscarComentarios(testemunho_id: string): Promise<Comentario[]> {
  const { data, error } = await supabase
    .from('comentarios')
    .select('*, usuarios(nome, slug, avatar_url)')
    .eq('testemunho_id', testemunho_id)
    .order('criado_em', { ascending: true })
  if (error) throw error
  return data as Comentario[]
}

function Avatar({ nome, size = 40 }: { nome: string; size?: number }) {
  const isAnon = nome === 'Anônimo'
  const letra = isAnon ? '?' : nome[0].toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: isAnon ? 'var(--accent-glow)' : 'linear-gradient(135deg, #c4b5fd, #818cf8)',
      border: '1.5px solid var(--accent-dim)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.42, fontWeight: 700,
      color: isAnon ? 'var(--accent)' : '#fff',
    }}>
      {letra}
    </div>
  )
}

/* ── Comments section ── */
function SecaoComentarios({ testemunhoId }: { testemunhoId: string }) {
  const { user } = useAuth()
  const [texto, setTexto] = useState('')
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'entrar' | 'cadastrar'>('entrar')
  const qc = useQueryClient()

  const { data: comentarios = [], isLoading } = useQuery({
    queryKey: ['comentarios', testemunhoId],
    queryFn: () => buscarComentarios(testemunhoId),
  })

  const enviarComentario = useMutation({
    mutationFn: async (conteudo: string) => {
      if (!user) throw new Error('Precisa estar logado')
      const { error } = await supabase.from('comentarios').insert({
        testemunho_id: testemunhoId,
        usuario_id: user.id,
        conteudo,
      })
      if (error) throw error
    },
    onSuccess: () => {
      setTexto('')
      qc.invalidateQueries({ queryKey: ['comentarios', testemunhoId] })
    },
  })

  const displayName = user?.user_metadata?.nome ?? user?.email?.split('@')[0] ?? 'Você'

  return (
    <section style={{ padding: '24px 16px 32px', borderTop: '1px solid var(--border)' }}>
      <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: '0 0 20px' }}>
        Comentários {comentarios.length > 0 && <span style={{ fontWeight: 400, color: 'var(--text-mute)', fontSize: 14 }}>({comentarios.length})</span>}
      </h2>

      {/* Comment form */}
      {user ? (
        <div style={{
          background: 'var(--bg-elev)', borderRadius: 14,
          border: '1.5px solid var(--border)', padding: 16,
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #c4b5fd, #818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: '#fff',
            }}>{displayName[0].toUpperCase()}</div>
            <textarea
              value={texto}
              onChange={e => setTexto(e.target.value.slice(0, 500))}
              placeholder="Escreva um comentário…"
              rows={3}
              style={{
                flex: 1, background: 'transparent', border: 'none',
                color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 15,
                resize: 'none', lineHeight: 1.5,
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mute)' }}>{500 - texto.length}</span>
            <button
              onClick={() => texto.trim() && enviarComentario.mutate(texto.trim())}
              disabled={!texto.trim() || enviarComentario.isPending}
              style={{
                padding: '8px 20px', borderRadius: 9999, border: 'none',
                background: texto.trim() ? 'linear-gradient(135deg, oklch(0.65 0.22 215), oklch(0.55 0.26 290))' : 'var(--bg-hover)',
                color: texto.trim() ? '#fff' : 'var(--text-mute)',
                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700,
                cursor: texto.trim() ? 'pointer' : 'default',
                transition: 'all 0.15s',
              }}
            >{enviarComentario.isPending ? 'Enviando…' : 'Comentar'}</button>
          </div>
        </div>
      ) : (
        /* Not logged in — CTA to sign in */
        <div style={{
          background: 'linear-gradient(135deg, #f8f9ff, #f0eeff)',
          borderRadius: 14, border: '1.5px solid var(--border)',
          padding: '24px 20px', marginBottom: 24, textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>💬</div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px' }}>
            Faça login para comentar
          </p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-dim)', margin: '0 0 18px' }}>
            Comentários são exclusivos para membros cadastrados.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setAuthMode('entrar'); setShowAuth(true) }}
              style={{
                padding: '9px 22px', borderRadius: 9999,
                border: '1.5px solid var(--border)', background: '#fff',
                color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
                cursor: 'pointer',
              }}
            >Entrar</button>
            <button
              onClick={() => { setAuthMode('cadastrar'); setShowAuth(true) }}
              style={{
                padding: '9px 22px', borderRadius: 9999, border: 'none',
                background: 'linear-gradient(135deg, oklch(0.65 0.22 215), oklch(0.55 0.26 290))',
                color: '#fff', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700,
                cursor: 'pointer',
              }}
            >Criar conta grátis</button>
          </div>
        </div>
      )}

      {/* Comments list */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-mute)', fontFamily: 'var(--font-sans)', fontSize: 14 }}>
          Carregando comentários…
        </div>
      )}

      {!isLoading && comentarios.length === 0 && (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-mute)', textAlign: 'center', padding: '20px 0' }}>
          Nenhum comentário ainda. Seja o primeiro.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {comentarios.map(c => {
          const autor = c.usuarios?.nome ?? 'Membro'
          return (
            <div key={c.id} style={{ display: 'flex', gap: 12 }}>
              <Avatar nome={autor} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{autor}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-mute)' }}>{formatarDataRelativa(c.criado_em)}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.55, margin: 0 }}>{c.conteudo}</p>
              </div>
            </div>
          )
        })}
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultMode={authMode} />}
    </section>
  )
}

/* ── Main page ── */
export default function TestemunhoPage() {
  const { id } = useParams<{ id: string }>()

  const { data: t, isLoading, error } = useQuery({
    queryKey: ['testemunho', id],
    queryFn: () => buscarTestemunho(id!),
    enabled: !!id,
  })

  useEffect(() => {
    if (t?.id) {
      supabase.from('testemunhos').update({ visualizacoes: (t.visualizacoes ?? 0) + 1 }).eq('id', t.id).then(() => {})
    }
  }, [t?.id])

  if (isLoading) {
    return (
      <>
        <SectionHeader title="Testemunho" />
        <div className="animate-pulse" style={{ padding: 16 }}>
          <div style={{ height: 28, width: '70%', borderRadius: 6, background: 'var(--bg-hover)', marginBottom: 16 }} />
          <div style={{ height: 14, borderRadius: 4, background: 'var(--bg-hover)', marginBottom: 8 }} />
          <div style={{ height: 14, width: '80%', borderRadius: 4, background: 'var(--bg-hover)' }} />
        </div>
      </>
    )
  }

  if (error || !t) {
    return (
      <>
        <SectionHeader title="Testemunho" />
        <div style={{ padding: '60px 16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Não encontrado.</p>
          <Link to="/" style={{ color: 'var(--accent)', fontFamily: 'var(--font-sans)', fontSize: 15 }}>← Voltar ao feed</Link>
        </div>
      </>
    )
  }

  const autor = t.eh_anonimo ? 'Anônimo' : (t.usuarios?.nome ?? t.nome_anonimo ?? 'Anônimo')
  const midia = t.midias?.[0]
  const url = `${window.location.origin}/testemunho/${t.id}`
  const displayId = getDisplayId(t.criado_em, t.id)
  const tempo = formatarDataRelativa(t.criado_em)
  const catLabel = t.categoria ? CATEGORIAS[t.categoria] : null

  return (
    <>
      <Helmet>
        <title>{t.titulo} — evangeliza.me</title>
        <meta name="description" content={t.conteudo.slice(0, 160)} />
        <meta property="og:title" content={t.titulo} />
        <meta property="og:description" content={t.conteudo.slice(0, 200)} />
        <meta property="og:url" content={url} />
        {midia?.tipo === 'imagem' && <meta property="og:image" content={midia.url} />}
      </Helmet>

      <SectionHeader title="Testemunho" />

      <article style={{ padding: 16 }}>
        {/* Author row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
          <Avatar nome={autor} size={48} />
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{autor}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mute)' }}>{displayId}</span>
              <span style={{ color: 'var(--text-mute)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-dim)' }}>{tempo}</span>
              {catLabel && (
                <span style={{
                  fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-sans)',
                  color: 'var(--accent)', background: 'var(--accent-glow)',
                  border: '1px solid var(--accent-dim)',
                  padding: '2px 8px', borderRadius: 9999, textTransform: 'uppercase', letterSpacing: 0.4,
                }}>{catLabel}</span>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 22, fontWeight: 800, color: 'var(--text)', lineHeight: 1.3, margin: '0 0 16px' }}>
          {t.titulo}
        </h1>

        {/* Media */}
        {midia?.tipo === 'youtube' && (
          <div style={{ marginBottom: 16, borderRadius: 14, overflow: 'hidden' }}>
            <YouTubeEmbed videoId={midia.url} title={t.titulo} />
          </div>
        )}
        {midia?.tipo === 'imagem' && (
          <img src={midia.url} alt={t.titulo} style={{ width: '100%', borderRadius: 14, marginBottom: 16, maxHeight: 400, objectFit: 'cover' }} />
        )}

        {/* Content */}
        <div style={{ marginBottom: 20 }}>
          {t.conteudo.split('\n').map((p, i) =>
            p.trim() ? (
              <p key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: 17, lineHeight: 1.65, color: 'var(--text)', margin: '0 0 14px' }}>{p}</p>
            ) : null
          )}
        </div>

        {/* Share bar */}
        <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '12px 0', marginBottom: 20 }}>
          <BotoesCompartilhar titulo={t.titulo} conteudo={t.conteudo} url={url} />
        </div>
      </article>

      {/* Comments */}
      <SecaoComentarios testemunhoId={t.id} />

      {/* CTA */}
      <div style={{
        margin: '0 16px 32px',
        borderRadius: 16, padding: '24px 20px',
        background: 'linear-gradient(135deg, #f8f9ff, #f0eeff)',
        border: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
          Você também tem uma história assim?
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-dim)', marginBottom: 18 }}>
          Compartilhe como Deus agiu na sua vida. Pode ser anônimo.
        </p>
        <Link
          to="/compartilhar"
          style={{
            display: 'inline-block', padding: '10px 24px', borderRadius: 9999,
            background: 'linear-gradient(135deg, oklch(0.65 0.22 215), oklch(0.55 0.26 290))',
            color: '#fff', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, textDecoration: 'none',
          }}
        >Compartilhar</Link>
      </div>
    </>
  )
}
