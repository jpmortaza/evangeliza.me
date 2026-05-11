import { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '@/lib/supabase'
import { extrairYoutubeId } from '@/lib/utils'
import { CATEGORIAS } from '@/types'

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)' }
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

function Field({ label, optional, hint, children }: { label: string; optional?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ marginBottom: 8, display: 'flex', gap: 8, alignItems: 'baseline' }}>
        <span style={{ ...MONO, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase' as const, color: 'var(--accent)' }}>{label}</span>
        {optional && <span style={{ ...MONO, fontSize: 10, color: 'var(--text-mute)' }}>· opcional</span>}
      </div>
      {children}
      {hint && <p style={{ marginTop: 6, ...MONO, fontSize: 10, color: 'var(--text-mute)' }}>{hint}</p>}
    </div>
  )
}

export default function NovoTestemunho() {
  const [form, setForm] = useState<FormState>(INICIAL)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [enviado_id, setEnviadoId] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [youtubeErro, setYoutubeErro] = useState(false)
  const [timer, setTimer] = useState(58)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (enviado) return
    const id = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [enviado])

  const set = (k: keyof FormState, v: string | boolean | File | null) =>
    setForm(p => ({ ...p, [k]: v }))

  const charCount = form.conteudo.length
  const pct = Math.min((charCount / MAX_CHARS) * 100, 100)
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
          nome_anonimo: form.anonimo ? null : (form.nome.trim() || null),
          eh_anonimo: form.anonimo || !form.nome.trim(),
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
      setErro(e instanceof Error ? e.message : 'ERRO AO ENVIAR. TENTE NOVAMENTE.')
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div style={{ padding: 'clamp(40px,6vw,80px) clamp(20px,5vw,64px)', minHeight: '80vh' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', border: '1px solid var(--accent-dim)', color: 'var(--accent)', ...MONO, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase' as const }}>
          <span className="ev-pulse-dot" />
          RECEBIDO
        </span>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 'clamp(32px, 6vw, 56px)', letterSpacing: -2, lineHeight: 1.02, margin: '20px 0 16px', color: 'var(--text)' }}>
          Obrigado por confiar isso a nós.
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text-dim)', lineHeight: 1.55, maxWidth: 540, margin: '0 0 28px' }}>
          Seu testemunho está em revisão. Aprovamos quase tudo — apenas conferimos se não há identificação de terceiros sem consentimento. Em média, leva menos de 2 horas.
        </p>

        <div style={{ padding: 18, border: '1px solid var(--border)', background: 'var(--bg-elev)', maxWidth: 540, marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap' as const, gap: 8 }}>
            <span style={{ ...MONO, fontSize: 11, color: 'var(--accent)', letterSpacing: 0.4 }}>{enviado_id}</span>
            <span style={{ ...MONO, fontSize: 10, color: 'var(--text-mute)', letterSpacing: 0.4 }}>RASCUNHO ENVIADO</span>
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-mute)', margin: 0 }}>
            Você pode acompanhar o status com este código.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
          <button
            onClick={() => { setEnviado(false); setTimer(58) }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 18px', background: 'var(--accent)', color: 'var(--bg-page)', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 500, border: 'none', cursor: 'pointer' }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10"><rect x="4.3" y="0" width="1.4" height="10" fill="currentColor" /><rect x="0" y="4.3" width="10" height="1.4" fill="currentColor" /></svg>
            Postar outro
          </button>
        </div>
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'transparent', border: '1px solid var(--border)',
    color: 'var(--text)', padding: '12px 14px', fontSize: 14,
    fontFamily: 'var(--font-sans)', transition: 'border-color 0.15s',
  }

  return (
    <>
      <Helmet><title>Postar — evangeliza.me</title></Helmet>

      <div style={{ padding: 'clamp(24px,5vw,48px) clamp(16px,5vw,64px) 80px', minHeight: '80vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'clamp(16px,4vw,28px)', gap: 12, flexWrap: 'wrap' as const }}>
          <div>
            <span style={{ ...MONO, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase' as const, color: 'var(--accent)' }}>
              FORMULÁRIO · /postar
            </span>
            <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 'clamp(28px,5vw,44px)', letterSpacing: -1.5, lineHeight: 1.05, margin: '10px 0 8px', color: 'var(--text)' }}>
              O que Deus fez na sua vida?
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-dim)', margin: 0, maxWidth: 540 }}>
              Sem cadastro, sem email, sem captcha. Você escreve, a gente publica.
            </p>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '3px 8px', border: '1px solid var(--border)',
            color: 'var(--text-dim)', ...MONO, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase' as const,
          }}>
            <span className="ev-pulse-dot" />
            Tempo médio · {timer}s
          </span>
        </div>

        <form onSubmit={enviar} style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}>
          <Field label="Título · obrigatório">
            <input
              type="text"
              value={form.titulo}
              onChange={e => set('titulo', e.target.value)}
              placeholder="Em poucas palavras, o que aconteceu?"
              maxLength={150}
              style={{ ...inputStyle, fontSize: 16, fontWeight: 500 }}
              required
            />
          </Field>

          <Field label="Testemunho · obrigatório" hint="Conte como foi. Não precisa de jargão religioso. Sua voz vale mais que vocabulário bonito.">
            <textarea
              value={form.conteudo}
              onChange={e => set('conteudo', e.target.value.slice(0, MAX_CHARS))}
              placeholder="Comece pelo momento. Onde você estava, o que tinha acabado de acontecer, o que você sentiu…"
              rows={10}
              style={{ ...inputStyle, resize: 'vertical' }}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, ...MONO, fontSize: 10.5, color: 'var(--text-mute)', letterSpacing: 0.4 }}>
              <span>min. {MIN_CHARS} caracteres</span>
              <span style={{ color: charCount >= MIN_CHARS ? 'var(--accent)' : 'var(--text-mute)', fontVariantNumeric: 'tabular-nums' }}>
                {charCount} / {MAX_CHARS}
              </span>
            </div>
            <div style={{ marginTop: 4, height: 1, background: 'var(--bg-elev)' }}>
              <div style={{ height: 1, width: `${pct}%`, background: charCount >= MIN_CHARS ? 'var(--accent)' : 'var(--border)', transition: 'width 0.3s, background 0.3s' }} />
            </div>
          </Field>

          {/* 2-col grid for name + category */}
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <Field label="Seu nome" optional hint="Deixe vazio para postar como Anônimo. Anônimo é sagrado.">
              <input
                type="text"
                value={form.nome}
                onChange={e => set('nome', e.target.value)}
                placeholder="Anônimo"
                disabled={form.anonimo}
                style={{ ...inputStyle, opacity: form.anonimo ? 0.3 : 1 }}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.anonimo}
                  onChange={e => set('anonimo', e.target.checked)}
                  style={{ accentColor: 'var(--accent)' }}
                />
                <span style={{ ...MONO, fontSize: 10, color: 'var(--text-mute)', textTransform: 'uppercase' as const }}>
                  POSTAR COMO ANÔNIMO
                </span>
              </label>
            </Field>

            <Field label="Categoria" optional>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                {Object.entries(CATEGORIAS).map(([k, v]) => {
                  const active = form.categoria === k
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => set('categoria', active ? '' : k)}
                      style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '7px 10px', cursor: 'pointer',
                        background: 'transparent',
                        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                        color: active ? 'var(--accent)' : 'var(--text-dim)',
                        ...MONO, fontSize: 11, letterSpacing: 0.4,
                        textTransform: 'uppercase' as const,
                        transition: 'border-color 0.15s, color 0.15s',
                      }}
                    >
                      {v}
                    </button>
                  )
                })}
              </div>
            </Field>
          </div>

          <Field label="URL do YouTube" optional hint="Cole a URL de um vídeo relacionado ao seu testemunho.">
            <input
              type="url"
              value={form.youtubeUrl}
              onChange={e => {
                set('youtubeUrl', e.target.value)
                if (e.target.value) setYoutubeErro(!extrairYoutubeId(e.target.value))
                else setYoutubeErro(false)
              }}
              placeholder="https://youtu.be/..."
              style={{ ...inputStyle, borderColor: youtubeErro ? '#ef4444' : 'var(--border)' }}
            />
            {youtubeErro && <p style={{ marginTop: 4, ...MONO, fontSize: 10, color: '#ef4444' }}>URL INVÁLIDA</p>}
          </Field>

          <Field label="Foto" optional hint="jpg · png · até 10 MB">
            <label
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                padding: '14px 16px', border: '1px dashed var(--border)',
                cursor: 'pointer', color: 'var(--text-dim)',
                ...MONO, fontSize: 11.5, letterSpacing: 0.4, textTransform: 'uppercase' as const,
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text-dim)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <span>
                <svg width="10" height="10" viewBox="0 0 10 10" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                  <rect x="4.3" y="0" width="1.4" height="10" fill="currentColor" />
                  <rect x="0" y="4.3" width="10" height="1.4" fill="currentColor" />
                </svg>
                {form.foto ? form.foto.name : 'arraste ou clique para selecionar'}
              </span>
              <span style={{ color: 'var(--text-mute)', fontSize: 10 }}>jpg · png · até 10mb</span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f && f.size <= 10 * 1024 * 1024) set('foto', f)
                  else if (f) setErro('FOTO: máximo 10 MB.')
                }}
              />
            </label>
          </Field>

          {erro && (
            <p style={{ ...MONO, fontSize: 11, color: '#ef4444', padding: '10px 12px', border: '1px solid rgba(239,68,68,0.3)' }}>
              {erro}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const, paddingTop: 8 }}>
            <button
              type="submit"
              disabled={enviando || !canSubmit}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 18px', background: 'var(--accent)',
                color: 'var(--bg-page)', fontFamily: 'var(--font-sans)',
                fontSize: 13.5, fontWeight: 500, border: 'none', cursor: 'pointer',
                opacity: (enviando || !canSubmit) ? 0.45 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              <svg width="12" height="15" viewBox="0 0 12 15">
                <rect x="5.3" y="0" width="1.4" height="15" fill="currentColor" />
                <rect x="0" y="4.8" width="12" height="1.4" fill="currentColor" />
              </svg>
              {enviando ? 'Enviando…' : 'Publicar testemunho'}
            </button>
            <span style={{ ...MONO, fontSize: 10, color: 'var(--text-mute)', maxWidth: 320 }}>
              Ao publicar você concorda com nossa moderação simples · sem cadastro · sem rastreio
            </span>
          </div>
        </form>
      </div>
    </>
  )
}
