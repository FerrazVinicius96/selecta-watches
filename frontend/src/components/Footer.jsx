import Reveal from './Reveal'
import './Footer.css'

const COLS = [
  {
    title: 'Navegar',
    items: [
      ['Coleção', '#colecao'],
      ['A Casa', '#casa'],
      ['Confiança', '#confianca'],
      ['Contato', '#contato'],
    ],
  },
  {
    title: 'Atendimento',
    items: [
      ['Solicitar catálogo', '#contato'],
      ['Falar com especialista', '#contato'],
      ['Avaliar minha peça', '#contato'],
    ],
  },
  {
    title: 'Showroom',
    lines: ['Rua Haddock Lobo, 1600', 'Jardins — São Paulo, SP', 'Visitas com hora marcada'],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="ftr">
      <div className="shell">
        <div className="ftr__top">
          <Reveal className="ftr__brand">
            <span className="ftr__mark" aria-hidden="true" />
            <p className="ftr__wordmark">Selecta Watches</p>
            <p className="ftr__tagline">
              Curadoria de relógios originais, com procedência documentada.
            </p>
          </Reveal>

          {/* Colunas em cascata (100ms entre elas): o rodapé era o único bloco
              da página que entrava sem animação. */}
          <nav className="ftr__cols" aria-label="Rodapé">
            {COLS.map((col, i) => (
              <Reveal key={col.title} delay={120 + i * 100}>
                <h4>{col.title}</h4>
                {col.items?.map(([label, href]) => (
                  <a key={label} href={href}>
                    {label}
                  </a>
                ))}
                {col.lines?.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </Reveal>
            ))}
          </nav>
        </div>

        <Reveal className="ftr__bottom" delay={80}>
          <span>© {year} Selecta Watches. Todos os direitos reservados.</span>
          <span className="ftr__legal">
            CNPJ 00.000.000/0001-00 · Peças comercializadas com nota fiscal
          </span>
        </Reveal>
      </div>
    </footer>
  )
}
