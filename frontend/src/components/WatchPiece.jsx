import { useState } from 'react'
import { formatPrice } from '../utils/format'
import { resolveImageUrl } from '../api/client'

/**
 * Uma peça do catálogo ocupando a viewport inteira.
 *
 * Decisão de design: em vez de um grid de cards, cada relógio recebe uma tela
 * só sua. Com poucas peças em vitrine, o grid comunicava "estoque pequeno";
 * a tela cheia comunica "seleção" — que é exatamente o posicionamento da casa.
 */
export default function WatchPiece({ ref, watch, index, total, active, onSelect }) {
  const [failed, setFailed] = useState(false)
  const hasImage = Boolean(watch.image_url) && !failed
  const side = index % 2 === 0 ? 'start' : 'end'

  return (
    <article
      ref={ref}
      data-index={index}
      className={`piece piece--${side} ${active ? 'is-active' : ''}`}
      aria-label={`${watch.brand} ${watch.name} — peça ${index + 1} de ${total}`}
    >
      <div className="piece__media">
        {hasImage ? (
          <img
            src={resolveImageUrl(watch.image_url)}
            alt={`${watch.brand} ${watch.name}`}
            loading={index === 0 ? 'eager' : 'lazy'}
            onError={() => setFailed(true)}
          />
        ) : (
          // Placeholder tipográfico em vez de ícone de "imagem quebrada":
          // mantém a página elegante mesmo com cadastro incompleto no admin.
          <div className="piece__fallback" aria-hidden="true">
            <span>{watch.brand?.slice(0, 2).toUpperCase() || '—'}</span>
          </div>
        )}
      </div>

      <div className="piece__scrim" aria-hidden="true" />

      <div className="piece__inner shell">
        <div className="piece__body">
          <p className="piece__brand">{watch.brand}</p>
          <h3 className="piece__name">{watch.name}</h3>

          {watch.description && <p className="piece__ref">{watch.description}</p>}

          <div className="piece__foot">
            <span className="piece__price">{formatPrice(watch.price)}</span>
            <AuthSeal />
          </div>

          <button type="button" className="btn piece__cta" onClick={() => onSelect(watch)}>
            Consultar esta peça
          </button>
        </div>
      </div>
    </article>
  )
}

/* Selo desenhado por traço (stroke-dashoffset) quando a peça entra em cena:
   a linha "se escreve" ao lado do preço, associando valor a procedência
   exatamente no momento da decisão. */
function AuthSeal() {
  return (
    <span className="piece__seal">
      <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">
        <circle className="piece__seal-ring" cx="20" cy="20" r="15" />
        <path className="piece__seal-check" d="M13.5 20.4l4.4 4.3 8.6-9" />
      </svg>
      Autenticada e documentada
    </span>
  )
}
