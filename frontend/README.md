# Selecta Watches — Frontend

Landing page pública da Selecta Watches: hero, seção institucional, catálogo em destaque, prova social e formulário de captura de leads. React + Vite, com design autoral (sem template/UI kit).

## Stack

- React + Vite
- CSS puro (design system em `src/styles/global.css`, sem framework de UI)
- Animações via CSS + `IntersectionObserver` (sem biblioteca externa — ver [`src/hooks/useReveal.js`](./src/hooks/useReveal.js))

## Estrutura

```
src/
├── api/client.js         # único ponto de contato com a API (fetch)
├── components/            # Header, Hero, Manifesto, Catalog, WatchCard, Trust, LeadForm, Footer
├── hooks/useReveal.js       # animação de entrada por scroll
├── utils/format.js           # formatação de preço (BRL), com fallback "Sob consulta"
└── styles/global.css          # tokens de design (cores, tipografia, espaçamento)
```

## Setup

```bash
npm install
npm run dev     # http://localhost:5173
```

Requer o [backend](../backend) rodando em `http://localhost:3001` (ou outra URL configurada via `VITE_API_PROXY_TARGET`, ver [`vite.config.js`](./vite.config.js)).

Em desenvolvimento, o Vite faz proxy de `/api` e `/images` para o backend — o navegador enxerga tudo na mesma origem (`localhost:5173`), eliminando problemas de CORS e mantendo o código com caminhos relativos, iguais aos de produção atrás de um reverse proxy.

## Build

```bash
npm run build     # gera dist/
npm run preview    # serve o build de produção localmente
```

## Decisões de design

- **Paleta**: quase-preto quente (`#08080a`) com um único acento em champanhe (`#c8a96a`) — contenção de cor para reforçar a sensação de exclusividade, evitando o efeito "banner promocional" de preto puro.
- **Fotos do catálogo em dessaturação sutil (CSS)**: uniformiza a vitrine mesmo quando as fotos cadastradas pelo lojista têm qualidade/iluminação variável.
- **`prefers-reduced-motion`** desliga todas as animações; navegação com skip-link, labels e `aria-*` no rotator de depoimentos.
