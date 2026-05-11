import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', justifyContent: 'center' }}>
      {/* Sidebar — desktop only */}
      <aside
        className="hidden sm:flex"
        style={{
          width: 'var(--sidebar-w)',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          flexDirection: 'column',
          borderRight: '1px solid var(--border)',
        }}
      >
        <Sidebar />
      </aside>

      {/* Main feed column */}
      <main
        style={{
          flex: 1,
          maxWidth: 'var(--feed-max)',
          borderRight: '1px solid var(--border)',
          minHeight: '100vh',
          paddingBottom: 80,
        }}
      >
        <Outlet />
      </main>

      {/* Right column spacer — desktop only (optional future use) */}
      <div className="hidden lg:block" style={{ width: 350, flexShrink: 0 }} />

      {/* Bottom nav — mobile only */}
      <BottomNav />
    </div>
  )
}
