import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Upload, X, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { extrairYoutubeId } from '@/lib/utils'
import { CATEGORIAS } from '@/types'

interface FormState {
  titulo: string
  conteudo: string
  nome: string
  anonimo: boolean
  categoria: string
  youtubeUrl: string
  foto: File | null
}

const inicial: FormState = {
  titulo: '',
  conteudo: '',
  nome: '',
  anonimo: false,
  categoria: '',
  youtubeUrl: '',
  foto: null,
}

export default function NovoTestemunho() {
  const [form, setForm] = useState<FormState>(inicial)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [erroYoutube, setErroYoutube] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (field: keyof FormState, value: string | boolean | File | null) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const validarYoutube = (url: string) => {
    if (!url) { setErroYoutube(false); return }
    setErroYoutube(!extrairYoutubeId(url))
  }

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setErro('A foto deve ter no máximo 10 MB.'); return }
    set('foto', file)
    set('youtubeUrl', '')
  }

  const removerMidia = () => {
    set('foto', null)
    set('youtubeUrl', '')
    if (fileRef.current) fileRef.current.value = ''
  }

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)

    if (form.titulo.trim().length < 5) { setErro('O título precisa ter pelo menos 5 caracteres.'); return }
    if (form.conteudo.trim().length < 50) { setErro('O testemunho precisa ter pelo menos 50 caracteres.'); return }
    if (form.youtubeUrl && erroYoutube) { setErro('URL do YouTube inválida.'); return }

    setEnviando(true)

    try {
      const payload = {
        titulo: form.titulo.trim(),
        conteudo: form.conteudo.trim(),
        nome_anonimo: form.anonimo ? null : (form.nome.trim() || null),
        eh_anonimo: form.anonimo || !form.nome.trim(),
        categoria: form.categoria || null,
        status: 'pendente',
      }

      const { data: testemunho, error: erroDB } = await supabase
        .from('testemunhos')
        .insert(payload)
        .select('id')
        .single()

      if (erroDB) throw new Error(erroDB.message)

      const testemunhoId = testemunho.id

      // Mídia: YouTube
      if (form.youtubeUrl) {
        const videoId = extrairYoutubeId(form.youtubeUrl)
        if (videoId) {
          await supabase.from('midias').insert({
            testemunho_id: testemunhoId,
            tipo: 'youtube',
            url: videoId,
            ordem: 0,
          })
        }
      }

      // Mídia: foto
      if (form.foto) {
        const ext = form.foto.name.split('.').pop() ?? 'jpg'
        const path = `imagens/${testemunhoId}/${crypto.randomUUID()}.${ext}`
        const { error: errUpload } = await supabase.storage
          .from('testemunhos-midia')
          .upload(path, form.foto)

        if (!errUpload) {
          const { data: urlData } = supabase.storage
            .from('testemunhos-midia')
            .getPublicUrl(path)

          await supabase.from('midias').insert({
            testemunho_id: testemunhoId,
            tipo: 'imagem',
            url: urlData.publicUrl,
            ordem: 0,
          })
        }
      }

      setEnviado(true)
      setForm(inicial)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao enviar. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <CheckCircle className="w-16 h-16 mx-auto mb-6" style={{ color: '#1E3A5F' }} />
        <h2 className="text-2xl font-bold mb-3 text-gray-900" style={{ fontFamily: "'Lora', serif" }}>
          Recebemos seu testemunho 🙏
        </h2>
        <p className="text-gray-600 mb-8">
          Ele será revisado pelos nossos Zeladores e publicado em breve.
          Obrigado por compartilhar como Deus agiu na sua vida.
        </p>
        <button
          onClick={() => setEnviado(false)}
          className="font-semibold px-6 py-3 rounded-xl text-white transition-colors"
          style={{ backgroundColor: '#C9933B' }}
        >
          Compartilhar outro testemunho
        </button>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Compartilhar testemunho — evangeliza.me</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Lora', serif" }}>
            Conte o que Deus fez na sua vida
          </h1>
          <p className="text-gray-500">
            Sem cadastro. Seu testemunho será revisado e publicado para inspirar outras pessoas.
          </p>
        </div>

        <form onSubmit={enviar} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">

          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Título <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.titulo}
              onChange={e => set('titulo', e.target.value)}
              placeholder="Ex: Deus curou minha mãe quando os médicos não tinham mais esperança"
              maxLength={150}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': '#1E3A5F' } as React.CSSProperties}
              onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #1E3A5F')}
              onBlur={e => (e.target.style.boxShadow = '')}
              required
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.titulo.length}/150</p>
          </div>

          {/* Conteúdo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Sua história <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.conteudo}
              onChange={e => set('conteudo', e.target.value)}
              placeholder="Escreva com suas próprias palavras. Não precisa ser perfeito — só precisa ser verdadeiro."
              rows={8}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm resize-y focus:outline-none"
              onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #1E3A5F')}
              onBlur={e => (e.target.style.boxShadow = '')}
              required
            />
            <p className="text-xs text-gray-400 mt-1">{form.conteudo.length} caracteres (mínimo 50)</p>
          </div>

          {/* Nome + Anônimo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Seu nome <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={e => set('nome', e.target.value)}
              placeholder="Deixe vazio para aparecer como Anônimo"
              disabled={form.anonimo}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm disabled:bg-gray-50 disabled:text-gray-400 focus:outline-none"
              onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #1E3A5F')}
              onBlur={e => (e.target.style.boxShadow = '')}
            />
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.anonimo}
                onChange={e => set('anonimo', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600">Quero postar como Anônimo</span>
            </label>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Categoria <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select
              value={form.categoria}
              onChange={e => set('categoria', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none"
              onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #1E3A5F')}
              onBlur={e => (e.target.style.boxShadow = '')}
            >
              <option value="">Selecionar categoria...</option>
              {Object.entries(CATEGORIAS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          {/* Mídia */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Mídia <span className="text-gray-400 font-normal">(opcional — foto ou vídeo do YouTube)</span>
            </label>

            {!form.foto && !form.youtubeUrl && (
              <div className="space-y-3">
                <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-gray-400 transition-colors">
                  <Upload className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-500">Escolher uma foto (JPG, PNG, WebP — máx 10 MB)</span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFoto}
                  />
                </label>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">ou</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <input
                  type="url"
                  value={form.youtubeUrl}
                  onChange={e => { set('youtubeUrl', e.target.value); validarYoutube(e.target.value) }}
                  placeholder="URL do YouTube (ex: https://youtu.be/...)"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none"
                  onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #1E3A5F')}
                  onBlur={e => (e.target.style.boxShadow = '')}
                />
                {erroYoutube && <p className="text-xs text-red-500">URL do YouTube inválida.</p>}
              </div>
            )}

            {(form.foto || form.youtubeUrl) && (
              <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
                <span className="text-sm text-gray-600 truncate">
                  {form.foto ? form.foto.name : form.youtubeUrl}
                </span>
                <button type="button" onClick={removerMidia} className="ml-2 text-gray-400 hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {erro && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full py-4 rounded-xl text-white font-semibold text-base transition-opacity disabled:opacity-60"
            style={{ backgroundColor: '#1E3A5F' }}
          >
            {enviando ? 'Enviando...' : 'Compartilhar meu testemunho 🙏'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Seu testemunho será revisado pelos Zeladores antes de ser publicado.
          </p>
        </form>
      </div>
    </>
  )
}
