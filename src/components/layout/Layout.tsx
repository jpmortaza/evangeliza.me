import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <Header />
      {/* pt-12 = header height, pb-16 = bottom nav on mobile */}
      <main className="pt-12 pb-16 sm:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
