import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import SectionHeader from '@/components/layout/Header'

export default function Perfil() {
  return (
    <>
      <Helmet><title>Perfil — evangeliza.me</title></Helmet>
      <SectionHeader title="Perfil" />
      <div style={{ padding: '60px 16px', textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--accent-glow)', border: '2px solid var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: 32, color: 'var(--accent)',
        }}>+</div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
          Em breve
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-dim)', marginBottom: 24 }}>
          Cadastro e perfil serão lançados em breve.
        </p>
        <Link to="/feed" style={{ color: 'var(--accent)', fontFamily: 'var(--font-sans)', fontSize: 14, textDecoration: 'none' }}>
          ← Voltar ao feed
        </Link>
      </div>
    </>
  )
}
