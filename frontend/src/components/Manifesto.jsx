import Reveal from './Reveal'
import SectionIntro from './SectionIntro'
import './Manifesto.css'

const PILLARS = [
  {
    n: '01',
    eyebrow: 'Procedência',
    title: 'Verificada peça a peça',
    text: 'Conferência de número de série, movimento e caixa junto ao registro do fabricante. Nada entra na vitrine sem dossiê.',
    image:
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=1000',
  },
  {
    n: '02',
    eyebrow: 'Curadoria',
    title: 'Seleção, não estoque',
    text: 'Trabalhamos com poucas peças por vez. Recusamos mais relógios do que aceitamos — é o que mantém a coleção coerente.',
    image:
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=1000',
  },
  {
    n: '03',
    eyebrow: 'Discrição',
    title: 'Atendimento reservado',
    text: 'Negociação privada, avaliação presencial ou remota e entrega assegurada. Seu nome não circula, sua compra não vira vitrine.',
    image:
      'https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&q=80&w=1000',
  },
]

export default function Manifesto() {
  return (
    <section className="mnf" id="casa">
      {/* Card editorial que invade a seção anterior: a sobreposição cria uma
          camada de profundidade entre hero e conteúdo, em vez de duas faixas
          empilhadas. */}
      <div className="shell">
        <Reveal className="mnf__overlap">
          <div className="mnf__overlap-media">
            <img
              src="https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&q=80&w=1600"
              alt="Close de um relógio de luxo em conferência no ateliê da Selecta"
              loading="lazy"
            />
          </div>
          <div className="mnf__overlap-text">
            <p className="eyebrow eyebrow--accent">O método</p>
            <h2 className="mnf__overlap-title">
              Cada peça chega à vitrine com um dossiê assinado
            </h2>
            <p className="mnf__overlap-note">
              Número de série, laudo pericial e histórico de manutenção — o que
              normalmente se descobre depois, aqui vem antes.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="shell mnf__main">
        <SectionIntro
          eyebrow="A Casa"
          lines={['Autenticidade não é', <>promessa. É <em>protocolo</em>.</>]}
          lede="A Selecta Watches nasceu de uma inquietação simples: no mercado de alto relógio, a maior parte do risco está no que não se vê. Por isso construímos um processo em que a confiança é consequência de método — não de discurso."
          cta={{ href: '#colecao', label: 'Ver a coleção' }}
        />

        <ol className="mnf__pillars">
          {PILLARS.map((p, i) => (
            <Reveal as="li" key={p.n} className="mnf__pillar" delay={i * 120}>
              <div className="mnf__pillar-media">
                <img src={p.image} alt="" aria-hidden="true" loading="lazy" />
                <span className="mnf__pillar-n">{p.n}</span>
              </div>
              <p className="mnf__pillar-eyebrow">{p.eyebrow}</p>
              <h3 className="mnf__pillar-title">{p.title}</h3>
              <p className="mnf__pillar-text">{p.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
