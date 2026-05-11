import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import SectionHeader from '@/components/layout/Header'

export default function Favoritos() {
  return (
    <>
      <Helmet><title>Favoritos — evangeliza.me</title></Helmet>
      <SectionHeader title="Favoritos" />
      <div style={{ padding: '60px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>♡</div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
          Em breve
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-dim)', marginBottom: 24 }}>
          Os testemunhos que você marcar aparecerão aqui.
        </p>
        <Link to="/" style={{ color: 'var(--accent)', fontFamily: 'var(--font-sans)', fontSize: 14, textDecoration: 'none' }}>
          ← Voltar ao feed
        </Link>
      </div>
    </>
  )
}
