import MaskTitle from './MaskTitle'
import Reveal from './Reveal'

/**
 * Abertura padrão de seção — o "ritmo" que se repete na página inteira:
 * eyebrow curto em maiúsculas → título grande com máscara por linha →
 * texto de apoio → um único CTA em pill.
 *
 * Centralizar esse padrão num componente evita que cada seção invente a sua
 * própria hierarquia, que é exatamente o que faz uma landing parecer genérica.
 */
export default function SectionIntro({
  eyebrow,
  lines,
  lede,
  cta,
  align = 'center',
  titleClass = 'display',
}) {
  return (
    <div className={`sec-intro ${align === 'start' ? 'sec-intro--start' : ''}`.trim()}>
      {eyebrow && (
        <Reveal as="p" className="eyebrow">
          {eyebrow}
        </Reveal>
      )}

      <MaskTitle lines={lines} className={titleClass} delay={120} />

      {lede && (
        <Reveal as="p" className="sec-intro__lede" delay={220}>
          {lede}
        </Reveal>
      )}

      {cta && (
        <Reveal className="sec-intro__cta" delay={320}>
          <a href={cta.href} className="btn">
            {cta.label}
          </a>
        </Reveal>
      )}
    </div>
  )
}
