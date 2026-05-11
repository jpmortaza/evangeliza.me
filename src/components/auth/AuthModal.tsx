import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Mode = 'entrar' | 'cadastrar' | 'confirmado'

interface Props {
  onClose: () => void
  defaultMode?: 'entrar' | 'cadastrar'
}

const inp: React.CSSProperties = {
  width: '100%',
  background: '#f8faff',
  border: '1.5px solid #e2e8f0',
  borderRadius: 10,
  color: '#0f172a',
  padding: '12px 14px',
  fontSize: 15,
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  transition: 'border-color 0.15s',
}

export default function AuthModal({ onClose, defaultMode = 'entrar' }: Props) {
  const [mode, setMode] = useState<Mode>(defaultMode)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) setErro('Email ou senha incorretos.')
    else onClose()
    setLoading(false)
  }

  const cadastrar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (nome.trim().length < 2) { setErro('Digite seu nome.'); return }
    if (senha.length < 6) { setErro('Senha mínima: 6 caracteres.'); return }
    setErro(''); setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome: nome.trim() } },
    })
    if (error) setErro(error.message)
    else setMode('confirmado')
    setLoading(false)
  }

  return (
    /* Overlay */
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15,23,42,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 24px 64px rgba(15,23,96,0.18)',
          width: '100%', maxWidth: 400,
          padding: 32,
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: '#f1f5f9', border: 'none', borderRadius: '50%',
            width: 32, height: 32, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: '#475569',
          }}
        >×</button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>✝</div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: '#475569', margin: 0 }}>evangeliza.me</p>
        </div>

        {/* Confirmado state */}
        {mode === 'confirmado' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📬</div>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
              Confirme seu email
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: '#475569', lineHeight: 1.55, margin: '0 0 24px' }}>
              Enviamos um link para <strong>{email}</strong>. Clique nele para ativar sua conta.
            </p>
            <button
              onClick={onClose}
              style={{
                width: '100%', padding: '12px 0', borderRadius: 10,
                background: 'linear-gradient(135deg, oklch(0.65 0.22 215), oklch(0.55 0.26 290))',
                color: '#fff', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700,
              }}
            >Entendido</button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', marginBottom: 24, background: '#f8faff', borderRadius: 10, padding: 4 }}>
              {(['entrar', 'cadastrar'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setErro('') }}
                  style={{
                    flex: 1, padding: '9px 0', borderRadius: 8, border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
                    background: mode === m ? '#fff' : 'transparent',
                    color: mode === m ? '#0f172a' : '#94a3b8',
                    boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {m === 'entrar' ? 'Entrar' : 'Criar conta'}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={mode === 'entrar' ? entrar : cadastrar} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mode === 'cadastrar' && (
                <input
                  type="text" value={nome} onChange={e => setNome(e.target.value)}
                  placeholder="Seu nome" required style={inp}
                  onFocus={e => (e.target.style.borderColor = 'oklch(0.55 0.26 290)')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                />
              )}
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email" required style={inp}
                onFocus={e => (e.target.style.borderColor = 'oklch(0.55 0.26 290)')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              />
              <input
                type="password" value={senha} onChange={e => setSenha(e.target.value)}
                placeholder={mode === 'cadastrar' ? 'Senha (mín. 6 caracteres)' : 'Senha'}
                required style={inp}
                onFocus={e => (e.target.style.borderColor = 'oklch(0.55 0.26 290)')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              />

              {erro && (
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#ef4444', margin: 0 }}>{erro}</p>
              )}

              <button
                type="submit" disabled={loading}
                style={{
                  padding: '13px 0', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, oklch(0.65 0.22 215), oklch(0.55 0.26 290))',
                  color: '#fff', cursor: loading ? 'default' : 'pointer',
                  fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700,
                  opacity: loading ? 0.6 : 1,
                  transition: 'opacity 0.15s',
                  marginTop: 4,
                }}
              >
                {loading ? 'Aguarde…' : mode === 'entrar' ? 'Entrar' : 'Criar conta'}
              </button>
            </form>

            {mode === 'entrar' && (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 16, margin: '16px 0 0' }}>
                Não tem conta?{' '}
                <button onClick={() => { setMode('cadastrar'); setErro('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'oklch(0.55 0.26 290)', fontWeight: 600, fontSize: 13, padding: 0, fontFamily: 'var(--font-sans)' }}>
                  Crie agora
                </button>
              </p>
            )}

            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
              Cadastro é opcional. Você pode postar testemunhos sem conta.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
