import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import SectionHeader from '@/components/layout/Header'

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)' }

export default function Sobre() {
  const WHATSAPP = import.meta.env.VITE_WHATSAPP_GROUP_LINK

  return (
    <>
      <Helmet><title>Sobre — evangeliza.me</title></Helmet>
      <SectionHeader title="Sobre" subtitle="evangeliza.me" />

      <div style={{ padding: '20px 16px 80px' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 17, lineHeight: 1.55, color: 'var(--text)', marginBottom: 16 }}>
          <strong>A Bíblia é o registro de como Deus agiu no passado.</strong>{' '}
          O evangeliza.me é o registro de como Ele age hoje.
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.6, color: 'var(--text-dim)', marginBottom: 12 }}>
          Este é um presente nosso para Deus — uma tentativa de mostrar, em tempo real, que Ele não é uma figura histórica. Ele está aqui, agindo nas vidas de pessoas comuns, todos os dias.
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.6, color: 'var(--text-dim)', marginBottom: 32 }}>
          Qualquer pessoa pode compartilhar seu testemunho. Sem cadastro. Sem julgamento. Anônimo ou identificado — você escolhe.
        </p>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, marginBottom: 24 }}>
          <p style={{ ...MONO, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10 }}>Os Zeladores</p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.6, color: 'var(--text-dim)', marginBottom: 12 }}>
            Todo testemunho é revisado pelos Zeladores — voluntários inspirados em Ezequiel 33, que guardam a comunidade com cuidado. Eles não censuram fé: apenas garantem que o conteúdo seja genuíno e respeitoso.
          </p>
          {WHATSAPP && (
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              Quero ser Zelador →
            </a>
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, marginBottom: 32 }}>
          <p style={{ ...MONO, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: 10 }}>Código aberto</p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.6, color: 'var(--text-dim)', marginBottom: 12 }}>
            O evangeliza.me é open source. Quem quiser contribuir com código, design ou oração, é bem-vindo.
          </p>
          <a href="https://github.com/jpmortaza/evangeliza.me" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
            Ver no GitHub →
          </a>
        </div>

        <Link
          to="/compartilhar"
          style={{ display: 'inline-block', padding: '12px 24px', borderRadius: 9999, background: 'var(--accent)', color: '#000', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}
        >
          Compartilhar testemunho
        </Link>
      </div>
    </>
  )
}
