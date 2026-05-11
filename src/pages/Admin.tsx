import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '@/lib/supabase'
import { type Testemunho, CATEGORIAS } from '@/types'
import { formatarDataRelativa, getDisplayId } from '@/lib/utils'

const MONO: React.CSSProperties = { fontFamily: '"Geist Mono", monospace' }

type Aba = 'pendentes' | 'aprovados' | 'denunciados'

async function verificarZelador(email: string): Promise<boolean> {
  const { data } = await supabase
    .from('zeladores').select('id').eq('email', email).eq('ativo', true).maybeSingle()
  return !!data
}

async function buscarTestemunhos(status: string): Promise<Testemunho[]> {
  const { data, error } = await supabase
    .from('testemunhos').select('*, midias(*)').eq('status', status)
    .order('criado_em', { ascending: true })
  if (error) throw error
  return data as Testemunho[]
}

/* ── Login ───────────────────────────────────── */
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault(); setErro(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) setErro('CREDENCIAIS INVÁLIDAS')
    else onLogin()
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'transparent', border: '1px solid #2a2a2a',
    color: '#fff', padding: '12px 14px', fontSize: '14px', fontFamily: '"Geist", sans-serif',
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="w-full max-w-sm border p-8" style={{ borderColor: '#2a2a2a' }}>
        <div className="mb-8">
          <p className="text-[10px] tracking-widest mb-3" style={{ ...MONO, color: '#555' }}>PAINEL · /ADMIN</p>
          <h1 className="text-2xl font-bold text-white">Zeladores</h1>
          <p className="text-sm mt-1" style={{ color: '#555' }}>Acesso restrito</p>
        </div>
        <form onSubmit={entrar} className="space-y-3">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="email" style={inputStyle} required />
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
            placeholder="senha" style={inputStyle} required />
          {erro && <p className="text-[11px]" style={{ ...MONO, color: '#ef4444' }}>{erro}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 text-sm font-bold tracking-widest disabled:opacity-40"
            style={{ ...MONO, backgroundColor: '#e8b84b', color: '#0a0a0a' }}>
            {loading ? 'ENTRANDO…' : '+ ENTRAR'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ── Item de testemunho ──────────────────────── */
function ItemTestemunho({ t, onAprovar, onRejeitar }: {
  t: Testemunho
  onAprovar: () => void
  onRejeitar: (m: string) => void
}) {
  const [rejMode, setRejMode] = useState(false)
  const [motivo, setMotivo] = useState('')
  const displayId = getDisplayId(t.criado_em, t.id)
  const autor = t.eh_anonimo ? 'ANÔNIMO' : (t.nome_anonimo ?? 'ANÔNIMO').toUpperCase()
  const cat = t.categoria ? CATEGORIAS[t.categoria].toUpperCase() : null
  const tempo = formatarDataRelativa(t.criado_em).toUpperCase()

  return (
    <article className="border-t py-5" style={{ borderColor: '#2a2a2a' }}>
      {/* Meta */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-[11px]" style={{ ...MONO, color: '#e8b84b' }}>{displayId}</span>
        {cat && (
          <>
            <span style={{ color: '#333' }}>·</span>
            <span className="text-[10px] px-1.5 py-px border" style={{ ...MONO, color: '#888', borderColor: '#2a2a2a' }}>
              {cat}
            </span>
          </>
        )}
        <span style={{ color: '#333' }}>·</span>
        <span className="text-[10px]" style={{ ...MONO, color: '#444' }}>{tempo}</span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-2">{t.titulo}</h3>

      {/* Content */}
      <p className="text-sm leading-relaxed mb-3 whitespace-pre-line" style={{ color: '#888' }}>
        {t.conteudo}
      </p>

      {/* Author */}
      <p className="text-[10px] mb-4" style={{ ...MONO, color: '#444' }}>{autor}</p>

      {/* Actions */}
      {!rejMode ? (
        <div className="flex items-center gap-3">
          <button
            onClick={onAprovar}
            className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold tracking-widest transition-opacity hover:opacity-80"
            style={{ ...MONO, backgroundColor: '#e8b84b', color: '#0a0a0a' }}
          >
            + APROVAR
          </button>
          <button
            onClick={() => setRejMode(true)}
            className="px-4 py-2 text-[11px] border tracking-widest transition-colors hover:border-[#555]"
            style={{ ...MONO, color: '#888', borderColor: '#2a2a2a' }}
          >
            REJEITAR
          </button>
          <button
            className="text-[10px] tracking-widest transition-colors hover:text-white"
            style={{ ...MONO, color: '#333' }}
          >
            MARCAR P/ REVISÃO
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            placeholder="Motivo da rejeição (opcional)"
            rows={2}
            className="w-full px-3 py-2 text-sm border"
            style={{ background: 'transparent', borderColor: '#2a2a2a', color: '#fff', fontFamily: '"Geist", sans-serif' }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => onRejeitar(motivo)}
              className="px-4 py-2 text-[11px] font-bold"
              style={{ ...MONO, backgroundColor: '#ef4444', color: '#fff' }}
            >
              CONFIRMAR REJEIÇÃO
            </button>
            <button
              onClick={() => { setRejMode(false); setMotivo('') }}
              className="px-4 py-2 text-[11px]"
              style={{ ...MONO, color: '#555' }}
            >
              CANCELAR
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

/* ── Página Admin ────────────────────────────── */
export default function Admin() {
  const [sessao, setSessao] = useState<{ email: string } | null>(null)
  const [ehZelador, setEhZelador] = useState<boolean | null>(null)
  const [verificando, setVerificando] = useState(true)
  const [aba, setAba] = useState<Aba>('pendentes')
  const qc = useQueryClient()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user
      if (!user?.email) { setVerificando(false); return }
      setSessao({ email: user.email })
      setEhZelador(await verificarZelador(user.email))
      setVerificando(false)
    })
  }, [])

  const statusMap: Record<Aba, string> = {
    pendentes: 'pendente', aprovados: 'aprovado', denunciados: 'rejeitado',
  }

  const { data: itens = [], isLoading } = useQuery({
    queryKey: ['admin-testemunhos', aba],
    queryFn: () => buscarTestemunhos(statusMap[aba]),
    enabled: ehZelador === true,
    refetchInterval: 30_000,
  })

  const moderar = useMutation({
    mutationFn: async ({ id, status, motivo }: { id: string; status: string; motivo?: string }) => {
      const { error } = await supabase.from('testemunhos').update({
        status,
        motivo_rejeicao: motivo ?? null,
        aprovado_em: status === 'aprovado' ? new Date().toISOString() : null,
      }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-testemunhos'] })
      qc.invalidateQueries({ queryKey: ['testemunhos'] })
    },
  })

  if (verificando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <p className="text-[11px] tracking-widest" style={{ ...MONO, color: '#333' }}>VERIFICANDO ACESSO…</p>
      </div>
    )
  }

  if (!sessao) return <LoginForm onLogin={() => window.location.reload()} />

  if (ehZelador === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ backgroundColor: '#0a0a0a' }}>
        <span className="text-4xl mb-4" style={{ color: '#333' }}>+</span>
        <p className="text-[10px] tracking-widest mb-3" style={{ ...MONO, color: '#555' }}>ACESSO NEGADO</p>
        <p className="text-sm mb-6" style={{ color: '#555' }}>{sessao.email}</p>
        <button
          onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
          className="text-[11px] tracking-widest" style={{ ...MONO, color: '#444' }}
        >
          SAIR
        </button>
      </div>
    )
  }

  return (
    <>
      <Helmet><title>Admin — evangeliza.me</title></Helmet>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] tracking-widest mb-3" style={{ ...MONO, color: '#555' }}>PAINEL · /ADMIN</p>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <h1 className="text-4xl font-bold text-white">Moderação</h1>
            <div className="flex items-center gap-4">
              <span className="text-[10px] tracking-widest" style={{ ...MONO, color: '#555' }}>
                LOGADO COMO · {sessao.email.toUpperCase()}
              </span>
              <button
                onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
                className="text-[10px] tracking-widest transition-colors hover:text-white"
                style={{ ...MONO, color: '#333' }}
              >
                SAIR
              </button>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border mb-8" style={{ borderColor: '#2a2a2a' }}>
          {[
            { label: 'FILA', value: aba === 'pendentes' ? String(itens.length) : '—' },
            { label: 'APROVADOS HOJE', value: '—' },
            { label: 'REJEITADOS HOJE', value: '—' },
            { label: 'TEMPO MÉDIO', value: '—' },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="p-4 border-r border-b sm:border-b-0 last:border-r-0"
              style={{ borderColor: '#2a2a2a' }}
            >
              <p className="text-[10px] mb-2 tracking-widest" style={{ ...MONO, color: '#444' }}>{label}</p>
              <p className="text-3xl sm:text-4xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6" style={{ borderColor: '#2a2a2a' }}>
          {(['pendentes', 'aprovados', 'denunciados'] as Aba[]).map(a => (
            <button
              key={a}
              onClick={() => setAba(a)}
              className="px-4 py-3 text-[11px] tracking-widest border-b-2 transition-colors"
              style={{
                ...MONO,
                color: aba === a ? '#fff' : '#444',
                borderBottomColor: aba === a ? '#e8b84b' : 'transparent',
              }}
            >
              {a.toUpperCase()}
              {a === 'pendentes' && aba === 'pendentes' && itens.length > 0 && (
                <span className="ml-2" style={{ color: '#e8b84b' }}>· {itens.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading && (
          <div className="py-10 text-center">
            <p className="text-[11px] tracking-widest" style={{ ...MONO, color: '#333' }}>CARREGANDO…</p>
          </div>
        )}

        {!isLoading && itens.length === 0 && (
          <div className="py-20 text-center">
            <span className="text-4xl" style={{ color: '#e8b84b' }}>+</span>
            <p className="mt-4 text-[11px] tracking-widest" style={{ ...MONO, color: '#555' }}>
              NENHUM REGISTRO · TUDO EM DIA
            </p>
          </div>
        )}

        {itens.map(t => (
          <ItemTestemunho
            key={t.id}
            t={t}
            onAprovar={() => moderar.mutate({ id: t.id, status: 'aprovado' })}
            onRejeitar={(m) => moderar.mutate({ id: t.id, status: 'rejeitado', motivo: m })}
          />
        ))}
      </div>
    </>
  )
}
