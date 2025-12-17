# TaskFlow 🤖✨

Aplicação construída a partir do desafio descrito em `CHALLENGE.md` da Hubfy.ai, combinando Next.js App Router com API Routes, Prisma e um front focado em produtividade para o gerenciamento de tarefas.

## Menu delícia 🍽️
- Contexto do desafio
- Arquitetura
- Mapa do monorepo
- Stack principal
- Tecnologias & packages usados
- Como rodar
- Variáveis de ambiente
- API & Eventos
- Decisões e trade-offs
- Requisitos atendidos
- Problemas conhecidos
- Tempo investido
- Próximos passos
- Tecnologias usadas

## Contexto do desafio 🎯
Construí este sistema full stack para atender ao desafio completo da Hubfy.ai: API REST com autenticação JWT, persistência em MySQL, interface em Next.js/React, testes automatizados e documentação, tudo a partir da estrutura sugerida no `CHALLENGE.md` e mantendo a lógica de negócios bem separada (use cases, repositórios e entidades).

## Arquitetura 🧩
O projeto roda dentro de um único Next.js (v16) com App Router. O front-end ocupa `app/(auth)` e `app/(dashboard)` enquanto toda a camada de domínio está organizada em `shared`/`features`. A middleware `src/proxy.ts` valida tokens, rejeita acessos não autenticados e injeta os cabeçalhos `x-user-id` / `x-user-email` necessários para os use cases do backend.

```
Browser
   │
   ▼
[Next.js App Router (app/)]
   ├─ /auth/login, /auth/register → React Hook Form + Zod + AuthProvider + LocalStorage
   ├─ / (dashboard) → TanStack Query + modais de criação/edição + tabelas responsivas
   ├─ /api/health, /api/swagger → health check + docs geradas com swagger-jsdoc
   └─ /api/auth/*, /api/tasks/* → API Routes com use cases (auth, tasks) + Prisma
        │
        └─ proxy.ts valida JWT e injeta x-user-* antes de chegar aos handlers
             │
             └─ Prisma Client → MySQL 8 (docker/docker-compose ou ambiente local)
```

## Mapa do monorepo 🗺️
### Apps 🎡
| App | Tecnologia | Responsabilidade |
| --- | --- | --- |
| `src/app` | Next.js 16 + App Router | UI de autenticação, dashboard, documentação (`/docs`), API Routes (auth, tasks, swagger, health). |
| `src/tests` | Vitest (unit & e2e) | Suites de unitários para use cases e um teste E2E com Supertest rodando o servidor Next completo. |

### Pacotes 🎁
| Pacote | Conteúdo |
| --- | --- |
| `src/features` | Dividido em `auth` e `task`: serviços, hooks, schemas, DTOs, modais e componentes específicos. |
| `src/shared` | Camada cross-cutting: providers (Auth, Theme, QueryClient), helpers (token, localStorage, format), libs (axios, query client), constantes, componentes UI (shadcn + custom). |
| `src/shared/databases/prisma` | Prisma Client configurado com entidades, mappers, repositórios e fábricas para manter a Clean Architecture. |
| `database` | `schema.sql` + `mysql/init.sql` usados por MySQL/Docker. |
| `docker-compose.yml` | Serviço MySQL 8 com init script e volume persistente. |

## Stack principal 🛠️
- Next.js 16 com App Router e React 19 (TypeScript + Tailwind CSS + shadcn UI)
- Prisma Client + MySQL 8 (docker-compose + `schema.sql`)
- Autenticação JWT com `proxy.ts`, bcryptjs e policies de domínio
- Formularios com React Hook Form + Zod; gerenciamento de dados com TanStack Query
- Axios com interceptors, AuthProvider + React Query cache + toasts personalizados
- Vitest (unit e e2e) + Supertest + config separada para `unit` e `e2e`
- Swagger gerado via `swagger-jsdoc` e servido em `/docs`

