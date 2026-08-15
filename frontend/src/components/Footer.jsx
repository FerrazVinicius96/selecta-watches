import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="ftr">
      <div className="shell">
        <div className="ftr__top">
          <div className="ftr__brand">
            <span className="ftr__mark" aria-hidden="true" />
            <p className="ftr__wordmark">Selecta Watches</p>
            <p className="ftr__tagline">
              Curadoria de relógios originais, com procedência documentada.
            </p>
          </div>

          <nav className="ftr__cols" aria-label="Rodapé">
            <div>
              <h4>Navegar</h4>
              <a href="#colecao">Coleção</a>
              <a href="#casa">A Casa</a>
              <a href="#confianca">Confiança</a>
              <a href="#contato">Contato</a>
            </div>
            <div>
              <h4>Atendimento</h4>
              <a href="#contato">Solicitar catálogo</a>
              <a href="#contato">Falar com especialista</a>
              <a href="#contato">Avaliar minha peça</a>
            </div>
            <div>
              <h4>Showroom</h4>
              <p>Rua Haddock Lobo, 1600</p>
              <p>Jardins — São Paulo, SP</p>
              <p>Visitas com hora marcada</p>
            </div>
          </nav>
        </div>

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
