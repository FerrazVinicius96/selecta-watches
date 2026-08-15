import { useEffect, useRef, useState } from 'react'

/**
 * Revela um elemento quando ele entra na viewport.
 *
 * Optamos por IntersectionObserver + CSS em vez de uma biblioteca de animação
 * (framer-motion, GSAP): o efeito desejado é sutil (fade + leve subida) e não
 * justifica ~50kb extras no bundle de uma landing page cuja primeira impressão
 * depende da velocidade de carregamento.
 */
export function useReveal({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(entry.target)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  return { ref, visible }
}
