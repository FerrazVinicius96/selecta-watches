import { useCallback, useEffect, useState } from 'react'
import { fetchFeaturedWatches } from '../api/client'
import Reveal from './Reveal'
import WatchCard from './WatchCard'
import './Catalog.css'

export default function Catalog({ onSelectWatch }) {
  const [state, setState] = useState({ status: 'loading', watches: [], error: null })

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

  return (
    <section className="cat section" id="colecao">
      <div className="shell">
        <header className="cat__head">
          <div>
            <Reveal as="p" className="eyebrow">
              Coleção em destaque
            </Reveal>
            <Reveal as="h2" className="display cat__title" delay={80}>
              Peças <em>selecionadas</em> desta temporada
            </Reveal>
          </div>
          <Reveal as="p" className="cat__note" delay={160}>
            A vitrine é rotativa e reflete o estoque disponível no momento.
            Peças fora desta lista podem ser localizadas sob encomenda.
          </Reveal>
        </header>

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
          <>
            <div className="cat__grid">
              {state.watches.map((watch, i) => (
                <Reveal key={watch.id} delay={i * 90}>
                  <WatchCard watch={watch} index={i} onSelect={onSelectWatch} />
                </Reveal>
              ))}
            </div>

            <Reveal className="cat__foot" delay={120}>
              <span className="cat__count">
                {state.watches.length}{' '}
                {state.watches.length === 1 ? 'peça disponível' : 'peças disponíveis'}
              </span>
              <a href="#contato" className="link-underline">
                Solicitar catálogo completo
              </a>
            </Reveal>
          </>
        )}
      </div>
    </section>
  )
}

/* Skeleton no ritmo do card real: evita "pulo" de layout quando os dados
   chegam e comunica carregamento sem spinner (spinner destoa do tom). */
function CatalogSkeleton() {
  return (
    <div className="cat__grid" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div className="skel" key={i} style={{ animationDelay: `${i * 140}ms` }}>
          <div className="skel__media" />
          <div className="skel__line skel__line--sm" />
          <div className="skel__line skel__line--lg" />
          <div className="skel__line skel__line--md" />
        </div>
      ))}
    </div>
  )
}

function StatusBlock({ title, text, detail, action }) {
  return (
    <Reveal className="cat__status">
      <span className="cat__status-mark" aria-hidden="true" />
      <h3 className="cat__status-title">{title}</h3>
      <p className="cat__status-text">{text}</p>
      {detail && <p className="cat__status-detail">{detail}</p>}
      {action}
    </Reveal>
  )
}
