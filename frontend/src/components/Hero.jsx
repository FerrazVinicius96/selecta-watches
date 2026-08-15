import { useEffect, useRef, useState } from 'react'
import './Hero.css'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=2000'

/* Velocidades das camadas de profundidade.
   Leitura: quanto MAIOR o fator, mais a camada "fica para trás" enquanto a
   página sobe — ou seja, mais distante ela parece. O conteúdo usa fator
   negativo: ele sobe mais rápido que a própria rolagem, o que cria o
   contraste de profundidade que um parallax de camada única não dá. */
const LAYERS = {
  desktop: { media: 0.46, glow: 0.24, content: -0.14, foot: -0.06 },
  // No mobile a "viagem" de scroll é curta e o hardware mais fraco: metade
  // da amplitude mantém o efeito legível sem risco de travar a rolagem.
  mobile: { media: 0.24, glow: 0.13, content: -0.06, foot: -0.03 },
}

export default function Hero() {
  const mediaRef = useRef(null)
  const glowRef = useRef(null)
  const contentRef = useRef(null)
  const footRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Parallax em 4 camadas com velocidades bem distintas entre si.
  // rAF + translate3d: o navegador compõe tudo na GPU, sem recalcular layout
  // a cada evento de scroll (por isso nada de top/margin aqui).
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const small = window.matchMedia('(max-width: 760px)')

    let frame = null
    let attached = false

    const clear = () => {
      for (const ref of [mediaRef, glowRef, contentRef, footRef]) {
        if (!ref.current) continue
        ref.current.style.transform = ''
        ref.current.style.opacity = ''
      }
      if (mediaRef.current) {
        mediaRef.current.style.removeProperty('--hero-blur')
        mediaRef.current.style.removeProperty('--hero-dim')
      }
    }

    const render = () => {
      frame = null
      const vh = window.innerHeight || 1
      const y = window.scrollY
      // p = 0 no topo, 1 quando o hero já saiu de cena. Travar em 1 evita
      // continuar calculando (e deslocando) o que ninguém mais vê.
      const p = Math.min(y / vh, 1)
      const k = small.matches ? LAYERS.mobile : LAYERS.desktop
      const offset = p * vh

      if (mediaRef.current) {
        mediaRef.current.style.transform = `translate3d(0, ${
          offset * k.media
        }px, 0) scale(${1 + p * 0.12})`
        // Desfoque + escurecimento progressivos: o fundo "recua" no eixo Z
        // enquanto o texto avança. No mobile o blur sai (é o filtro mais caro
        // de rasterizar) e fica só o escurecimento.
        mediaRef.current.style.setProperty(
          '--hero-blur',
          small.matches ? '0px' : `${(p * 7).toFixed(2)}px`,
        )
        mediaRef.current.style.setProperty('--hero-dim', (1 - p * 0.45).toFixed(3))
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(0, ${offset * k.glow}px, 0)`
      }

      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, ${
          offset * k.content
        }px, 0)`
        // Fade só no último terço da saída: o texto se despede em vez de
        // simplesmente sumir sob o header.
        contentRef.current.style.opacity = String(
          Math.max(0, Math.min(1, 1 - (p - 0.45) / 0.45)),
        )
      }

      if (footRef.current) {
        footRef.current.style.transform = `translate3d(0, ${offset * k.foot}px, 0)`
      }
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(render)
    }

    const sync = () => {
      if (reduce.matches) {
        if (attached) {
          window.removeEventListener('scroll', onScroll)
          window.removeEventListener('resize', onScroll)
          attached = false
        }
        if (frame) {
          cancelAnimationFrame(frame)
          frame = null
        }
        clear()
        return
      }
      if (!attached) {
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll, { passive: true })
        attached = true
      }
      render()
    }

    sync()
    reduce.addEventListener('change', sync)
    small.addEventListener('change', sync)

    return () => {
      reduce.removeEventListener('change', sync)
      small.removeEventListener('change', sync)
      if (attached) {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      }
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className={`hero ${ready ? 'is-ready' : ''}`} id="topo">
      <div className="hero__media" ref={mediaRef}>
        <img src={HERO_IMAGE} alt="" aria-hidden="true" fetchPriority="high" />
      </div>

      {/* O scrim fica FORA da camada de parallax: ele é o degradê que garante
          a leitura do texto e o encaixe com o fundo da página — se ele se
          movesse junto com a foto, apareceria um corte seco no pé do hero. */}
      <div className="hero__scrim" aria-hidden="true" />

      {/* Halo que "respira" atrás do título: única microinteração idle do
          topo da página — dá sinal de vida sem mover o texto. */}
      <div className="hero__glow-layer" aria-hidden="true" ref={glowRef}>
        <div className="hero__glow" />
      </div>

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

      <div className="hero__foot shell" ref={footRef}>
        <a href="#casa" className="hero__scroll">
          <span className="hero__scroll-label">Role para descobrir</span>
          <span className="hero__scroll-track">
            <span className="hero__scroll-dot" />
          </span>
        </a>

        {/* Stagger por índice: os três números entram em cascata, guiando o
            olho da esquerda para a direita em vez de aparecerem em bloco. */}
        <ul className="hero__facts">
          {[
            ['100%', 'Peças autenticadas'],
            ['24 meses', 'Garantia própria'],
            ['+1.400', 'Colecionadores atendidos'],
          ].map(([value, label], i) => (
            <li key={label} style={{ '--i': i }}>
              <strong>{value}</strong>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
