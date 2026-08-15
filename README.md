# Selecta Watches

Plataforma web para a **Selecta Watches**, loja de relógios de luxo originais: landing page institucional com catálogo dinâmico e captura de leads, painel administrativo para gestão de peças e leads, e API própria com PostgreSQL.

Projeto full-stack construído em **PERN** (PostgreSQL, Express, React, Node.js), com SQL puro (sem ORM) e arquitetura em camadas no backend.

## Visão geral

O produto é composto por três aplicações independentes que compartilham uma única API:

| Aplicação | Descrição | Stack | Porta (dev) |
| --- | --- | --- | --- |
| [`frontend/`](./frontend) | Landing page pública — hero, institucional, catálogo em destaque, prova social e formulário de lead | React + Vite | `5173` |
| [`admin/`](./admin) | Painel interno — login, gestão de leads capturados e CRUD do catálogo | React + Vite | `5174` |
| [`backend/`](./backend) | API REST — catálogo, leads e autenticação de admin | Express + PostgreSQL | `3001` |

```
                 ┌────────────────────┐
   visitante ───▶│   frontend (5173)  │──┐
                 └────────────────────┘  │
                                          ▼
                 ┌────────────────────┐  ┌──────────────────────┐      ┌──────────────┐
   admin    ────▶│    admin (5174)    │─▶│   backend API (3001) │─────▶│  PostgreSQL  │
                 └────────────────────┘  └──────────────────────┘      └──────────────┘
```

## Funcionalidades

- **Catálogo dinâmico**: peças do catálogo vêm do PostgreSQL via API — trocar a vitrine não exige deploy de código.
- **Peças "sob encomenda"**: preço é opcional; quando ausente, a interface exibe "Sob consulta".
- **Captura de leads**: formulário público ("solicitar catálogo" / "falar com especialista") persiste nome, contato e interesse no banco.
- **Painel administrativo**: login com JWT, listagem de leads e CRUD completo do catálogo (criar, editar, excluir, marcar destaque/ativo).
- **Design autoral**: estética minimalista dark, tipografia sofisticada e micro-animações discretas (sem bibliotecas de animação — CSS + `IntersectionObserver`).
- **Responsivo**: validado em desktop e mobile.

## Stack e decisões de arquitetura

- **PERN sem ORM**: todas as queries são SQL puro parametrizado, organizadas em `routes → controllers → services → repositories`. Elimina a camada de abstração de um ORM em troca de controle total sobre as queries — trade-off aceito pela equipe para um domínio pequeno (3 tabelas).
- **Autenticação**: JWT simples (sem refresh token) para o admin — único perfil de usuário, expiração de 8h é suficiente para uso interno.
- **Imagens do catálogo**: servidas como arquivos estáticos pelo próprio backend (`/images/watches/...`), evitando dependência de um serviço externo de storage neste estágio.
- **Migrations com runner próprio**: scripts SQL numerados aplicados por `backend/db/migrate.js`, sem dependência de uma ferramenta de terceiros — poucas tabelas e migrations raras não justificam a dependência extra.

## Como rodar localmente

Pré-requisitos: Node.js 18+ e uma instância PostgreSQL acessível.

```bash
# 1. Backend (API + banco)
cd backend
npm install
cp .env.example .env      # ajuste DATABASE_URL com suas credenciais reais
npm run migrate
npm run seed               # cria catálogo inicial e usuário admin padrão
npm run dev                 # http://localhost:3001

# 2. Frontend público (em outro terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173

# 3. Painel admin (em outro terminal)
cd admin
npm install
npm run dev                 # http://localhost:5174
```

Instruções detalhadas de configuração (variáveis de ambiente, endpoints da API, estrutura de pastas) estão no README de cada aplicação: [`backend/README.md`](./backend/README.md), [`frontend/README.md`](./frontend/README.md), [`admin/README.md`](./admin/README.md).

## Processo de desenvolvimento

Este projeto foi construído por um time de subagents do Claude Code (backend, frontend, admin e QA), coordenados em ciclos incrementais com checkpoints de aprovação. O histórico completo de decisões, requisitos e ciclos está documentado em [`PROJECT.md`](./PROJECT.md).

## Licença

Projeto proprietário, desenvolvido sob encomenda para a Selecta Watches.
