import Reveal from './Reveal'
import './Manifesto.css'

const PILLARS = [
  {
    n: '01',
    title: 'Procedência verificada',
    text: 'Cada peça passa por conferência de número de série, movimento e caixa junto ao registro do fabricante. Nada entra na vitrine sem dossiê.',
  },
  {
    n: '02',
    title: 'Curadoria, não estoque',
    text: 'Trabalhamos com poucas peças por vez. Recusamos mais relógios do que aceitamos — é o que mantém a coleção coerente.',
  },
  {
    n: '03',
    title: 'Discrição no atendimento',
    text: 'Negociação privada, avaliação presencial ou remota e entrega assegurada. Seu nome não circula, sua compra não vira vitrine.',
  },
]

export default function Manifesto() {
  return (
    <section className="mnf section" id="casa">
      <div className="shell">
        <div className="mnf__grid">
          <div className="mnf__media">
            <Reveal className="mnf__frame">
              <img
                src="https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&q=80&w=1200"
                alt="Close de um relógio de luxo em conferência no ateliê da Selecta"
                loading="lazy"
              />
            </Reveal>
            <Reveal className="mnf__caption" delay={200}>
              <span className="mnf__caption-line" />
              Conferência de série e movimento — peça a peça
            </Reveal>
          </div>

          <div className="mnf__body">
            <Reveal as="p" className="eyebrow">
              A Casa
            </Reveal>

            <Reveal as="h2" className="display mnf__title" delay={90}>
              Autenticidade não é
              <br />
              promessa. É <em>protocolo</em>.
            </Reveal>

            <Reveal as="p" className="lede mnf__lede" delay={160}>
              A Selecta Watches nasceu de uma inquietação simples: no mercado de
              alto relógio, a maior parte do risco está no que não se vê. Por
              isso construímos um processo em que a confiança é consequência de
              método — não de discurso.
            </Reveal>

            <ol className="mnf__pillars">
              {PILLARS.map((p, i) => (
                <Reveal as="li" key={p.n} className="mnf__pillar" delay={220 + i * 110}>
                  <span className="mnf__pillar-n">{p.n}</span>
                  <div>
                    <h3 className="mnf__pillar-title">{p.title}</h3>
                    <p className="mnf__pillar-text">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={560}>
              <a href="#contato" className="link-underline">
                Conhecer o processo de autenticação
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
