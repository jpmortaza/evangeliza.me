import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { type Testemunho } from '@/types'
import TestemunhoCard from '@/components/testemunhos/TestemunhoCard'

async function buscarTestemunhos(): Promise<Testemunho[]> {
  const { data, error } = await supabase
    .from('testemunhos')
    .select('*, usuarios(nome, slug, avatar_url), midias(*)')
    .eq('status', 'aprovado')
    .order('criado_em', { ascending: false })
    .limit(30)

  if (error) throw error
  return data as Testemunho[]
}

function Skeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-20 mb-3" />
      <div className="h-6 bg-gray-100 rounded w-3/4 mb-2" />
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-100 rounded" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-4/6" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-1/3" />
    </div>
  )
}

export default function Feed() {
  const { data: testemunhos, isLoading, error } = useQuery({
    queryKey: ['testemunhos'],
    queryFn: buscarTestemunhos,
  })

  return (
    <>
      <Helmet>
        <title>evangeliza.me — Deus não ficou no passado</title>
      </Helmet>

      {/* Hero */}
      <section className="text-white py-16 px-4" style={{ backgroundColor: '#1E3A5F' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "'Lora', serif" }}>
            Deus não ficou no passado.
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Leia como Ele age hoje — nas nossas vidas, nas nossas histórias.
          </p>
          <Link
            to="/compartilhar"
            className="inline-block font-semibold px-7 py-3 rounded-xl text-white text-base transition-colors"
            style={{ backgroundColor: '#C9933B' }}
          >
            Compartilhe seu testemunho
          </Link>
        </div>
      </section>

      {/* Feed */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-gray-500">Não foi possível carregar os testemunhos. Tente novamente.</p>
          </div>
        )}

        {testemunhos && testemunhos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🙏</p>
            <p className="text-xl font-medium text-gray-700 mb-2">Seja o primeiro a compartilhar</p>
            <p className="text-gray-500 mb-8">Ainda não há testemunhos publicados. Conte o que Deus fez na sua vida.</p>
            <Link
              to="/compartilhar"
              className="inline-block font-semibold px-6 py-3 rounded-xl text-white transition-colors"
              style={{ backgroundColor: '#1E3A5F' }}
            >
              Compartilhar agora
            </Link>
          </div>
        )}

        {testemunhos && testemunhos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {testemunhos.map(t => (
              <TestemunhoCard key={t.id} testemunho={t} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
