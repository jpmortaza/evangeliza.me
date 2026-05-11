/** Header por seção — estilo X/Twitter (sticky dentro da coluna do feed) */
export default function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '14px 16px',
    }}>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-dim)', margin: '2px 0 0' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
