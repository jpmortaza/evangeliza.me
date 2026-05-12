import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Landing from '@/pages/Landing'
import Feed from '@/pages/Feed'
import NovoTestemunho from '@/pages/NovoTestemunho'
import TestemunhoPage from '@/pages/TestemunhoPage'
import Admin from '@/pages/Admin'
import Sobre from '@/pages/Sobre'
import Pesquisar from '@/pages/Pesquisar'
import Favoritos from '@/pages/Favoritos'
import Perfil from '@/pages/Perfil'
import PerfilPublico from '@/pages/PerfilPublico'
import { useAuth } from '@/contexts/AuthContext'

function AdminRoute() {
  const { isZelador, loading } = useAuth()
  if (loading) return null
  return isZelador ? <Admin /> : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Landing — full screen, sem sidebar */}
      <Route path="/bem-vindo" element={<Landing />} />

      {/* App — com sidebar + bottom nav */}
      <Route element={<Layout />}>
        <Route path="/" element={<Feed />} />
        <Route path="/feed" element={<Navigate to="/" replace />} />
        <Route path="/testemunho/:id" element={<TestemunhoPage />} />
        <Route path="/compartilhar" element={<NovoTestemunho />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/pesquisar" element={<Pesquisar />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/perfil/:slug" element={<PerfilPublico />} />
      </Route>

      {/* Admin — protegido, apenas zeladores */}
      <Route path="/admin" element={<AdminRoute />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
