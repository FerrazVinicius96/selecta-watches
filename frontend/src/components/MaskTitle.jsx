import { useReveal } from '../hooks/useReveal'

/**
 * Título com "line reveal": cada linha vive dentro de uma máscara
 * (overflow: hidden) e sobe de baixo quando o bloco entra na viewport.
 *
 * As linhas são passadas explicitamente (array) em vez de quebradas
 * automaticamente: a máscara precisa saber onde cada linha começa e termina,
 * e a quebra manual também garante que o título quebre onde o design quer,
 * não onde a largura da tela decidir.
 */
export default function MaskTitle({
  as: Tag = 'h2',
  lines = [],
  className = '',
  delay = 0,
  step = 110,
}) {
  const { ref, visible } = useReveal({ threshold: 0.2 })

  return (
    <Tag ref={ref} className={`mask-title ${visible ? 'is-visible' : ''} ${className}`.trim()}>
      {lines.map((line, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <span className="mask-title__line" key={i}>
          <span style={{ '--line-delay': `${delay + i * step}ms` }}>{line}</span>
        </span>
      ))}
    </Tag>
  )
}