## Tecnologias & packages usados 🧰
| Categoria | Tecnologias & packages |
| --- | --- |
| Monorepo | `pnpm`, `next`, `typescript`, `vitest`, `eslint`, `prettier` |
| Frontend | `react`, `tailwindcss`, `shadcn/ui`, `@tanstack/react-query`, `react-hook-form`, `zod`, `lucide-react`, `@radix-ui`, `clsx`, `tw-animate-css` |
| Backend | `next/api routes`, `prisma`, `mysql2`, `jsonwebtoken`, `bcryptjs`, `swagger-jsdoc`, `axios` |
| Infra | `docker-compose`, `mysql:8`, `dotenv`, `prisma migrate`, `prisma db push` |
| Testes | `vitest`, `@vitest/ui`, `@vitest/coverage-v8`, `supertest`, `faker`, `node:http` |
| Utilidades | `clsx`, `tailwind-merge`, `local-storage helper`, `query-client custom`, `toast provider`, `cn utility` |

## Como rodar ▶️
1. **Pré-requisitos**: Node.js >= 20, pnpm, Docker Desktop (para MySQL). Copie `.env.example` para `.env` e configure as credenciais.
2. **Banco de dados local** (recomendado): `docker compose up -d` (usa `database/mysql/init.sql` para criar bancos/users). Alternativamente use MySQL externo e atualize `DATABASE_URL`.
3. **Instale dependências**: `pnpm install`.
4. **Prepare Prisma**: `pnpm db:generate` seguido de `pnpm db:push` (migrations opcionais, use `pnpm db:migrate` para gerar).
5. **Rodar em dev**: `pnpm dev` → UI em `http://localhost:3000`, API em `/api`, docs interativas em `/docs`.
6. **Testes**: `pnpm test` (build + vitest). Também disponíveis `pnpm test:unit`, `pnpm test:e2e`, `pnpm test:coverage`.
7. **Lint/fmt**: `pnpm lint` / `pnpm lint:fix`.

## Variáveis de ambiente 🌦️
O `.env.example` lista as variáveis necessárias. Use valores reais no `.env`.

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=hubfyai
DB_PASSWORD=hubfyai
DB_NAME=hubfyai_db

DATABASE_URL="mysql://hubfyai:hubfyai@localhost:3306/hubfyai_db"
SHADOW_DATABASE_URL="mysql://root:root@localhost:3306/hubfyai_shadow"

