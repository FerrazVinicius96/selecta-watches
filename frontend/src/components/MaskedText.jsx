import { useReveal } from '../hooks/useReveal'

/**
 * Título com "line reveal": cada linha vive dentro de uma máscara
 * (overflow: hidden) e sobe de baixo para cima quando entra na viewport.
 *
 * Recebe as linhas como array porque a quebra precisa ser decidida no
 * conteúdo (e não pelo navegador): a máscara é aplicada por linha, então
 * cada item do array é uma linha visual do título.
 */
export default function MaskedText({
  as: Tag = 'h2',
  lines = [],
  delay = 0,
  step = 110,
  className = '',
  ...rest
}) {
  const { ref, visible } = useReveal()

  return (
    <Tag
      ref={ref}
      className={`mask ${visible ? 'is-visible' : ''} ${className}`.trim()}
      {...rest}
    >
      {lines.map((line, i) => (
        <span className="mask__line" key={i}>
          <span
            className="mask__line-in"
            style={{ transitionDelay: `${delay + i * step}ms` }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}
