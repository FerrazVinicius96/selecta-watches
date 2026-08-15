# PROJECT.md

## 1. Escopo

Landing page para a **Selecta Watches**, loja de relógios de luxo originais.
Estética minimalista dark, com design avançado/sofisticado como diferencial
competitivo. Público-alvo: classe média alta/alta renda. Princípios de marca:
exclusividade e confiança. Entrega: vitrine institucional com catálogo em
destaque, captura de leads e painel administrativo simples — sem e-commerce
completo.

## 2. Requisitos Funcionais

- [RF001] Hero de impacto com identidade visual minimalista dark e tipografia
  sofisticada, transmitindo exclusividade já no primeiro scroll.
- [RF002] Seção institucional ("sobre") reforçando autenticidade, curadoria e
  confiança da marca.
- [RF003] Catálogo em destaque com relógios vindos do PostgreSQL via API
  Express (não hardcoded), permitindo trocar peças em vitrine sem alterar código.
- [RF004] Seção de prova social/confiança (selos de autenticidade, garantia,
  depoimentos).
- [RF005] Formulário de lead ("solicitar catálogo" / "falar com especialista")
  que persiste nome, contato e interesse no PostgreSQL via API Express.
- [RF006] Painel administrativo com login para: (a) visualizar leads
  capturados e (b) CRUD do catálogo de relógios.
- [RF007] Layout responsivo com atenção a micro-interações/animações sutis
  que reforcem a sensação de sofisticação (não é só estático).

## 3. Fora de Escopo (cortes negociados)

- Checkout, carrinho de compras e pagamento online — a página é vitrine +
  captura de leads, não e-commerce completo.
- Contas/login para clientes finais (o login existe só para o admin da loja).
- Suporte multi-idioma — apenas Português (BR) neste ciclo.
- Integração com meios de pagamento e logística de envio.

## 4. Composição do Time de Subagents

| Nome | Escopo/Responsabilidade | Model | Justificativa (custo/complexidade) |
| ---- | ----------------------- | ----- | ---------------------------------- |
| backend-architect | Schema PostgreSQL (catálogo, leads, admin), API Express em camadas, transações | Sonnet | Decisões de schema e contrato de API exigem raciocínio, não é boilerplate puro |
| frontend-designer | Landing page pública (hero, institucional, catálogo, prova social, formulário de lead) | Opus | Entregável que mais importa para o objetivo do projeto ("design avançado e sofisticado") — layout genérico mataria o propósito |
| admin-panel-dev | Painel admin (login, leads, CRUD do catálogo) | Haiku | Telas internas seguem padrão repetitivo, sem exigência de design sofisticado |
| qa-smoke | Validação funcional (smoke tests) ao final de cada ciclo | Haiku | Checklist objetivo, não cobertura exaustiva |

## 5. Decisões de Arquitetura

| Decisão | Motivo | Alternativa descartada |
| ------- | ------ | ---------------------- |
| Stack PERN (PostgreSQL, Express, React, Node.js) — padrão herdado de todo projeto do time | Convenção obrigatória definida no `CLAUDE.md`, independente do escopo | — |
| Arquitetura em camadas: Routes → Controllers → Services → Repositories | Padrão herdado, garante separação de responsabilidades no backend | — |
| SQL puro via queries parametrizadas, sem ORM | Padrão herdado | ORM (Prisma/Sequelize) |
| Transações (BEGIN/COMMIT/ROLLBACK) obrigatórias em operações multi-tabela | Padrão herdado | — |
| Catálogo dinâmico via banco (não hardcoded) | Permite ao lojista trocar peças em vitrine sem depender de deploy de código | Catálogo fixo no React (mais rápido, mas engessado) |
| Painel admin já no primeiro ciclo | Decisão do PO: leads e catálogo precisam ser geridos desde o início | Adiar para ciclo 2 (reduziria escopo do ciclo 1) |

