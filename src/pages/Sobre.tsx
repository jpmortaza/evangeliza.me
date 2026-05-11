import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const MONO: React.CSSProperties = { fontFamily: '"Geist Mono", monospace' }

export default function Sobre() {
  const WHATSAPP = import.meta.env.VITE_WHATSAPP_GROUP_LINK

  return (
    <>
      <Helmet>
        <title>Sobre — evangeliza.me</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] tracking-widest mb-3" style={{ ...MONO, color: '#555' }}>
            SOBRE · /SOBRE
          </p>
          <h1 className="text-4xl font-bold text-white">evangeliza.me</h1>
        </div>

        {/* Manifesto */}
        <div className="border-t py-8 space-y-5" style={{ borderColor: '#2a2a2a' }}>
          <p className="text-base leading-relaxed" style={{ color: '#aaa' }}>
            <span className="text-white font-bold">A Bíblia é o registro de como Deus agiu no passado.</span>{' '}
            O evangeliza.me é o registro de como Ele age hoje.
          </p>
          <p className="text-base leading-relaxed" style={{ color: '#888' }}>
            Este é um presente nosso para Deus — uma tentativa de mostrar, em tempo real, que Ele não é
            uma figura histórica. Ele está aqui, agindo nas vidas de pessoas comuns, todos os dias.
          </p>
          <p className="text-base leading-relaxed" style={{ color: '#888' }}>
            Qualquer pessoa pode compartilhar seu testemunho. Sem cadastro. Sem julgamento.
            Anônimo ou identificado — você escolhe.
          </p>
        </div>

        {/* Zeladores */}
        <div className="border-t py-8" style={{ borderColor: '#2a2a2a' }}>
          <p className="text-[10px] tracking-widest mb-4" style={{ ...MONO, color: '#e8b84b' }}>
            OS ZELADORES
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: '#888' }}>
            Todo testemunho é revisado pelos Zeladores — voluntários inspirados em Ezequiel 33, que guardam
            a comunidade com cuidado. Eles não censuram fé: apenas garantem que o conteúdo seja genuíno e
            respeitoso.
          </p>
          {WHATSAPP && (
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-widest transition-colors hover:text-white"
              style={{ ...MONO, color: '#555' }}
            >
              + TORNAR-SE ZELADOR →
            </a>
          )}
        </div>

        {/* Open source */}
        <div className="border-t py-8" style={{ borderColor: '#2a2a2a' }}>
          <p className="text-[10px] tracking-widest mb-4" style={{ ...MONO, color: '#555' }}>
            CÓDIGO ABERTO
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: '#888' }}>
            O evangeliza.me é open source. Quem quiser contribuir com código, design ou oração, é bem-vindo.
          </p>
          <a
            href="https://github.com/jpmortaza/evangeliza.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-widest border px-4 py-2 inline-block transition-colors hover:border-[#555]"
            style={{ ...MONO, color: '#555', borderColor: '#2a2a2a' }}
          >
            VER NO GITHUB →
          </a>
        </div>

        {/* CTA */}
        <div className="border-t pt-8" style={{ borderColor: '#2a2a2a' }}>
          <div className="border p-8 text-center" style={{ borderColor: '#2a2a2a' }}>
            <p className="text-[10px] tracking-widest mb-3" style={{ ...MONO, color: '#555' }}>
              VOCÊ TEM UM TESTEMUNHO?
            </p>
            <Link
              to="/compartilhar"
              className="inline-block text-sm font-bold px-6 py-3 tracking-widest transition-opacity hover:opacity-80"
              style={{ ...MONO, backgroundColor: '#e8b84b', color: '#0a0a0a' }}
            >
              + COMPARTILHAR AGORA
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
