import { useEffect, useState } from 'react'
import Reveal from './Reveal'
import MaskedText from './MaskedText'
import './Trust.css'

// Conteúdo placeholder plausível — o PROJECT.md registra que depoimentos e
// selos reais ainda não foram fornecidos pelo PO.
const SEALS = [
  {
    title: 'Certificado de autenticidade',
    text: 'Dossiê individual com número de série, fotos periciais e laudo assinado.',
    icon: 'seal',
  },
  {
    title: 'Garantia Selecta de 24 meses',
    text: 'Cobertura própria de movimento, além da garantia de fábrica quando aplicável.',
    icon: 'shield',
  },
  {
    title: 'Entrega assegurada',
    text: 'Transporte segurado porta a porta ou retirada presencial com conferência.',
    icon: 'box',
  },
  {
    title: 'Recompra garantida',
    text: 'Compromisso de recompra em até 12 meses, com avaliação transparente.',
    icon: 'cycle',
  },
]

const TESTIMONIALS = [
  {
    quote:
      'Comprei um Daytona à distância, algo que eu jamais faria. O dossiê de autenticação e o acompanhamento durante o transporte fizeram toda a diferença.',
    name: 'Ricardo A.',
    role: 'Colecionador · São Paulo, SP',
  },
  {
    quote:
      'Foram os únicos que me disseram para não comprar uma peça. Perderam a venda naquele mês e ganharam um cliente para a vida inteira.',
    name: 'Marina L.',
    role: 'Advogada · Belo Horizonte, MG',
  },
  {
    quote:
      'Atendimento discreto de verdade. Sem pressão, sem vitrine, sem meu nome circulando. É exatamente o que se espera nesse tipo de compra.',
    name: 'Eduardo F.',
    role: 'Empresário · Curitiba, PR',
  },
]

const MAISONS = [
  'Rolex',
  'Patek Philippe',
  'Audemars Piguet',
  'Omega',
  'Jaeger-LeCoultre',
  'IWC Schaffhausen',
  'Vacheron Constantin',
  'Cartier',
]

export default function Trust() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setActive((i) => (i + 1) % TESTIMONIALS.length)
    }, 7000)
    return () => clearInterval(id)
  }, [paused])

  return (
    <section className="trust section" id="confianca">
      <div className="shell">
        <header className="trust__head">
          <Reveal as="p" className="eyebrow">
            Confiança
          </Reveal>
          <MaskedText
            as="h2"
            className="display trust__title"
            delay={80}
            lines={[
              'O que sustenta uma',
              <>
                compra de <em>alto valor</em>
              </>,
            ]}
          />
        </header>

        <div className="trust__seals">
          {SEALS.map((seal, i) => (
            <Reveal as="article" key={seal.title} className="seal" delay={i * 100}>
              <SealIcon name={seal.icon} />
              <h3 className="seal__title">{seal.title}</h3>
              <p className="seal__text">{seal.text}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Faixa de maisons: prova de repertório sem usar logos de terceiros
          (evita problema de licença de marca antes de o PO fornecer material). */}
      <Reveal className="trust__marquee" delay={120}>
        <div className="trust__marquee-track">
          {[0, 1].map((dup) => (
            <ul key={dup} aria-hidden={dup === 1}>
              {MAISONS.map((m) => (
                <li key={`${dup}-${m}`}>{m}</li>
              ))}
            </ul>
          ))}
        </div>
      </Reveal>

      <div className="shell">
        <div
          className="trust__quotes"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Reveal className="trust__quote-stage">
            <span className="trust__quote-mark" aria-hidden="true">
              “
            </span>
            <div className="trust__quote-slides">
              {TESTIMONIALS.map((t, i) => (
                <blockquote
                  key={t.name}
                  className={`trust__quote ${i === active ? 'is-active' : ''}`}
                  aria-hidden={i !== active}
                >
                  <p>{t.quote}</p>
                  <footer>
                    <span className="trust__quote-name">{t.name}</span>
                    <span className="trust__quote-role">{t.role}</span>
                  </footer>
                </blockquote>
              ))}
            </div>

            <div className="trust__dots" role="tablist" aria-label="Depoimentos">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Depoimento de ${t.name}`}
                  className={`trust__dot ${i === active ? 'is-active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <span />
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* Ícones em traço fino, desenhados inline: mantêm o peso visual da tipografia
   e evitam uma dependência de biblioteca de ícones.
   `pathLength={1}` normaliza o comprimento de cada traço para 1, o que permite
   que um único keyframe CSS "desenhe" qualquer uma das formas na entrada. */
function SealIcon({ name }) {
  const stroke = { pathLength: 1 }
  const common = {
    width: 34,
    height: 34,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 0.9,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    className: 'seal__icon',
  }

  if (name === 'shield') {
    return (
      <svg {...common}>
        <path {...stroke} d="M12 3l7 3v5.5c0 4.2-2.9 7.9-7 9.5-4.1-1.6-7-5.3-7-9.5V6l7-3z" />
        <path {...stroke} d="M9 12l2.2 2.2L15.5 10" />
      </svg>
    )
  }
  if (name === 'box') {
    return (
      <svg {...common}>
        <path {...stroke} d="M3.5 7.5L12 3.5l8.5 4v9L12 20.5l-8.5-4v-9z" />
        <path {...stroke} d="M3.5 7.5L12 11.5l8.5-4M12 11.5v9" />
      </svg>
    )
  }
  if (name === 'cycle') {
    return (
      <svg {...common}>
        <path {...stroke} d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6" />
        <path {...stroke} d="M18 3v3.8h-3.8M6 21v-3.8h3.8" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle {...stroke} cx="12" cy="10" r="6" />
      <path {...stroke} d="M9 10.4l2.1 2.1L15 8.6" />
      <path {...stroke} d="M8.6 15.4L7.5 21l4.5-2.2L16.5 21l-1.1-5.6" />
    </svg>
  )
}
