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
      // Sem margem negativa embaixo: ela criava uma "zona morta" no fim da
      // página, e o último bloco (rodapé) nunca chegava a disparar. O ponto de
      // gatilho já é controlado pelo threshold (15% do elemento visível).
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  return { ref, visible }
}