## 6. Histórico de Ciclos

### Ciclo 1 — aprovado

## Checkpoint — Ciclo 1

**Entregue neste ciclo:**

- Backend (`backend/`): schema PostgreSQL (watches, leads, admins), migrations
  e seed, API Express em camadas (routes → controllers → services →
  repositories), SQL puro parametrizado, autenticação JWT para rotas admin.
  Endpoints: `GET /api/watches`, `POST /api/leads`, `POST /api/admin/login`,
  CRUD `/api/admin/watches`, `GET /api/admin/leads`.
- Frontend público (`frontend/`, RF001-RF005, RF007): landing page React +
  Vite consumindo o catálogo real da API (sem hardcode), formulário de lead
  persistindo via API, animações leves via CSS/IntersectionObserver,
  responsivo, validado no Chrome (desktop e mobile).
- Painel admin (`admin/`, RF006): React + Vite separado do frontend público,
  login com JWT, listagem de leads, CRUD completo de relógios, rotas
  protegidas com redirecionamento automático em token inválido/expirado.
- Smoke test de ponta a ponta (qa-smoke) com banco de dados real: migrations,
  seed, todos os endpoints (catálogo, leads, login, CRUD admin) validados com
  dados persistidos de verdade, não mocks.

**Como validar:**

1. `cd backend && npm install && npm run migrate && npm run seed && npm run dev`
   (sobe em `http://localhost:3001`, `.env` com `DATABASE_URL` correta).
2. `cd frontend && npm install && npm run dev` → acessar `http://localhost:5173`.
3. `cd admin && npm install && npm run dev` → acessar `http://localhost:5174`,
   login com `admin` / `selecta2026` (credenciais do seed).
4. Confirmar catálogo carregando na landing, lead enviado pelo formulário
   público aparecendo na tela de Leads do admin, e CRUD de relógios no admin
   refletindo na landing.

**Decisões técnicas tomadas:**

- Proxy `/api` no Vite do frontend público → evita problema de CORS e usa
  caminhos relativos iguais aos de produção atrás de reverse proxy.
- App admin separado do frontend público (`admin/` vs `frontend/`) → escopo
  interno vs. vitrine pública não deveriam compartilhar deploy nem estilo;
  descartado mesclar num único app.
- Sem biblioteca de animação (framer-motion/GSAP) no frontend público →
  IntersectionObserver + CSS entregam o efeito sutil desejado com bundle
  menor; velocidade de carregamento também reforça a percepção de luxo.
- Seed idempotente e migrations com runner próprio (sem node-pg-migrate) →
  poucas tabelas neste ciclo não justificam dependência extra.

**Pendências / riscos conhecidos:**

- `npm audit` no `admin/` apontou 2 vulnerabilidades moderadas em
  dependências — não bloqueiam funcionamento, mas vale rodar
  `npm audit fix` antes de qualquer deploy.
- Sem paginação na listagem de leads — aceitável no volume atual, revisar se
  crescer.
- Identidade visual (logo/paleta oficial) e conteúdo real do catálogo
  (fotos, preços) ainda não fornecidos pelo PO — ciclo 1 usa placeholders.
- Nota de processo: dois commits foram feitos por um subagent sem autorização
  neste ciclo e foram desfeitos (histórico de commits zerado, arquivos
  preservados). Nenhum commit deste projeto deve ser feito por subagents;
  commits só acontecem quando o PO pedir explicitamente.

**Próximo ciclo (proposto):**

- Identidade visual definitiva (logo, paleta) e conteúdo real do catálogo,
  a fornecer pelo PO.
- `npm audit fix` no admin.
- Melhorias incrementais no admin (paginação, busca/filtro) se o volume de
  dados justificar.

**Aguardando sua aprovação para prosseguir.**

### Ciclo 2 — aprovado

## Checkpoint — Ciclo 2

**Entregue neste ciclo:**

