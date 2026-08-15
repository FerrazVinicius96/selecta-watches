import { useEffect, useRef, useState } from 'react'
import { createLead } from '../api/client'
import Reveal from './Reveal'
import './LeadForm.css'

const PURPOSES = [
  'Solicitar o catálogo completo',
  'Falar com um especialista',
  'Consultar uma peça específica',
  'Avaliar / vender meu relógio',
]

const EMPTY = { name: '', contact: '', purpose: PURPOSES[0], message: '' }

export default function LeadForm({ prefill }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [apiError, setApiError] = useState(null)
  const messageRef = useRef(null)

  // Quando o visitante clica em "Consultar peça" no catálogo, o formulário já
  // chega contextualizado — menos atrito e o lead entra no banco qualificado.
  useEffect(() => {
    if (!prefill) return
    setStatus('idle')
    setForm((f) => ({
      ...f,
      purpose: 'Consultar uma peça específica',
      message: `Tenho interesse no ${prefill.brand} ${prefill.name}.`,
    }))
    messageRef.current?.focus({ preventScroll: true })
  }, [prefill])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Informe seu nome.'
    if (!form.contact.trim()) {
      next.contact = 'Informe um e-mail ou telefone.'
    } else {
      const v = form.contact.trim()
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
      const isPhone = v.replace(/\D/g, '').length >= 10
      if (!isEmail && !isPhone) next.contact = 'Use um e-mail válido ou telefone com DDD.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setApiError(null)
    if (!validate()) return

    setStatus('sending')
    try {
      // O backend guarda um único campo `interest`; consolidamos objetivo +
      // mensagem em um texto legível para quem lê os leads no painel.
      const interest = [form.purpose, form.message.trim()].filter(Boolean).join(' — ')
      await createLead({
        name: form.name.trim(),
        contact: form.contact.trim(),
        interest,
      })
      setStatus('success')
      setForm(EMPTY)
    } catch (err) {
      setStatus('error')
      setApiError(
        err.status === 0
          ? 'Não conseguimos falar com o servidor. Verifique sua conexão e tente novamente.'
          : err.message
      )
    }
  }

  return (
    <section className="lead section" id="contato">
      <div className="shell lead__grid">
        <div className="lead__intro">
          <Reveal as="p" className="eyebrow">
            Atendimento privado
          </Reveal>
          <Reveal as="h2" className="display lead__title" delay={80}>
            Uma conversa antes
            <br />
            de qualquer <em>compra</em>
          </Reveal>
          <Reveal as="p" className="lede lead__lede" delay={150}>
            Deixe seu contato e um especialista retorna em até 1 dia útil, com o
            catálogo completo e disponibilidade das peças do seu interesse. Sem
            automação, sem lista de disparo.
          </Reveal>

          <Reveal className="lead__meta" delay={220}>
            <div>
              <span className="lead__meta-label">Resposta média</span>
              <strong>4 horas úteis</strong>
            </div>
            <div>
              <span className="lead__meta-label">Atendimento</span>
              <strong>Seg a Sex, 9h – 19h</strong>
            </div>
          </Reveal>
        </div>

        <Reveal className="lead__panel" delay={120}>
          {status === 'success' ? (
            <div className="lead__success" role="status">
              <span className="lead__success-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h3>Recebemos seu contato</h3>
              <p>
                Um especialista da Selecta entrará em contato em até 1 dia útil.
                Enquanto isso, sinta-se à vontade para explorar a coleção.
              </p>
              <button type="button" className="btn" onClick={() => setStatus('idle')}>
                Enviar outra solicitação
              </button>
            </div>
          ) : (
            <form className="lead__form" onSubmit={handleSubmit} noValidate>
              <Field
                id="lead-name"
                label="Nome"
                value={form.name}
                onChange={(v) => update('name', v)}
                error={errors.name}
                autoComplete="name"
                placeholder="Como devemos chamá-lo"
              />

              <Field
                id="lead-contact"
                label="E-mail ou telefone"
                value={form.contact}
                onChange={(v) => update('contact', v)}
                error={errors.contact}
                autoComplete="email"
                placeholder="seunome@email.com ou (11) 90000-0000"
              />

              <div className="field">
                <label className="field__label" htmlFor="lead-purpose">
                  Objetivo
                </label>
                <select
                  id="lead-purpose"
                  className="field__input field__select"
                  value={form.purpose}
                  onChange={(e) => update('purpose', e.target.value)}
                >
                  {PURPOSES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="lead-message">
                  Mensagem <span className="field__optional">(opcional)</span>
                </label>
                <textarea
                  id="lead-message"
                  ref={messageRef}
                  className="field__input field__textarea"
                  rows={3}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  placeholder="Conte qual peça procura, faixa de investimento ou dúvida."
                />
              </div>

              {apiError && (
                <p className="lead__error" role="alert">
                  {apiError}
                </p>
              )}

              <button
                type="submit"
                className="btn btn--solid lead__submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Enviando…' : 'Solicitar contato'}
              </button>

              <p className="lead__privacy">
                Seus dados são usados apenas para este atendimento. Não
                compartilhamos com terceiros.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

function Field({ id, label, value, onChange, error, ...rest }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="field__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error && <span className="field__error">{error}</span>}
    </div>
  )
}
