# Admin Panel - Selecta Watches

Painel administrativo interno para gerenciamento de leads capturados e catálogo de relógios da Selecta Watches.

## Requisitos

- Node.js 18+
- Backend rodando em `http://localhost:3001`

## Setup

1. Instalar dependências:
   ```bash
   npm install
   ```

2. (Opcional) Configurar URL da API via `.env`:
   ```bash
   cp .env.example .env
   # Editar .env conforme necessário (padrão: http://localhost:3001)
   ```

3. Rodar em desenvolvimento:
   ```bash
   npm run dev
   ```

   O painel estará disponível em `http://localhost:5174`.

4. Build para produção:
   ```bash
   npm run build
   ```

## Funcionalidades

### 1. Login
- Acesso ao painel requer autenticação
- Credenciais padrão vêm do seed do backend (`SEED_ADMIN_USERNAME`/`SEED_ADMIN_PASSWORD` no `.env`, ver [`backend/README.md`](../backend/README.md)) — troque-as antes de qualquer uso real
- JWT armazenado em localStorage e injetado automaticamente em todas as requisições

### 2. Leads
- Visualizar lista de leads capturados pelo formulário público
- Campos: ID, Nome, Contato (e-mail/telefone), Interesse, Data de Criação
- Auto-refresh via botão "Atualizar"

### 3. Catálogo de Relógios (CRUD)
- **Listar**: visualize todos os relógios cadastrados (ativos e inativos)
- **Criar**: formulário para adicionar novos relógios com campos: nome, marca, descrição, preço, URL de imagem, destaque, ativo
- **Editar**: clique em "Editar" em qualquer linha para modificar os dados
- **Deletar**: remova relógios com confirmação de segurança

## Estrutura

```
admin/
├── src/
│   ├── App.jsx                    # Roteador principal e navbar
│   ├── main.jsx                   # Entry point
│   ├── pages/
│   │   ├── Login.jsx              # Tela de autenticação
│   │   ├── Leads.jsx              # Listagem de leads
│   │   └── Watches.jsx            # CRUD de relógios
│   ├── components/
│   │   └── ProtectedRoute.jsx     # Wrapper para rotas autenticadas
│   ├── services/
│   │   └── api.js                 # Cliente Axios com interceptadores
│   └── styles/
│       └── global.css             # Estilos globais funcionalistas
├── index.html
├── vite.config.js
└── package.json
```

## Decisões Técnicas

- **Vite + React**: Build tool moderno, HMR rápido, bundle otimizado
- **React Router v6**: Roteamento declarativo e simple
- **Axios com interceptadores**: Injeta JWT automaticamente, redireciona para login em 401
- **localStorage**: Persistência de token e dados do usuário entre sessões
- **Sem biblioteca UI pesada**: CSS puro focado em funcionalidade, não estética
- **Componentes funcionais**: Hooks (useState, useEffect) para simplicidade

## API

O painel consome a API do backend em `http://localhost:3001`:

- `POST /api/admin/login` — autenticação
- `GET /api/admin/leads` — listar leads
- `GET /api/admin/watches` — listar relógios
- `POST /api/admin/watches` — criar relógio
- `PUT /api/admin/watches/:id` — atualizar relógio
- `DELETE /api/admin/watches/:id` — deletar relógio

Todos os endpoints exceto login exigem header `Authorization: Bearer <token>`.

## Tratamento de Erros

- **401 Unauthorized**: Redireciona automaticamente para login
- **Erros de rede**: Mensagens de erro claras ao usuário
- **Validação de banco**: Se o backend não estiver acessível, o painel mostrará "Erro ao carregar..." em vez de quebrar

## Próximos Passos

Após o backend estar rodando e o banco de dados configurado:

1. Rode as migrations: `cd backend && npm run migrate`
2. (Opcional) Execute o seed: `cd backend && npm run seed`
3. Inicie o backend: `cd backend && npm run dev`
4. Inicie o admin: `cd admin && npm run dev`
5. Acesse `http://localhost:5174` e autentique com as credenciais do seed
