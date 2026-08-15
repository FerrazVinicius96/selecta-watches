import { useEffect, useRef, useState } from 'react'
import './Hero.css'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=2000'

export default function Hero() {
  const mediaRef = useRef(null)
  const haloRef = useRef(null)
  const contentRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Parallax em 3 camadas com velocidades bem distintas (0.12 / 0.28 / 0.5).
  // É a razão entre as velocidades — não o tamanho do deslocamento — que o
  // olho lê como profundidade; camadas quase iguais parecem uma coisa só.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = null
    const apply = () => {
      const y = window.scrollY
      const limit = window.innerHeight * 1.2
      if (y < limit) {
        const p = y / window.innerHeight
        if (mediaRef.current) {
          mediaRef.current.style.transform = `translate3d(0, ${y * 0.12}px, 0) scale(${
            1 + p * 0.06
          })`
          // Fundo desfoca e escurece conforme o scroll avança: dá a sensação
          // de que a câmera está saindo de foco naquele plano.
          mediaRef.current.style.filter = `blur(${Math.min(p * 6, 6)}px)`
          mediaRef.current.style.opacity = `${Math.max(1 - p * 0.55, 0.35)}`
        }
        if (haloRef.current) {
          haloRef.current.style.transform = `translate3d(0, ${y * 0.28}px, 0)`
        }
        if (contentRef.current) {
          contentRef.current.style.transform = `translate3d(0, ${y * 0.5}px, 0)`
          contentRef.current.style.opacity = `${Math.max(1 - p * 1.15, 0)}`
        }
      }
      frame = null
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className={`hero ${ready ? 'is-ready' : ''}`} id="topo">
      {/* Camada 1 (mais lenta): fotografia de fundo */}
      <div className="hero__media" ref={mediaRef}>
        <img src={HERO_IMAGE} alt="" aria-hidden="true" fetchPriority="high" />
      </div>

      {/* Camada 2 (média): halo de luz + scrim — plano intermediário */}
      <div className="hero__halo" ref={haloRef} aria-hidden="true" />
      <div className="hero__scrim" aria-hidden="true" />

      {/* Camada 3 (mais rápida): tipografia, o primeiro plano */}
      <div className="hero__content shell" ref={contentRef}>
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

        <p className="hero__lede">
          Uma seleção restrita de relógios originais, cada peça autenticada e
          documentada individualmente.
        </p>

        {/* Um único CTA em pill, seguindo o ritmo adotado em toda a página. */}
        <div className="hero__actions">
          <a href="#colecao" className="btn btn--solid">
            Ver a coleção
          </a>
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
