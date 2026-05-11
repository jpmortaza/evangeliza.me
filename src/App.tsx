import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Feed from '@/pages/Feed'
import NovoTestemunho from '@/pages/NovoTestemunho'
import TestemunhoPage from '@/pages/TestemunhoPage'
import Admin from '@/pages/Admin'
import Sobre from '@/pages/Sobre'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Feed />} />
        <Route path="/testemunho/:id" element={<TestemunhoPage />} />
        <Route path="/compartilhar" element={<NovoTestemunho />} />
        <Route path="/sobre" element={<Sobre />} />
      </Route>
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
