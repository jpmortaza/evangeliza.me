import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { CheckCircle, XCircle, LogIn, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { type Testemunho } from '@/types'
import { formatarDataRelativa } from '@/lib/utils'

async function verificarZelador(email: string): Promise<boolean> {
  const { data } = await supabase
    .from('zeladores')
    .select('id')
    .eq('email', email)
    .eq('ativo', true)
    .maybeSingle()
  return !!data
}

async function buscarPendentes(): Promise<Testemunho[]> {
  const { data, error } = await supabase
    .from('testemunhos')
    .select('*, midias(*)')
    .eq('status', 'pendente')
    .order('criado_em', { ascending: true })

  if (error) throw error
  return data as Testemunho[]
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) setErro('Email ou senha inválidos.')
    else onLogin()
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <Shield className="w-10 h-10 mx-auto mb-3" style={{ color: '#1E3A5F' }} />
          <h1 className="text-xl font-bold text-gray-900">Painel dos Zeladores</h1>
          <p className="text-sm text-gray-500 mt-1">Acesso restrito</p>
        </div>

        <form onSubmit={entrar} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
            required
          />
          <input
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            placeholder="Senha"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
            required
          />
          {erro && <p className="text-sm text-red-500">{erro}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#1E3A5F' }}
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

function CartaoTestemunho({
  t,
  onAprovar,
  onRejeitar,
}: {
  t: Testemunho
  onAprovar: () => void
  onRejeitar: (motivo: string) => void
}) {
  const [rejeitando, setRejeitando] = useState(false)
  const [motivo, setMotivo] = useState('')

  const autor = t.eh_anonimo ? 'Anônimo' : (t.nome_anonimo ?? 'Anônimo')

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 leading-snug">{t.titulo}</h3>
          <p className="text-xs text-gray-400 mt-1">
            {autor} · {formatarDataRelativa(t.criado_em)}
            {t.categoria && ` · ${t.categoria}`}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-5 whitespace-pre-line">
        {t.conteudo}
      </p>

      {t.midias && t.midias.length > 0 && (
        <div className="mb-4 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
          Tem mídia: {t.midias.map(m => m.tipo).join(', ')}
        </div>
      )}

      {!rejeitando ? (
        <div className="flex items-center gap-3">
          <button
            onClick={onAprovar}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: '#1E3A5F' }}
          >
            <CheckCircle className="w-4 h-4" />
            Aprovar
          </button>
          <button
            onClick={() => setRejeitando(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Rejeitar
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            placeholder="Motivo da rejeição (opcional, vai para o arquivo)"
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-300"
          />
          <div className="flex gap-2">
            <button
              onClick={() => onRejeitar(motivo)}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
            >
              Confirmar rejeição
            </button>
            <button
              onClick={() => { setRejeitando(false); setMotivo('') }}
              className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Admin() {
  const [sessao, setSessao] = useState<{ email: string } | null>(null)
  const [ehZelador, setEhZelador] = useState<boolean | null>(null)
  const [verificando, setVerificando] = useState(true)
  const qc = useQueryClient()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user
      if (!user?.email) { setVerificando(false); return }
      setSessao({ email: user.email })
      const ok = await verificarZelador(user.email)
      setEhZelador(ok)
      setVerificando(false)
    })
  }, [])

  const { data: pendentes = [], isLoading } = useQuery({
    queryKey: ['pendentes'],
    queryFn: buscarPendentes,
    enabled: ehZelador === true,
    refetchInterval: 30_000,
  })

  const moderar = useMutation({
    mutationFn: async ({ id, status, motivo }: { id: string; status: string; motivo?: string }) => {
      const { error } = await supabase
        .from('testemunhos')
        .update({ status, motivo_rejeicao: motivo ?? null, aprovado_em: status === 'aprovado' ? new Date().toISOString() : null })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pendentes'] }),
  })

  if (verificando) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Verificando acesso...</div>
  }

  if (!sessao) {
    return <LoginForm onLogin={() => window.location.reload()} />
  }

  if (ehZelador === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <Shield className="w-12 h-12 mb-4 text-gray-300" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Acesso restrito</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          {sessao.email} não está na lista de Zeladores. Entre em contato com o administrador.
        </p>
        <button
          onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
          className="mt-6 text-sm text-gray-400 hover:text-gray-600"
        >
          Sair
        </button>
      </div>
    )
  }

  return (
    <>
      <Helmet><title>Zeladores — evangeliza.me</title></Helmet>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-6 h-6" style={{ color: '#1E3A5F' }} />
              Painel dos Zeladores
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {sessao.email} · {pendentes.length} aguardando revisão
            </p>
          </div>
          <button
            onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Sair
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-10 text-gray-400">Carregando...</div>
        )}

        {!isLoading && pendentes.length === 0 && (
          <div className="text-center py-20">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <p className="text-gray-600 font-medium">Tudo em dia! Nenhum testemunho aguardando revisão.</p>
          </div>
        )}

        <div className="space-y-4">
          {pendentes.map(t => (
            <CartaoTestemunho
              key={t.id}
              t={t}
              onAprovar={() => moderar.mutate({ id: t.id, status: 'aprovado' })}
              onRejeitar={(motivo) => moderar.mutate({ id: t.id, status: 'rejeitado', motivo })}
            />
          ))}
        </div>
      </div>
    </>
  )
}