JWT_SECRET=uma-chave-com-pelo-menos-32-caracteres
JWT_EXPIRES_IN=7d
```

## API & eventos 🔌
| Método | Rota | Descrição | Autenticação | Observações |
| --- | --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Registro com validação Zod e hash bcrypt | Pública | Retorna `message` + `user` |
| `POST` | `/api/auth/login` | Valida credenciais e gera JWT (`tokenJWT.generateToken`) | Pública | Responde `token` + `user` |
| `GET` | `/api/auth/me` | Retorna dados do usuário a partir do `x-user-id` injetado pelo proxy | Bearer | Use `AuthProvider` para cache via `useQuery` |
| `POST` | `/api/auth/logout` | Endpoint dummy que valida token e responde mensagem | Bearer | Tratamento via Axios interceptors |
| `GET` | `/api/tasks` | Lista paginada + filtros (status, título) para o usuário autenticado | Bearer | Query params: `page`, `size`, `title`, `status` |
| `POST` | `/api/tasks` | Cria tarefa com DTO/Zod | Bearer | Usa `createTaskSchema` + task factory |
| `PUT` | `/api/tasks/:id` | Atualiza task com `taskFactory.updateTask()` | Bearer | `x-user-id` garante isolamento |
| `DELETE` | `/api/tasks/:id` | Remove tarefa (cascade implícita) | Bearer | Retorna `message` |
| `GET` | `/api/health` | Health check simples para readiness | Pública | |
| `GET` | `/api/swagger` + `/docs` | Swagger UI baseado em `swagger-jsdoc` anotado nas rotas | Pública | Docs interativas com todos os endpoints |

**Eventos**: aplicação síncrona apenas (HTTP). Não há broker/filas/WebSocket neste MVP.

## Decisões e trade-offs 🧠
- **Clean Architecture:** API Routes apenas disparam factories que chamam use cases → repositórios Prisma e entidades. Facilita testes unitários e reuso.
- **Proxy `src/proxy.ts`:** valida o JWT antes de cada requisição (exceto `/auth/*`, `/docs`, `/api/swagger`, `/api/health`) e injeta `x-user-id`. Isso evita repetição de lógica em cada handler.
- **AuthProvider + React Query:** mantém token no `localStorage`, usa `useGetMe` para cache e limpa cache + token no logout. Trade-off: token em LocalStorage (não HttpOnly) e sem refresh tokens aborda o desafio de forma prática.
- **Forms:** React Hook Form + Zod garantem validação conforme schemas do backend, compartilhando regras (ex.: email válido, senha >= 8 caracteres).
- **TanStack Query:** dados de tarefas são cacheados, invalidados após mutações e não refetcham no foco (configuração customizada).
- **Sem microsserviços por ora:** toda a API vive no mesmo monorepo Next.js. Evita configuração extra, mas limita escala horizontal até se separar.

## Requisitos atendidos ✅
| Requisito | Status | Detalhes |
| --- | --- | --- |
| Autenticação JWT (registro/login/me/logout) | ✅ | Use cases com `bcryptjs` + `tokenJWT`, `proxy.ts` protege rotas. |
| CRUD de tarefas com validação e proteção | ✅ | Task factory + Prisma + DTOs + filtros básicos via query params. |
| MySQL e schema documentado | ✅ | `schema.prisma`, `database/schema.sql`, `docker/mysql/init.sql`. |
| Frontend (login/register/dashboard) | ✅ | Pages + modais, loading states, autenticação forçada pelo AuthProvider. |
| Organização (controllers/services/repos etc.) | ✅ | APIs → services/DTOs → use cases → repositórios. |
| Testes automatizados | ⚠️ | Suites unitárias completas, E2E limitado ao fluxo auth/tasks básico. |
| Documentação da API (Swagger + README) | ✅ | Anotações `@swagger` + `/docs`. Falta `API.md` estático. |
| Filtros/paginação na UI | ⚠️ | Backend suporta, mas UI ainda não expõe controles visíveis/pesquisa. |
| Diferenciais (refresh tokens, CI, deploy) | ⚠️ | Swagger + Docker entregues; refresh tokens e CI/CD/dev deploy pendentes. |

## Problemas conhecidos 🐞
- ⚠️ **Filtros e paginação não expostos no dashboard:** TaskService já aceita `page`, `size`, `status`, `title`, mas os controls não estão disponíveis ao usuário.
- ⚠️ **Cobertura E2E parcial:** existe apenas um cenário que cria usuário, login e CRUD limitado; falta cobertura de rota protegida e fluxos completos.
- ⚠️ **API.md não presente:** documentação interativa existe, mas o arquivo pedido ainda não foi escrito.
- ⚠️ **Sem refresh tokens ou proteção CSRF:** foco em JWT simples para cumprir o escopo imediato do desafio.
- ⚠️ **Testes de UI (React Testing Library) ausentes:** apenas use cases são testados; componentes e validações do formulário podem quebrar sem cobertura.

## Tempo investido ⏱️
| Atividade | Horas gastas (aproximado) |
| --- | --- |
| Arquitetura + backend (auth + tasks + Prisma) | 8h |
| Frontend (layouts, modais, providers) | 4h |
| Testes (unitários + e2e + helpers) | 4h |
| Documentação, ajustes e docker | 2h |
| **Total** | **18h** |

## Próximos passos 🚀
1. Colocar os filtros/pesquisa/paginação na UI de tarefas e alinhar com query params existentes.
2. Expandir cobertura de testes: React Testing Library (formulários/dashboard) + testes de integração para todos os endpoints (Supertest) + novos cenários E2E.
3. Gerar `API.md` estático e adicionar badge/cobertura de API no README.
4. Automatizar pipeline (GitHub Actions) com `pnpm lint`, `pnpm test`, e publicar em Vercel/Railway quando estiver pronto.

## Tecnologias usadas 🛠️
![Docker](https://img.shields.io/badge/docker-2496ED?style=flat&logo=docker&logoColor=white) ![Next.js](https://img.shields.io/badge/next.js-000000?style=flat&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/react-61DAFB?style=flat&logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=flat&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/tailwindcss-06B6D4?style=flat&logo=tailwind-css&logoColor=white) ![Prisma](https://img.shields.io/badge/prisma-2D3748?style=flat&logo=prisma&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-4479A1?style=flat&logo=mysql&logoColor=white) ![Vitest](https://img.shields.io/badge/vitest-fe4c3a?style=flat&logo=vitest&logoColor=white) ![Swagger](https://img.shields.io/badge/swagger-85EA2D?style=flat&logo=swagger&logoColor=black) ![PNPM](https://img.shields.io/badge/pnpm-F69220?style=flat&logo=pnpm&logoColor=white)
