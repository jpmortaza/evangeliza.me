import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { supabase } from '@/lib/supabase'
import { type Testemunho, CATEGORIAS } from '@/types'
import { formatarDataRelativa, getDisplayId } from '@/lib/utils'

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

/* ── Mini chart SVG ────────────────────────────── */
function ChartMensal() {
  const vals = [28, 52, 71, 95, 143, 118]
  const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
  const W = 260, H = 90, pad = 8
  const max = Math.max(...vals)
  const pts = vals.map((v, i) => ({ x: pad + (i / (vals.length - 1)) * (W - pad * 2), y: H - pad - ((v / max) * (H - pad * 2)) }))
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const area = `${d} L${pts[pts.length - 1].x},${H} L${pts[0].x},${H} Z`
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--text)', margin: '0 0 12px' }}>Testemunhos por mês</p>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible', width: '100%' }}>
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#chart-fill)" />
        <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="var(--accent)" />
        ))}
        {labels.map((l, i) => (
          <text key={l} x={pts[i].x} y={H + 2} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--text-mute)">{l}</text>
        ))}
      </svg>
    </div>
  )
}

const PAISES = [
  { name: 'Brasil', count: '1.02k' },
  { name: 'Portugal', count: '68' },
  { name: 'EUA', count: '41' },
  { name: 'Angola', count: '29' },
  { name: 'Moçambique', count: '18' },
]

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

  const { data: counts } = useQuery({
    queryKey: ['admin-counts'],
    queryFn: async () => {
      const [{ count: ap }, { count: pe }, { count: re }] = await Promise.all([
        supabase.from('testemunhos').select('id', { count: 'exact', head: true }).eq('status', 'aprovado'),
        supabase.from('testemunhos').select('id', { count: 'exact', head: true }).eq('status', 'pendente'),
        supabase.from('testemunhos').select('id', { count: 'exact', head: true }).eq('status', 'rejeitado'),
      ])
      return { aprovados: ap ?? 0, pendentes: pe ?? 0, rejeitados: re ?? 0, total: (ap ?? 0) + (pe ?? 0) + (re ?? 0) }
    },
    enabled: ehZelador === true,
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
      qc.invalidateQueries({ queryKey: ['admin-counts'] })
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
        >SAIR</button>
      </div>
    )
  }

  const statCards = [
    { label: 'Testemunhos', value: counts?.total ?? '—', icon: '✦', color: 'var(--accent)' },
    { label: 'Aprovados', value: counts?.aprovados ?? '—', icon: '✓', color: 'var(--green)' },
    { label: 'Pendentes', value: counts?.pendentes ?? '—', icon: '◷', color: 'var(--amber)' },
    { label: 'Rejeitados', value: counts?.rejeitados ?? '—', icon: '✕', color: 'var(--red)' },
  ]

  return (
    <>
      <Helmet><title>Painel Administrativo — evangeliza.me</title></Helmet>

      {/* Top nav */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'oklch(0.07 0.022 265 / 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 clamp(16px,3vw,32px)',
        display: 'flex', alignItems: 'center', gap: 24, height: 56,
      }}>
        <a href="/" style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: 'var(--text)', textDecoration: 'none' }}>
          evangeliza<span style={{ color: 'var(--accent)' }}>.me</span>
        </a>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mute)' }}>{sessao.email}</span>
        <button
          onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
          style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', ...MONO, fontSize: 11, color: 'var(--text-mute)', padding: '5px 12px', letterSpacing: 0.5, transition: 'color 0.15s, border-color 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--text-dim)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-mute)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}
        >SAIR</button>
      </div>

      <div style={{ padding: 'clamp(16px,3vw,32px)', maxWidth: 1200, margin: '0 auto' }}>
        {/* Page title */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}>Painel Administrativo</h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-dim)', margin: 0 }}>Gerencie testemunhos e acompanhe o impacto.</p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          {statCards.map(s => (
            <div key={s.label} style={{
              background: 'var(--bg-elev)', borderRadius: 12,
              border: '1px solid var(--border)',
              padding: '20px 20px 16px',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--text)', margin: '0 0 2px', letterSpacing: -0.5 }}>
                  {s.value}
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-dim)', margin: 0 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 2-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>

          {/* Left: Moderation queue */}
          <div style={{ background: 'var(--bg-elev)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            {/* Queue header + tabs */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 0 }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0, flex: 1 }}>Testemunhos recentes</p>
              <div style={{ display: 'flex', gap: 0 }}>
                {([
                  { k: 'pendentes' as Aba, label: 'Pendentes' },
                  { k: 'aprovados' as Aba, label: 'Aprovados' },
                  { k: 'denunciados' as Aba, label: 'Rejeitados' },
                ]).map(({ k, label }) => {
                  const active = aba === k
                  return (
                    <button
                      key={k}
                      onClick={() => setAba(k)}
                      style={{
                        background: active ? 'var(--accent-glow)' : 'transparent',
                        border: 'none', borderRadius: 6,
                        cursor: 'pointer', padding: '5px 10px',
                        fontFamily: 'var(--font-sans)', fontSize: 12,
                        color: active ? 'var(--accent)' : 'var(--text-mute)',
                        fontWeight: active ? 700 : 400,
                        transition: 'color 0.15s, background 0.15s',
                      }}
                    >{label}</button>
                  )
                })}
              </div>
            </div>

            {isLoading && <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-mute)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>CARREGANDO…</div>}

            {!isLoading && itens.length === 0 && (
              <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text)', marginBottom: 6 }}>Fila vazia.</p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-mute)' }}>Próximos testemunhos aparecem aqui.</p>
              </div>
            )}

            <div>
              {itens.map(t => (
                <ItemTestemunho
                  key={t.id}
                  t={t}
                  onAprovar={() => moderar.mutate({ id: t.id, status: 'aprovado' })}
                  onRejeitar={m => moderar.mutate({ id: t.id, status: 'rejeitado', motivo: m })}
                />
              ))}
            </div>
          </div>

          {/* Right: Chart + Países */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'var(--bg-elev)', borderRadius: 12, border: '1px solid var(--border)', padding: 20 }}>
              <ChartMensal />
            </div>
            <div style={{ background: 'var(--bg-elev)', borderRadius: 12, border: '1px solid var(--border)', padding: 20 }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--text)', margin: '0 0 14px' }}>Países</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PAISES.map(p => (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)' }}>{p.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>{p.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
