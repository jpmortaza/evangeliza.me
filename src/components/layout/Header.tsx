import type { ReactNode } from 'react'

/** Header por seção — estilo X/Twitter (sticky dentro da coluna do feed) */
export default function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      background: 'rgba(245,247,255,0.9)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      padding: '12px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-dim)', margin: '2px 0 0' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}
