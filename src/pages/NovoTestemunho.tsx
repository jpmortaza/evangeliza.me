import { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '@/lib/supabase'
import { extrairYoutubeId } from '@/lib/utils'
import { CATEGORIAS } from '@/types'
import SectionHeader from '@/components/layout/Header'
import { useAuth } from '@/contexts/AuthContext'

const MAX_CHARS = 2000
const MIN_CHARS = 30

interface FormState {
  titulo: string
  conteudo: string
  nome: string
  anonimo: boolean
  categoria: string
  youtubeUrl: string
  foto: File | null
}

const INICIAL: FormState = {
  titulo: '', conteudo: '', nome: '', anonimo: false,
  categoria: '', youtubeUrl: '', foto: null,
}

export default function NovoTestemunho() {
  const { user } = useAuth()
  const [form, setForm] = useState<FormState>(INICIAL)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [enviadoId, setEnviadoId] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [youtubeErro, setYoutubeErro] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const nomeLogado = user?.user_metadata?.nome ?? user?.email?.split('@')[0] ?? ''

  useEffect(() => {
    if (user && nomeLogado) set('nome', nomeLogado)
  }, [user, nomeLogado])

  const set = (k: keyof FormState, v: string | boolean | File | null) =>
    setForm(p => ({ ...p, [k]: v }))

  const charCount = form.conteudo.length
  const canSubmit = form.titulo.trim().length >= 5 && charCount >= MIN_CHARS && !youtubeErro

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    if (!canSubmit) return
    setEnviando(true)
    try {
      const { data: t, error: dbErr } = await supabase
        .from('testemunhos')
        .insert({
          titulo: form.titulo.trim(),
          conteudo: form.conteudo.trim(),
          usuario_id: (!form.anonimo && user) ? user.id : null,
          nome_anonimo: (form.anonimo || user) ? null : (form.nome.trim() || null),
          eh_anonimo: form.anonimo || (!user && !form.nome.trim()),
          categoria: form.categoria || null,
          status: 'pendente',
        })
        .select('id, criado_em')
        .single()

      if (dbErr) throw new Error(dbErr.message)

      if (form.youtubeUrl) {
        const videoId = extrairYoutubeId(form.youtubeUrl)
        if (videoId) await supabase.from('midias').insert({ testemunho_id: t.id, tipo: 'youtube', url: videoId, ordem: 0 })
      }

      if (form.foto) {
        const ext = form.foto.name.split('.').pop() ?? 'jpg'
        const path = `imagens/${t.id}/${crypto.randomUUID()}.${ext}`
        const { error: upErr } = await supabase.storage.from('testemunhos-midia').upload(path, form.foto)
        if (!upErr) {
          const { data: urlData } = supabase.storage.from('testemunhos-midia').getPublicUrl(path)
          await supabase.from('midias').insert({ testemunho_id: t.id, tipo: 'imagem', url: urlData.publicUrl, ordem: 0 })
        }
      }

      const year = new Date(t.criado_em).getFullYear()
      const num = parseInt(t.id.replace(/-/g, '').slice(-8), 16) % 10000
      setEnviadoId(`T-${year}-${String(num).padStart(4, '0')}`)
      setEnviado(true)
      setForm(INICIAL)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao enviar. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <>
        <Helmet><title>Enviado — evangeliza.me</title></Helmet>
        <SectionHeader title="Enviado" />
        <div style={{ padding: '32px 16px', textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-glow)',
            border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: 28, color: 'var(--accent)', fontWeight: 700,
          }}>+</div>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 23, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
            Obrigado por confiar isso a nós.
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-dim)', maxWidth: 380, margin: '0 auto 8px', lineHeight: 1.55 }}>
            Seu testemunho está em revisão. Aprovamos quase tudo — apenas conferimos se o conteúdo é genuíno e respeitoso.
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mute)', marginBottom: 28 }}>
            Código: {enviadoId}
          </p>
          <button
            onClick={() => setEnviado(false)}
            style={{ padding: '10px 22px', borderRadius: 9999, background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' }}
          >
            Postar outro
          </button>
        </div>
      </>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'transparent',
    border: '1px solid var(--border)', borderRadius: 8,
    color: 'var(--text)', padding: '10px 14px', fontSize: 15,
    fontFamily: 'var(--font-sans)', transition: 'border-color 0.15s',
  }

  return (
    <>
      <Helmet><title>Postar — evangeliza.me</title></Helmet>
      <SectionHeader title="Compartilhar testemunho" />

      <form onSubmit={enviar} style={{ padding: '16px' }}>
        {/* Compose area */}
        <div style={{ display: 'flex', gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
          {/* Avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: 'var(--accent-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: 'var(--accent)',
          }}>+</div>

          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={form.titulo}
              onChange={e => set('titulo', e.target.value)}
              placeholder="Título — o que aconteceu?"
              maxLength={150}
              style={{ ...inputStyle, marginBottom: 10, fontSize: 17, fontWeight: 600, border: 'none', borderBottom: '1px solid var(--border)', borderRadius: 0, padding: '6px 0' }}
              required
            />
            <textarea
              className="compose-input"
              value={form.conteudo}
              onChange={e => set('conteudo', e.target.value.slice(0, MAX_CHARS))}
              placeholder="Conte sua história. Sem jargão religioso. Sua voz vale mais que vocabulário bonito."
              rows={6}
              required
            />

            {/* Char counter */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mute)' }}>
                mín. {MIN_CHARS}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Progress ring */}
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="var(--border)" strokeWidth="2.5" />
                  <circle cx="12" cy="12" r="10" fill="none"
                    stroke={charCount >= MIN_CHARS ? 'var(--accent)' : 'var(--text-mute)'}
                    strokeWidth="2.5"
                    strokeDasharray={`${Math.min((charCount / MAX_CHARS) * 62.8, 62.8)} 62.8`}
                    strokeLinecap="round"
                    transform="rotate(-90 12 12)"
                    style={{ transition: 'stroke-dasharray 0.2s, stroke 0.2s' }}
                  />
                </svg>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: charCount >= MIN_CHARS ? 'var(--accent)' : 'var(--text-mute)', fontVariantNumeric: 'tabular-nums' }}>
                  {MAX_CHARS - charCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Optional fields */}
        <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--text-mute)', margin: 0 }}>Opcionais</p>

          {/* Nome */}
          {user && !form.anonimo ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', borderRadius: 8,
              background: 'var(--accent-glow)', border: '1px solid var(--accent-dim)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #c4b5fd, #818cf8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff',
              }}>{nomeLogado[0]?.toUpperCase()}</div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>
                {nomeLogado}
              </span>
              <span style={{
                marginLeft: 'auto', fontSize: 11, fontFamily: 'var(--font-sans)',
                color: 'var(--accent)', fontWeight: 600, letterSpacing: 0.3,
              }}>✓ conta verificada</span>
            </div>
          ) : !form.anonimo ? (
            <input
              type="text"
              value={form.nome}
              onChange={e => set('nome', e.target.value)}
              placeholder="Seu nome (deixe vazio para anônimo)"
              style={inputStyle}
            />
          ) : null}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
            <input type="checkbox" checked={form.anonimo} onChange={e => set('anonimo', e.target.checked)} style={{ accentColor: 'var(--accent)', width: 16, height: 16 }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-dim)' }}>Postar como anônimo</span>
          </label>

          {/* Categoria */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {Object.entries(CATEGORIAS).map(([k, v]) => {
              const active = form.categoria === k
              return (
                <button
                  key={k} type="button"
                  onClick={() => set('categoria', active ? '' : k)}
                  style={{
                    padding: '6px 14px', borderRadius: 9999,
                    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                    background: active ? 'var(--accent-glow)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text-dim)',
                    fontFamily: 'var(--font-sans)', fontSize: 14, cursor: 'pointer',
                    transition: 'border-color 0.15s, color 0.15s, background 0.15s',
                  }}
                >{v}</button>
              )
            })}
          </div>

          {/* YouTube */}
          <input
            type="url"
            value={form.youtubeUrl}
            onChange={e => {
              set('youtubeUrl', e.target.value)
              if (e.target.value) setYoutubeErro(!extrairYoutubeId(e.target.value))
              else setYoutubeErro(false)
            }}
            placeholder="URL do YouTube (opcional)"
            style={{ ...inputStyle, borderColor: youtubeErro ? '#f4212e' : 'var(--border)' }}
          />
          {youtubeErro && <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#f4212e', margin: 0 }}>URL inválida</p>}

          {/* Foto */}
          <label style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 8,
            border: '1px dashed var(--border)', cursor: 'pointer',
            color: 'var(--text-dim)', fontFamily: 'var(--font-sans)', fontSize: 14,
            transition: 'border-color 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text-dim)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
              <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            {form.foto ? form.foto.name : 'Adicionar foto (jpg, png — até 10 MB)'}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => {
                const f = e.target.files?.[0]
                if (f && f.size <= 10 * 1024 * 1024) set('foto', f)
                else if (f) setErro('Foto: máximo 10 MB.')
              }}
            />
          </label>
        </div>

        {erro && <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: '#f4212e', padding: '12px 0' }}>{erro}</p>}

        {/* Submit */}
        <div style={{ paddingTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={enviando || !canSubmit}
            style={{
              padding: '10px 22px', borderRadius: 9999,
              background: 'var(--accent)', color: '#fff',
              fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700,
              border: 'none', cursor: canSubmit && !enviando ? 'pointer' : 'default',
              opacity: (enviando || !canSubmit) ? 0.5 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {enviando ? 'Enviando…' : 'Publicar'}
          </button>
        </div>

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-mute)', marginTop: 8, textAlign: 'right' }}>
          Revisado pelos Zeladores antes de publicar.
        </p>
      </form>
    </>
  )
}
