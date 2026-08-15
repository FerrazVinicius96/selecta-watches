import { useReveal } from '../hooks/useReveal'

/**
 * Wrapper declarativo do useReveal. `delay` permite escalonar elementos
 * irmãos (stagger), o que dá a sensação de "composição" em vez de tudo
 * aparecendo de uma vez.
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  className = '',
  children,
  ...rest
}) {
  const { ref, visible } = useReveal()

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms`, ...(rest.style || {}) }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
