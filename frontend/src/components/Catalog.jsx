import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchFeaturedWatches } from '../api/client'
import Reveal from './Reveal'
import SectionIntro from './SectionIntro'
import WatchPiece from './WatchPiece'
import './Catalog.css'

export default function Catalog({ onSelectWatch }) {
  const [state, setState] = useState({ status: 'loading', watches: [], error: null })
  const [active, setActive] = useState(0)
  const [hudOn, setHudOn] = useState(false)

  const reelRef = useRef(null)
  const pieceRefs = useRef([])

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: 'loading', error: null }))
    try {
      const data = await fetchFeaturedWatches()
      const watches = Array.isArray(data) ? data : []
      setState({
        status: watches.length ? 'ready' : 'empty',
        watches,
        error: null,
      })
    } catch (err) {
      setState({ status: 'error', watches: [], error: err.message })
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Qual peça está "em cena": observamos a faixa central da tela, então a
  // troca do indicador acontece quando a peça de fato domina a viewport.
  useEffect(() => {
    if (state.status !== 'ready') return
    const nodes = pieceRefs.current.filter(Boolean)
    if (!nodes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = Number(entry.target.dataset.index)
            if (!Number.isNaN(i)) setActive(i)
          }
        })
      },
      { threshold: 0, rootMargin: '-45% 0px -45% 0px' }
    )

    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [state.status])

  // A barra de progresso só existe enquanto a vitrine está na tela.
  useEffect(() => {
    const el = reelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setHudOn(entry.isIntersecting),
      { threshold: 0, rootMargin: '-15% 0px -20% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [state.status])

  // Parallax interno de cada peça: a foto se move mais devagar que o bloco de
  // texto, o mesmo princípio de profundidade usado no hero.
  useEffect(() => {
    if (state.status !== 'ready') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = null
    const apply = () => {
      const vh = window.innerHeight
      pieceRefs.current.forEach((node) => {
        if (!node) return
        const rect = node.getBoundingClientRect()
        if (rect.bottom < -200 || rect.top > vh + 200) return
        // -1 (peça abaixo da tela) → 0 (centralizada) → 1 (acima)
        const p = (vh / 2 - (rect.top + rect.height / 2)) / vh
        const media = node.querySelector('.piece__media')
        const body = node.querySelector('.piece__body')
        if (media) media.style.transform = `translate3d(0, ${p * -38}px, 0) scale(1.12)`
        if (body) body.style.transform = `translate3d(0, ${p * 34}px, 0)`
      })
      frame = null
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [state.status])

  const goTo = (i) => {
    pieceRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const total = state.watches.length

  return (
    <section className="cat" id="colecao">
      <div className="shell cat__intro">
        <SectionIntro
          eyebrow="Coleção em vitrine"
          lines={['Poucas peças.', <>Nenhuma por <em>acaso</em>.</>]}
          lede="A vitrine é rotativa e reflete o que está efetivamente disponível hoje. Cada relógio abaixo tem dossiê próprio de autenticação."
          cta={{ href: '#contato', label: 'Solicitar catálogo completo' }}
        />
      </div>

      {state.status === 'loading' && <CatalogSkeleton />}

      {state.status === 'error' && (
        <StatusBlock
          title="Não conseguimos carregar a vitrine agora"
          text="A conexão com nosso catálogo falhou momentaneamente. Tente novamente ou fale direto com um especialista."
          detail={state.error}
          action={
            <button type="button" className="btn" onClick={load}>
              Tentar novamente
            </button>
          }
        />
      )}

      {state.status === 'empty' && (
        <StatusBlock
          title="Vitrine em recomposição"
          text="No momento não há peças em destaque publicadas. Deixe seu contato e enviamos a próxima seleção em primeira mão."
          action={
            <a href="#contato" className="btn">
              Receber a próxima seleção
            </a>
          }
        />
      )}

      {state.status === 'ready' && (
        <div className="cat__reel" ref={reelRef}>
          {/* HUD sticky: sem categorias reais para filtrar, o honesto é
              mostrar apenas onde o visitante está dentro da vitrine. */}
          <div className={`cat__hud ${hudOn ? 'is-on' : ''}`} aria-hidden="true">
            <div className="cat__hud-inner shell">
              <span className="cat__hud-label">Vitrine</span>
              <div className="cat__hud-ticks">
                {state.watches.map((w, i) => (
                  <button
                    key={w.id}
                    type="button"
                    tabIndex={-1}
                    className={`cat__tick ${i === active ? 'is-active' : ''}`}
                    onClick={() => goTo(i)}
                  >
                    <span />
                  </button>
                ))}
              </div>
              <span className="cat__hud-count">
                <strong>{String(active + 1).padStart(2, '0')}</strong>
                <i>/</i>
                {String(total).padStart(2, '0')}
              </span>
            </div>
          </div>

          {state.watches.map((watch, i) => (
            <WatchPiece
              key={watch.id}
              ref={(el) => {
                pieceRefs.current[i] = el
              }}
              watch={watch}
              index={i}
              total={total}
              active={i === active}
              onSelect={onSelectWatch}
            />
          ))}
        </div>
      )}

      {state.status === 'ready' && (
        <div className="shell">
          <Reveal className="cat__foot">
            <span className="cat__foot-note">
              {total} {total === 1 ? 'peça disponível' : 'peças disponíveis'} nesta
              seleção
            </span>
            <a href="#contato" className="btn">
              Falar com um especialista
            </a>
          </Reveal>
        </div>
      )}
    </section>
  )
}

/* Skeleton no ritmo da peça real (uma tela cheia): evita "pulo" de layout
   quando os dados chegam e comunica carregamento sem spinner. */
function CatalogSkeleton() {
  return (
    <div className="cat__skel" aria-hidden="true">
      <div className="cat__skel-inner shell">
        <div className="skel__line skel__line--sm" />
        <div className="skel__line skel__line--lg" />
        <div className="skel__line skel__line--md" />
      </div>
    </div>
  )
}

function StatusBlock({ title, text, detail, action }) {
  return (
    <div className="shell">
      <Reveal className="cat__status">
        <span className="cat__status-mark" aria-hidden="true" />
        <h3 className="cat__status-title">{title}</h3>
        <p className="cat__status-text">{text}</p>
        {detail && <p className="cat__status-detail">{detail}</p>}
        {action}
      </Reveal>
    </div>
  )
}
