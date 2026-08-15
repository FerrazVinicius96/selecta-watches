import { useEffect, useState } from 'react'
import './Header.css'

const LINKS = [
  { href: '#colecao', label: 'Coleção' },
  { href: '#casa', label: 'A Casa' },
  { href: '#confianca', label: 'Confiança' },
]

export default function Header() {
  const [condensed, setCondensed] = useState(false)
  const [open, setOpen] = useState(false)

  // Header ganha fundo só depois que o usuário sai do hero — assim a primeira
  // dobra fica completamente limpa, sem barra competindo com a imagem.
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className={`hdr ${condensed ? 'is-condensed' : ''}`}>
      <div className="hdr__inner shell">
        <a href="#topo" className="hdr__brand" onClick={() => setOpen(false)}>
          <span className="hdr__mark" aria-hidden="true" />
          <span className="hdr__name">
            Selecta<span className="hdr__name-thin"> Watches</span>
          </span>
        </a>

        <nav className="hdr__nav" aria-label="Navegação principal">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hdr__link">
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#contato" className="hdr__cta">
          Falar com especialista
        </a>

        <button
          className={`hdr__burger ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* O drawer fica FORA do <header> de propósito: o header usa
          backdrop-filter, que cria um bloco de contenção e prenderia um
          filho "position: fixed" dentro da barra em vez da tela inteira. */}
      <div className={`hdr__drawer ${open ? 'is-open' : ''}`}>
        {LINKS.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            style={{ transitionDelay: `${120 + i * 70}ms` }}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contato"
          className="hdr__drawer-cta"
          style={{ transitionDelay: `${120 + LINKS.length * 70}ms` }}
          onClick={() => setOpen(false)}
        >
          Falar com especialista
        </a>
      </div>
    </>
  )
}
