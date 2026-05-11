import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '@/lib/supabase'
import { extrairYoutubeId } from '@/lib/utils'
import { CATEGORIAS } from '@/types'

const MONO: React.CSSProperties = { fontFamily: '"Geist Mono", monospace' }
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

function Campo({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <div className="mb-2">
        <span className="text-[10px] tracking-widest" style={{ ...MONO, color: '#555' }}>{label}</span>
      </div>
      {children}
      {hint && <p className="mt-1.5 text-[10px]" style={{ ...MONO, color: '#444' }}>{hint}</p>}
    </div>
  )
}

export default function NovoTestemunho() {
  const [form, setForm] = useState<FormState>(INICIAL)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [youtubeErro, setYoutubeErro] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (k: keyof FormState, v: string | boolean | File | null) =>
    setForm(p => ({ ...p, [k]: v }))

  const charCount = form.conteudo.length
  const pct = Math.min((charCount / MAX_CHARS) * 100, 100)

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    if (form.titulo.trim().length < 5) { setErro('TÍTULO: mínimo 5 caracteres.'); return }
    if (charCount < MIN_CHARS) { setErro(`TESTEMUNHO: mínimo ${MIN_CHARS} caracteres.`); return }
    if (form.youtubeUrl && youtubeErro) { setErro('URL DO YOUTUBE INVÁLIDA.'); return }

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
        .select('id')
        .single()

      if (dbErr) throw new Error(dbErr.message)

      if (form.youtubeUrl) {
        const videoId = extrairYoutubeId(form.youtubeUrl)
        if (videoId) {
          await supabase.from('midias').insert({ testemunho_id: t.id, tipo: 'youtube', url: videoId, ordem: 0 })
        }
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

      setEnviado(true)
      setForm(INICIAL)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'ERRO AO ENVIAR. TENTE NOVAMENTE.')
    } finally {
      setEnviando(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: '1px solid #2a2a2a',
    color: '#fff',
    padding: '12px 14px',
    fontSize: '14px',
    fontFamily: '"Geist", sans-serif',
    transition: 'border-color 0.15s',
  }

  if (enviado) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <span className="text-6xl" style={{ color: '#e8b84b' }}>+</span>
        </div>
        <p className="text-[10px] tracking-widest mb-4" style={{ ...MONO, color: '#555' }}>REGISTRO RECEBIDO</p>
        <h2 className="text-3xl font-bold text-white mb-4">Obrigado.</h2>
        <p className="text-base leading-relaxed mb-8" style={{ color: '#888' }}>
          Seu testemunho foi recebido e será revisado pelos Zeladores antes de ser publicado.
        </p>
        <button
          onClick={() => setEnviado(false)}
          className="text-sm font-bold px-6 py-3 transition-opacity hover:opacity-80"
          style={{ ...MONO, backgroundColor: '#e8b84b', color: '#0a0a0a' }}
        >
          + COMPARTILHAR OUTRO
        </button>
      </div>
    )
  }

  return (
    <>
      <Helmet><title>Postar — evangeliza.me</title></Helmet>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] tracking-widest mb-4" style={{ ...MONO, color: '#555' }}>
            FORMULÁRIO · /POSTAR
          </p>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 leading-tight">
                O que Deus fez<br />na sua vida?
              </h1>
              <p className="text-sm" style={{ color: '#888' }}>
                Sem cadastro, sem email, sem captcha. Você escreve, a gente publica.
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="dot-live" style={{ color: '#e8b84b', fontSize: 8 }}>●</span>
              <span className="text-[10px] tracking-widest" style={{ ...MONO, color: '#555' }}>
                TEMPO MÉDIO · 57 S
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={enviar} className="space-y-6">
          {/* Título */}
          <Campo label="TÍTULO · OBRIGATÓRIO">
            <input
              type="text"
              value={form.titulo}
              onChange={e => set('titulo', e.target.value)}
              placeholder="Em poucas palavras, o que aconteceu?"
              maxLength={150}
              style={inputStyle}
              required
            />
          </Campo>

          {/* Testemunho */}
          <Campo label="TESTEMUNHO · OBRIGATÓRIO">
            <textarea
              value={form.conteudo}
              onChange={e => set('conteudo', e.target.value.slice(0, MAX_CHARS))}
              placeholder="Comece pelo momento. Onde você estava, o que tinha acabado de acontecer, o que você sentiu…"
              rows={10}
              style={{ ...inputStyle, resize: 'vertical' }}
              required
            />
            {/* Counter + bar */}
            <div className="mt-1.5 flex items-center justify-between gap-4">
              <span className="text-[10px]" style={{ ...MONO, color: '#444' }}>
                min. {MIN_CHARS} caracteres
              </span>
              <span
                className="text-[10px]"
                style={{ ...MONO, color: charCount >= MIN_CHARS ? '#e8b84b' : '#555' }}
              >
                {charCount} / {MAX_CHARS}
              </span>
            </div>
            <div className="mt-1 h-px w-full" style={{ backgroundColor: '#1e1e1e' }}>
              <div
                className="h-px transition-all"
                style={{ width: `${pct}%`, backgroundColor: charCount >= MIN_CHARS ? '#e8b84b' : '#333' }}
              />
            </div>
          </Campo>

          {/* Hint */}
          <p className="text-[11px] leading-relaxed" style={{ ...MONO, color: '#444' }}>
            Conte como foi. Não precisa de jargão religioso. Sua voz vale mais que vocabulário bonito.
          </p>

          {/* Opcionais */}
          <div className="border-t pt-6 space-y-5" style={{ borderColor: '#1e1e1e' }}>
            <p className="text-[10px] tracking-widest" style={{ ...MONO, color: '#333' }}>
              OPCIONAIS
            </p>

            {/* Nome */}
            <Campo label="SEU NOME · OPCIONAL">
              <input
                type="text"
                value={form.nome}
                onChange={e => set('nome', e.target.value)}
                placeholder="Deixe vazio para aparecer como Anônimo"
                disabled={form.anonimo}
                style={{ ...inputStyle, opacity: form.anonimo ? 0.3 : 1 }}
              />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.anonimo}
                  onChange={e => set('anonimo', e.target.checked)}
                  style={{ accentColor: '#e8b84b' }}
                />
                <span className="text-[11px]" style={{ ...MONO, color: '#555' }}>
                  POSTAR COMO ANÔNIMO
                </span>
              </label>
            </Campo>

            {/* Categoria */}
            <Campo label="CATEGORIA · OPCIONAL">
              <select
                value={form.categoria}
                onChange={e => set('categoria', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="" style={{ backgroundColor: '#141414' }}>Selecionar…</option>
                {Object.entries(CATEGORIAS).map(([k, v]) => (
                  <option key={k} value={k} style={{ backgroundColor: '#141414' }}>{v}</option>
                ))}
              </select>
            </Campo>

            {/* YouTube */}
            <Campo label="URL DO YOUTUBE · OPCIONAL" hint="Cole a URL de um vídeo relacionado ao seu testemunho.">
              <input
                type="url"
                value={form.youtubeUrl}
                onChange={e => {
                  set('youtubeUrl', e.target.value)
                  if (e.target.value) setYoutubeErro(!extrairYoutubeId(e.target.value))
                  else setYoutubeErro(false)
                }}
                placeholder="https://youtu.be/..."
                style={{ ...inputStyle, borderColor: youtubeErro ? '#ef4444' : '#2a2a2a' }}
              />
              {youtubeErro && (
                <p className="mt-1 text-[10px]" style={{ ...MONO, color: '#ef4444' }}>URL INVÁLIDA</p>
              )}
            </Campo>

            {/* Foto */}
            <Campo label="FOTO · OPCIONAL" hint="JPG, PNG, WebP — máx. 10 MB">
              <label
                className="flex items-center gap-3 px-4 py-3 border cursor-pointer transition-colors hover:border-[#555]"
                style={{ borderColor: '#2a2a2a' }}
              >
                <span className="text-[11px] tracking-widest" style={{ ...MONO, color: '#555' }}>
                  {form.foto ? form.foto.name : '+ ESCOLHER ARQUIVO'}
                </span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (f && f.size <= 10 * 1024 * 1024) set('foto', f)
                    else if (f) setErro('FOTO: máximo 10 MB.')
                  }}
                />
              </label>
            </Campo>
          </div>

          {/* Erro */}
          {erro && (
            <p className="text-[11px] px-3 py-2 border" style={{ ...MONO, color: '#ef4444', borderColor: '#ef444430' }}>
              {erro}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={enviando}
            className="w-full py-4 text-sm font-bold tracking-widest transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ ...MONO, backgroundColor: '#e8b84b', color: '#0a0a0a' }}
          >
            {enviando ? 'ENVIANDO…' : '+ PUBLICAR TESTEMUNHO'}
          </button>

          <p className="text-center text-[10px]" style={{ ...MONO, color: '#333' }}>
            REVISADO PELOS ZELADORES ANTES DE PUBLICAR
          </p>
        </form>
      </div>
    </>
  )
}
