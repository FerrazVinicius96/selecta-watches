import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import './Hero.css'

// Vídeo servido como asset estático do Vite (public/), sem CDN externa —
// mesmo raciocínio já usado para as demais mídias do projeto.
const HERO_VIDEO = '/video/hero-loop.mp4'

// Imagem de segurança: é o poster do vídeo E o fundo definitivo caso o vídeo
// falhe (rede fraca, formato bloqueado, economia de dados). Nunca tela preta.
const HERO_POSTER =
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=2000'

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Hero() {
  const bgRef = useRef(null)
  const haloRef = useRef(null)
  const stageRef = useRef(null)
  const scrollRef = useRef(null)
  const videoRef = useRef(null)

  const [ready, setReady] = useState(false)
  const [videoLive, setVideoLive] = useState(false)
  // Quem pede menos movimento não recebe vídeo nenhum: fica só o poster.
  const [reduced] = useState(reducedMotion)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Autoplay: alguns navegadores ignoram o atributo e só liberam via play()
  // programático. Se ainda assim bloquear, o poster assume e nada quebra.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const p = v.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }, [reduced])

  // Fora da tela, o vídeo pausa. Um loop rodando embaixo de 4 seções gasta
  // CPU/bateria à toa, principalmente em notebook e celular.
  useEffect(() => {
    const v = videoRef.current
    const stage = stageRef.current
    if (!v || !stage) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.01 }
    )
    io.observe(stage)
    return () => io.disconnect()
  }, [videoLive])

  // Parallax em 3 velocidades (0.10 / 0.26 / 0.35). Diferente da versão com
  // imagem, aqui NÃO animamos blur/filter durante o scroll: refiltrar um vídeo
  // a cada quadro trava a rolagem. Só translate e opacity, que a GPU resolve
  // sem repintar o vídeo.
  useEffect(() => {
    if (reduced) return

    let frame = null
    const apply = () => {
      const y = window.scrollY
      const vh = window.innerHeight
      if (y < vh * 1.25) {
        const p = y / vh
        if (bgRef.current) {
          bgRef.current.style.transform = `translate3d(0, ${y * 0.1}px, 0)`
          bgRef.current.style.opacity = `${Math.max(1 - p * 0.45, 0.4)}`
        }
        if (haloRef.current) {
          haloRef.current.style.transform = `translate3d(0, ${y * 0.26}px, 0)`
        }
        if (stageRef.current) {
          stageRef.current.style.transform = `translate3d(0, ${y * 0.35}px, 0)`
          stageRef.current.style.opacity = `${Math.max(1 - p * 1.35, 0)}`
        }
        // O indicador some bem antes do resto: como ele desce junto com o
        // palco, sem isso ele cruzaria por cima dos CTAs do bloco de apoio.
        if (scrollRef.current) {
          if (y === 0) {
            // No topo devolvemos o controle ao CSS, senão o inline atropela a
            // animação de entrada do indicador.
            scrollRef.current.style.opacity = ''
            scrollRef.current.style.transition = ''
            scrollRef.current.style.pointerEvents = ''
          } else {
            const o = Math.max(1 - p * 4, 0)
            // Sem transition aqui: a de entrada (1,2s) atrasaria o sumiço e o
            // indicador apareceria "fantasma" por cima do bloco de apoio.
            scrollRef.current.style.transition = 'none'
            scrollRef.current.style.opacity = `${o}`
            scrollRef.current.style.pointerEvents = o < 0.1 ? 'none' : 'auto'
          }
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
  }, [reduced])

  return (
    <section className={`hero ${ready ? 'is-ready' : ''}`} id="topo">
      {/* Camada 1 — fundo em movimento (a mais lenta). O vídeo é textura,
          nunca o assunto: entra desfocado e com overscan para o blur não
          revelar as bordas do quadro. */}
      <div className="hero__bg" ref={bgRef} aria-hidden="true">
        {/* Wrapper interno só para a entrada (fade + zoom lento): o wrapper
            externo fica reservado ao parallax, que o JS escreve inline. */}
        <div className="hero__bg-inner">
          <img className="hero__poster" src={HERO_POSTER} alt="" fetchPriority="high" />

          {!reduced && (
            <video
              ref={videoRef}
              className={`hero__video ${videoLive ? 'is-live' : ''}`}
              src={HERO_VIDEO}
              poster={HERO_POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onPlaying={() => setVideoLive(true)}
              onError={() => setVideoLive(false)}
            />
          )}
        </div>
      </div>

      {/* Camada 2 — atmosfera: halo quente + scrim que garante a leitura do
          texto sobre o vídeo e funde o hero no fundo da próxima seção. */}
      <div className="hero__halo" ref={haloRef} aria-hidden="true" />
      <div className="hero__scrim" aria-hidden="true" />

      {/* Camada 3 — abertura: o wordmark é o maior elemento da tela. */}
      <div className="hero__stage" ref={stageRef}>
        <div className="hero__wordmark">
          <span className="hero__wm-rule" aria-hidden="true" />
          <h1 className="hero__wm">
            <span className="hero__wm-line">
              <span>Selecta</span>
            </span>
            <span className="hero__wm-sub">
              <span>Watches</span>
            </span>
          </h1>
        </div>

        <a href="#casa" className="hero__scroll" ref={scrollRef}>
          <span className="hero__scroll-label">Role para descobrir</span>
          <span className="hero__scroll-track">
            <span className="hero__scroll-dot" />
          </span>
        </a>
      </div>

      {/* Bloco de apoio: o discurso da marca continua aqui, logo abaixo da
          abertura — só deixou de disputar o protagonismo tipográfico. */}
      <div className="hero__support shell">
        <div className="hero__support-grid">
          <div className="hero__support-col">
            <Reveal as="p" className="eyebrow eyebrow--accent">
              Curadoria privada · Desde 2009
            </Reveal>
            <Reveal as="h2" className="hero__claim" delay={120}>
              O tempo não se compra. <em>Escolhe-se</em>
            </Reveal>
          </div>

          <div className="hero__support-col hero__support-col--end">
            <Reveal as="p" className="hero__lede" delay={200}>
              Uma seleção restrita de relógios originais, cada peça autenticada e
              documentada individualmente.
            </Reveal>
            <Reveal className="hero__actions" delay={300}>
              <a href="#colecao" className="btn btn--solid">
                Ver a coleção
              </a>
              <a href="#contato" className="btn">
                Falar com especialista
              </a>
            </Reveal>
          </div>
        </div>

        <Reveal as="ul" className="hero__facts" delay={160}>
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
        </Reveal>
      </div>
    </section>
  )
}
