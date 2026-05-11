import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function Sobre() {
  const WHATSAPP = import.meta.env.VITE_WHATSAPP_GROUP_LINK

  return (
    <>
      <Helmet>
        <title>Sobre — evangeliza.me</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1
          className="text-4xl font-bold text-gray-900 mb-6"
          style={{ fontFamily: "'Lora', serif", color: '#1E3A5F' }}
        >
          Sobre o evangeliza.me
        </h1>

        <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>
            <strong>A Bíblia é o registro de como Deus agiu no passado.</strong>{' '}
            O evangeliza.me é o registro de como Ele age hoje.
          </p>

          <p>
            Este é um presente nosso para Deus — uma tentativa de mostrar, em tempo real, que Ele não é
            uma figura histórica. Ele está aqui, agindo nas vidas de pessoas comuns, todos os dias.
          </p>

          <p>
            Qualquer pessoa pode compartilhar seu testemunho. Sem cadastro. Sem julgamento.
            Anônimo ou identificado — você escolhe. Foto, vídeo, YouTube — conte como quiser.
          </p>
        </div>

        <hr className="my-10 border-gray-100" />

        <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Lora', serif" }}>
          Os Zeladores
        </h2>
        <p className="text-gray-600 mb-4">
          Todo testemunho é revisado pelos Zeladores — voluntários inspirados em Ezequiel 33, que guardam
          a comunidade com cuidado. Eles não censuram fé: apenas garantem que o conteúdo seja genuíno e
          respeitoso.
        </p>
        {WHATSAPP && (
          <p className="text-gray-600">
            Quer ser um Zelador?{' '}
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline decoration-[#C9933B]"
              style={{ color: '#1E3A5F' }}
            >
              Junte-se à comunidade no WhatsApp
            </a>{' '}
            e manifeste seu interesse.
          </p>
        )}

        <hr className="my-10 border-gray-100" />

        <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Lora', serif" }}>
          Código aberto
        </h2>
        <p className="text-gray-600 mb-4">
          O evangeliza.me é open source. Quem quiser contribuir com código, design ou oração, é bem-vindo.
        </p>
        <a
          href="https://github.com/jpmortaza/evangeliza.me"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-semibold px-5 py-2.5 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors text-gray-700"
        >
          Ver no GitHub →
        </a>

        <hr className="my-10 border-gray-100" />

        <div
          className="rounded-2xl p-8 text-white text-center"
          style={{ backgroundColor: '#1E3A5F' }}
        >
          <p className="text-xl font-medium mb-5" style={{ fontFamily: "'Lora', serif" }}>
            Você tem um testemunho?
          </p>
          <Link
            to="/compartilhar"
            className="inline-block font-semibold px-6 py-3 rounded-xl text-white transition-colors"
            style={{ backgroundColor: '#C9933B' }}
          >
            Compartilhar agora 🙏
          </Link>
        </div>
      </div>
    </>
  )
}
