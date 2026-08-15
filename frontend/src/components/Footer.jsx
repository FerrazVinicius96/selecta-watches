import './Footer.css'

const COLS = [
  {
    title: 'Navegar',
    links: [
      { href: '#colecao', label: 'Coleção' },
      { href: '#casa', label: 'A Casa' },
      { href: '#confianca', label: 'Confiança' },
      { href: '#contato', label: 'Contato' },
    ],
  },
  {
    title: 'Atendimento',
    links: [
      { href: '#contato', label: 'Solicitar catálogo' },
      { href: '#contato', label: 'Falar com especialista' },
      { href: '#contato', label: 'Avaliar minha peça' },
    ],
  },
  {
    title: 'Showroom',
    items: ['Rua Haddock Lobo, 1600', 'Jardins — São Paulo, SP', 'Visitas com hora marcada'],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="ftr">
      <div className="shell">
        {/* Marca centralizada acima das colunas: fecha a página do mesmo jeito
            que o header a abre, dando simetria à leitura. */}
        <div className="ftr__brand">
          <span className="ftr__mark" aria-hidden="true" />
          <p className="ftr__wordmark">Selecta</p>
          <p className="ftr__sub">Watches</p>
          <p className="ftr__tagline">
            Curadoria de relógios originais, com procedência documentada.
          </p>
        </div>

        <nav className="ftr__cols" aria-label="Rodapé">
          {COLS.map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              {col.links?.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
              {col.items?.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
          ))}
        </nav>

        <div className="ftr__bottom">
          <span>© {year} Selecta Watches. Todos os direitos reservados.</span>
          <span className="ftr__legal">
            CNPJ 00.000.000/0001-00 · Peças comercializadas com nota fiscal
          </span>
        </div>
      </div>
    </footer>
  )
}
