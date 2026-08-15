import { useEffect, useRef, useState } from 'react'
import './Hero.css'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=2000'

export default function Hero() {
  const mediaRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Parallax duplo e muito contido (imagem sobe mais devagar que o texto).
  // rAF + transform evitam reflow e mantêm 60fps.
  useEffect(() => {
    let frame = null
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        const y = window.scrollY
        if (mediaRef.current && y < window.innerHeight * 1.2) {
          mediaRef.current.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(${
            1 + y * 0.00008
          })`
        }
        frame = null
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className={`hero ${ready ? 'is-ready' : ''}`} id="topo">
      <div className="hero__media" ref={mediaRef}>
        <img src={HERO_IMAGE} alt="" aria-hidden="true" fetchPriority="high" />
        <div className="hero__scrim" />
      </div>

      <div className="hero__content shell">
        <p className="hero__kicker">
          <span>Curadoria privada · Desde 2009</span>
        </p>

        <h1 className="hero__title">
          <span className="hero__line">
            <span>O tempo não</span>
          </span>
          <span className="hero__line">
            <span>se compra.</span>
          </span>
          <span className="hero__line">
            <span className="hero__title-em">Escolhe-se</span>
          </span>
        </h1>

        <div className="hero__aside">
          <p className="hero__lede">
            Uma seleção restrita de relógios originais, cada peça autenticada e
            documentada individualmente. Atendimento reservado, para quem
            compra uma vez — e para sempre.
          </p>

          <div className="hero__actions">
            <a href="#colecao" className="btn btn--solid">
              Ver a coleção
            </a>
            <a href="#contato" className="btn">
              Falar com especialista
            </a>
          </div>
        </div>
      </div>

      <div className="hero__foot shell">
        <a href="#casa" className="hero__scroll">
          <span className="hero__scroll-label">Role para descobrir</span>
          <span className="hero__scroll-track">
            <span className="hero__scroll-dot" />
          </span>
        </a>

        <ul className="hero__facts">
          <li>
            <strong>100%</strong>
            <span>Peças autenticadas</span>
          </li>
          <li>
            <strong>24 meses</strong>
            <span>Garantia própria</span>
          </li>
          <li>
            <strong>+1.400</strong>
            <span>Colecionadores atendidos</span>
          </li>
        </ul>
      </div>
    </section>
  )
}
