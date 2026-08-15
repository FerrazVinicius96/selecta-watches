import { useCallback, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Catalog from './components/Catalog'
import Trust from './components/Trust'
import LeadForm from './components/LeadForm'
import Footer from './components/Footer'

export default function App() {
  // Estado mínimo levantado até aqui: o catálogo precisa "conversar" com o
  // formulário (clicar em uma peça leva ao contato já contextualizado).
  // Um contexto/estado global seria excesso para uma única página.
  const [selectedWatch, setSelectedWatch] = useState(null)

  const handleSelectWatch = useCallback((watch) => {
    setSelectedWatch({ ...watch, _ts: Date.now() })
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <a href="#colecao" className="skip-link">
        Ir para a coleção
      </a>
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <Catalog onSelectWatch={handleSelectWatch} />
        <Trust />
        <LeadForm prefill={selectedWatch} />
      </main>
      <Footer />
    </>
  )
}