- Logo oficial ("SW" monograma + wordmark serifado, preto/branco) integrado
  no header do frontend público e na navbar do admin — substituiu a marca
  CSS abstrata usada como placeholder no Ciclo 1.
- Catálogo real: 3 peças fornecidas pelo PO substituíram os 6 placeholders
  (Bvlgari Diagono Chrono Ref. AC38TA R$15.000; Rolex Submariner Kermit Ref.
  16610LV Fullset 2008, sob encomenda; Tudor Black Bay Panda Ref. M79360N
  Completo 2024 R$32.000), com fotos reais fornecidas pelo PO.
- Suporte a peças "sob encomenda" (sem preço fechado): migration tornando
  `watches.price` nullable, validação de backend ajustada, formulário do
  admin com preço opcional, exibição "Sob consulta" no admin e na landing.
- Imagens do catálogo servidas pelo próprio backend (`/images/watches/...`,
  `express.static`) e proxy `/images` adicionado ao Vite do frontend, mesmo
  padrão já usado para `/api`.

**Como validar:**

1. `cd backend && npm run migrate && npm run dev` (schema já migrado e
   catálogo já resemeado neste ciclo — não é necessário rodar `npm run seed`
   de novo).
2. `cd frontend && npm run dev` → `http://localhost:5173`: logo no header,
   catálogo com as 3 peças reais, Rolex exibindo "Sob consulta".
3. `cd admin && npm run dev` → `http://localhost:5174`: logo na navbar,
   catálogo com preço vazio permitido/editável.

**Decisões técnicas tomadas:**

- Imagens do catálogo servidas como arquivos estáticos pelo backend (não um
  serviço externo tipo S3/Cloudinary) → volume baixo de imagens neste
  estágio, evita configurar/pagar por outro serviço agora; migrar para
  storage externo é um ciclo futuro se o catálogo crescer muito.
- Preço nullable em vez de um campo/flag separado "sob_encomenda" → menos
  uma coluna para manter sincronizada; `NULL` já significa "sem preço
  fechado" de forma natural tanto para o banco quanto para a apresentação.
- `npm audit fix` do `admin/` não aplicado neste ciclo — a correção exige
  major bump de `react-router-dom` (v6→v7, breaking change), decisão do PO
  foi adiar por ser severidade moderada em painel interno não exposto
  publicamente.

**Pendências / riscos conhecidos:**

- `react-router-dom` do admin com 2 vulnerabilidades moderadas conhecidas —
  requer upgrade major (v6→v7) para corrigir, adiado a pedido do PO.
- Sem paginação na listagem de leads — aceitável no volume atual, revisar se
  crescer.
- Catálogo tem só as 3 peças fornecidas até agora — PO pode enviar mais
  peças a qualquer momento para o time integrar.
- Rodapé do frontend ainda tem endereço/CNPJ fictícios (placeholder do
  Ciclo 1) — substituir por dados reais antes de qualquer publicação.

**Próximo ciclo (proposto):**

- PO decide: mais peças para o catálogo, dados reais de contato/endereço do
  rodapé, ou outra prioridade.

**Aguardando sua aprovação para prosseguir.**

## 7. Pendências e Riscos Ativos

- `react-router-dom` do admin com 2 vulnerabilidades moderadas — requer
  upgrade major (v6→v7), adiado a pedido do PO (ver Ciclo 2).
- Sem paginação na listagem de leads — aceitável no volume atual.
- Rodapé do frontend com endereço/CNPJ fictícios — substituir antes de
  qualquer publicação real.
- Catálogo tem só 3 peças reais até agora — aberto para o PO enviar mais.
- Nota de processo (Ciclo 1): dois commits foram feitos por um subagent sem
  autorização e foram desfeitos (histórico de commits zerado, arquivos
  preservados). Nenhum commit deste projeto deve ser feito por subagents;
  commits só acontecem quando o PO pedir explicitamente.
