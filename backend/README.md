# Selecta Watches — Backend

API REST em Express + PostgreSQL para o catálogo de relógios, captura de leads e autenticação do painel admin. SQL puro parametrizado (sem ORM), organizado em camadas.

## Stack

- Node.js + Express
- PostgreSQL (driver `pg`, sem ORM)
- JWT (`jsonwebtoken`) para autenticação de admin
- `bcryptjs` para hash de senha

## Arquitetura

```
src/
├── routes/          # definição de endpoints
├── controllers/      # parsing de request/response
├── services/         # regras de negócio e validação
├── repositories/      # acesso ao banco (SQL puro parametrizado)
├── middleware/        # auth (JWT) e tratamento central de erros
└── db/pool.js          # pool único de conexão Postgres

db/
├── migrations/        # scripts SQL numerados
├── migrate.js          # runner de migrations (idempotente)
└── seed.js              # popula catálogo inicial e admin padrão
```

Nenhuma operação atual toca mais de uma tabela na mesma transação, mas a separação em camadas permite que um service futuro abra uma transação (`BEGIN`/`COMMIT`/`ROLLBACK`) sem reescrever os repositories.

## Setup

```bash
npm install
cp .env.example .env
```

Edite o `.env` com a `DATABASE_URL` real do seu Postgres local:

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/selecta_watches
PORT=3001
JWT_SECRET=troque-este-segredo-em-producao
JWT_EXPIRES_IN=8h
CORS_ORIGIN=http://localhost:5173
SEED_ADMIN_USERNAME=admin
SEED_ADMIN_PASSWORD=escolha-uma-senha
```

```bash
npm run migrate    # aplica o schema
npm run seed         # cria catálogo inicial e usuário admin (idempotente)
npm run dev           # sobe em http://localhost:3001, com reload automático
```

## Endpoints

### Públicos

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/health` | Health check |
| GET | `/api/watches` | Catálogo ativo (aceita `?featured=true`) |
| POST | `/api/leads` | Cria um lead (`name`, `contact`, `interest`) |
| POST | `/api/admin/login` | Autentica admin, retorna JWT |

### Protegidos (`Authorization: Bearer <token>`)

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/admin/watches` | Lista todo o catálogo (inclui inativos) |
| POST | `/api/admin/watches` | Cria relógio |
| PUT | `/api/admin/watches/:id` | Atualiza relógio |
| DELETE | `/api/admin/watches/:id` | Remove relógio |
| GET | `/api/admin/leads` | Lista leads capturados |

`price` aceita `null` para peças sem preço fechado ("sob encomenda") — a interface exibe "Sob consulta" nesse caso.

## Imagens do catálogo

Servidas como arquivos estáticos em `/images/...`, a partir de `backend/public/images/`. Para adicionar uma peça nova, salve a imagem em `public/images/watches/` e referencie o caminho relativo (ex: `/images/watches/nome-da-peca.png`) no campo `image_url`.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Sobe o servidor com reload automático |
| `npm start` | Sobe o servidor em modo produção |
| `npm run migrate` | Aplica migrations pendentes |
| `npm run seed` | Popula catálogo inicial e admin padrão (idempotente) |
