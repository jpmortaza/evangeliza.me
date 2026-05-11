import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '@/lib/supabase'
import { type Testemunho, CATEGORIAS } from '@/types'
import { formatarDataRelativa, getDisplayId } from '@/lib/utils'
import SectionHeader from '@/components/layout/Header'

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)' }

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

  const inp: React.CSSProperties = {
    width: '100%', background: 'transparent', border: '1px solid var(--border)',
    color: 'var(--text)', padding: '12px 14px', fontSize: 14, fontFamily: 'var(--font-sans)',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
      <div style={{ width: '100%', maxWidth: 360, border: '1px solid var(--border)', padding: 32 }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ ...MONO, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase' as const, color: 'var(--text-mute)', marginBottom: 12 }}>PAINEL · /ADMIN</p>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 500, color: 'var(--text)', margin: 0 }}>Zeladores</h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-mute)', marginTop: 4 }}>Acesso restrito</p>
        </div>
        <form onSubmit={entrar} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email" style={inp} required />
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="senha" style={inp} required />
          {erro && <p style={{ ...MONO, fontSize: 11, color: '#ef4444' }}>{erro}</p>}
          <button type="submit" disabled={loading}
            style={{ padding: '12px 0', ...MONO, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, background: 'var(--accent)', color: 'var(--bg-page)', border: 'none', cursor: 'pointer', opacity: loading ? 0.4 : 1 }}>
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
  const autor = t.eh_anonimo ? 'Anônimo' : (t.nome_anonimo ?? 'Anônimo')
  const cat = t.categoria ? CATEGORIAS[t.categoria].toUpperCase() : null
  const tempo = formatarDataRelativa(t.criado_em).toUpperCase()

  return (
    <div style={{
      display: 'grid', gap: 16, gridTemplateColumns: '1fr auto',
      padding: '24px 0', borderBottom: '1px solid var(--border-soft)',
    }}>
      <div>
        {/* Meta */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' as const }}>
          <span style={{ ...MONO, fontSize: 11, letterSpacing: 0.4, color: 'var(--accent)' }}>{displayId}</span>
          {cat && (
            <span style={{ ...MONO, fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase' as const, padding: '2px 6px', border: '1px solid var(--border)', color: 'var(--text-dim)' }}>
              {cat}
            </span>
          )}
          <span style={{ ...MONO, fontSize: 10, color: 'var(--text-mute)', letterSpacing: 0.4, textTransform: 'uppercase' as const }}>{tempo}</span>
        </div>

        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 500, letterSpacing: -0.4, lineHeight: 1.2, margin: '0 0 8px', color: 'var(--text)' }}>
          {t.titulo}
        </h3>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.55, color: 'var(--text-dim)', margin: '0 0 10px', maxWidth: 640 }}>
          {t.conteudo}
        </p>
        <span style={{ ...MONO, fontSize: 10, color: 'var(--text-mute)', letterSpacing: 0.4, textTransform: 'uppercase' as const }}>
          {autor.toUpperCase()}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6, alignItems: 'flex-end', justifyContent: 'center' }}>
        {!rejMode ? (
          <>
            <button
              onClick={onAprovar}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'var(--accent)', color: 'var(--bg-page)', border: 'none', cursor: 'pointer', ...MONO, fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}
            >
              <svg width="9" height="9" viewBox="0 0 9 9"><rect x="3.8" y="0" width="1.4" height="9" fill="currentColor" /><rect x="0" y="3.8" width="9" height="1.4" fill="currentColor" /></svg>
              Aprovar
            </button>
            <button
              onClick={() => setRejMode(true)}
              style={{ padding: '7px 12px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-mute)', cursor: 'pointer', ...MONO, fontSize: 11, letterSpacing: 0.5 }}
            >
              Rejeitar
            </button>
            <button style={{ padding: '4px 6px', background: 'transparent', border: 'none', color: 'var(--text-mute)', cursor: 'pointer', ...MONO, fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase' as const }}>
              Marcar p/ revisão
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6, width: 200 }}>
            <textarea
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              placeholder="Motivo (opcional)"
              rows={2}
              style={{ width: '100%', padding: '8px 10px', fontSize: 13, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-sans)', resize: 'none' as const }}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => onRejeitar(motivo)}
                style={{ flex: 1, padding: '7px 10px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', ...MONO, fontSize: 11, fontWeight: 700 }}
              >
                CONFIRMAR
              </button>
              <button
                onClick={() => { setRejMode(false); setMotivo('') }}
                style={{ padding: '7px 10px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-mute)', cursor: 'pointer', ...MONO, fontSize: 11 }}
              >
                CANCELAR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ ...MONO, fontSize: 11, color: 'var(--text-mute)', letterSpacing: 0.6, textTransform: 'uppercase' as const }}>VERIFICANDO ACESSO…</p>
      </div>
    )
  }

  if (!sessao) return <LoginForm onLogin={() => window.location.reload()} />

  if (ehZelador === false) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 16px' }}>
        <p style={{ ...MONO, fontSize: 10, color: 'var(--text-mute)', letterSpacing: 0.6, marginBottom: 8 }}>ACESSO NEGADO</p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-dim)', marginBottom: 24 }}>{sessao.email}</p>
        <button
          onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', ...MONO, fontSize: 11, color: 'var(--text-mute)', letterSpacing: 0.5 }}
        >
          SAIR
        </button>
      </div>
    )
  }

  const stats = [
    { label: 'Fila',            value: aba === 'pendentes' ? String(itens.length) : '—', accent: aba === 'pendentes' && itens.length > 0 },
    { label: 'Aprovados hoje',  value: '—', accent: false },
    { label: 'Rejeitados hoje', value: '—', accent: false },
    { label: 'Tempo médio',     value: '—', accent: false },
  ]

  return (
    <>
      <Helmet><title>Admin — evangeliza.me</title></Helmet>

      <SectionHeader
        title="Moderação"
        subtitle={sessao.email}
        action={
          <button
            onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mute)', letterSpacing: 0.5, transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-mute)')}
          >
            SAIR
          </button>
        }
      />

      <div style={{ padding: '16px 16px 80px' }}>
        {/* Stats grid — gap:1 trick creates border lines */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1, background: 'var(--border-soft)',
          border: '1px solid var(--border-soft)', marginBottom: 24,
        }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: 'var(--bg)', padding: '18px 20px' }}>
              <p style={{ ...MONO, fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase' as const, color: 'var(--text-mute)', marginBottom: 6 }}>{s.label}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 500, color: s.accent ? 'var(--accent)' : 'var(--text)', letterSpacing: -0.5, fontVariantNumeric: 'tabular-nums' }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-soft)', marginBottom: 0 }}>
          {([
            { k: 'pendentes' as Aba, label: `Pendentes${aba === 'pendentes' && itens.length > 0 ? ` · ${itens.length}` : ''}` },
            { k: 'aprovados' as Aba, label: 'Aprovados' },
            { k: 'denunciados' as Aba, label: 'Denunciados · 0' },
          ]).map(({ k, label }) => {
            const active = aba === k
            return (
              <button
                key={k}
                onClick={() => setAba(k)}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: '12px 16px', ...MONO, fontSize: 11, letterSpacing: 0.5,
                  textTransform: 'uppercase' as const,
                  color: active ? 'var(--accent)' : 'var(--text-mute)',
                  borderBottom: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
                  marginBottom: -1, transition: 'color 0.15s',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        {isLoading && (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <p style={{ ...MONO, fontSize: 11, color: 'var(--text-mute)', letterSpacing: 0.6 }}>CARREGANDO…</p>
          </div>
        )}

        {!isLoading && itens.length === 0 && (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <svg width="28" height="35" viewBox="0 0 28 35" style={{ color: 'var(--accent)', filter: 'drop-shadow(0 0 8px var(--accent-glow-strong))', marginBottom: 14 }}>
              <rect x="12.3" y="0" width="3.4" height="35" fill="currentColor" />
              <rect x="0" y="11.2" width="28" height="3.4" fill="currentColor" />
            </svg>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 17, color: 'var(--text)', marginBottom: 6 }}>Fila vazia.</div>
            <p style={{ ...MONO, fontSize: 10, color: 'var(--text-mute)', letterSpacing: 0.5 }}>
              PRÓXIMO TESTEMUNHO APARECE AQUI ASSIM QUE CHEGAR
            </p>
          </div>
        )}

        {itens.map(t => (
          <ItemTestemunho
            key={t.id}
            t={t}
            onAprovar={() => moderar.mutate({ id: t.id, status: 'aprovado' })}
            onRejeitar={m => moderar.mutate({ id: t.id, status: 'rejeitado', motivo: m })}
          />
        ))}
      </div>
    </>
  )
}
