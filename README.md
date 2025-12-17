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

## Scripts disponíveis
| Script | O que faz |
| --- | --- |
| `pnpm dev` | Inicializa o Next.js em modo dev (`http://localhost:3000`). |
| `pnpm build` | Compila o Next para produção e gera artefatos SWC/tsc. |
| `pnpm start` | Executa o servidor Next já compilado. |
| `pnpm lint` / `pnpm lint:fix` | Executa ou corrige o ESLint configurado. |
| `pnpm test` | Roda `pnpm build` + `vitest run` em todas as suites (unit, e2e, components). |
| `pnpm test:unit` | Suite de testes unitários com Vitest. |
| `pnpm test:e2e` | Caso de ponta com Supertest (lembre-se: roda `pnpm build` antes de executar). |
| `pnpm test:components` | Testes de UI (Vitest + React Testing Library). |
| `pnpm test:coverage` | Gera cobertura com `@vitest/coverage-v8`. |

## Docker, banco e testes E2E
1. `docker-compose.yml` orquestra o MySQL 8, monta volumes e aplica o script `database/mysql/init.sql`.
2. O Prisma client (`src/shared/databases/prisma/index.ts`) aponta para `hubfyai` e o banco shadow `hubfyai_shadow`, que é usado durante os testes (confirme as credenciais antes de subir o container).
3. Os testes E2E (`src/tests/e2e/api.spec.ts`) rodam contra o Next.js completo e exigem `pnpm build` antes de `pnpm test:e2e`, pois carregam o servidor via Supertest.
4. Antes de subir os containers, valide se os hosts/usuários descritos em `docker-compose.yml`, `database/mysql/init.sql`, `src/shared/databases/prisma/index.ts` e `src/tests/e2e/api.spec.ts` estão sincronizados (inclusive o database `hubfyai_shadow` usado pelos testes).
> **Importante:** verifique também os arquivos abaixo para garantir que *usuário* e *senha* batem e estão consistentes em todos os lugares (`.env` incluído):
> - `docker-compose.yml`
> - `src/tests/e2e/api.spec.ts`
> - `src/shared/databases/prisma/index.ts`
> - `database/mysql/init.sql`
> - `.env`

Para seguir um passo a passo de inicialização no PowerShell, consulte `database/mysql-hubfyai-setup.md`, que descreve como subir o MySQL, criar `hubfyai_db` e `hubfyai_shadow`, conceder permissões e aplicar os scripts. Garanta que essas etapas batam com `database/mysql/init.sql`, `docker-compose.yml`, `.env` e `src/tests/e2e/api.spec.ts`, porque o exemplo usa a tabela `hubfyai_shadow` para gerar os testes E2E mencionados na spec e no shadow do Prisma.

## API e api.http
- A documentação em `API.md` complementa `/docs` e mostra os códigos HTTP retornados (por exemplo 400 e 401 para erros de validação/autenticação).
- `api.http` reúne requests de registro, login, `/api/auth/me`, CRUD de `/api/tasks` e `/api/health` com variáveis `{{baseUrl}}` para facilitar execuções rápidas (REST Client, Insomnia, etc).

## Imagens / capturas
- ![Login](imgs/task-login.png) - Tela de login.
- ![Cadastro](imgs/task-register.png) - Formulário de registro com validações.
- ![Dashboard](imgs/tasks.png) - Tabela do dashboard (filtros estão planejados).
- ![Criação de tarefa](imgs/tas-create.png) - Modal de criar tarefa.
- ![Exclusão](imgs/task-delete.png) - Modal de exclusão, texto quebrando corretamente.

## Automatizar pipeline (GitHub Actions)
1. Configure um workflow que rode `pnpm lint` e `pnpm test` em cada push/pull request.
2. Em commits prontos para produção, adicione etapas de `pnpm build` seguidas por deploy automático em Vercel ou Railway (use secrets `VERCEL_TOKEN`/`RAILWAY_TOKEN`).
3. Garanta que o pipeline valide lint → testes → build antes do deploy, conforme o fluxo descrito nos comandos acima.

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
**Documentação bônus:** a spec descrita acima também vive em API.md, que complementa o /docs com exemplos estáticos.

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
| Testes automatizados | ✅ | Suites unitárias completas, E2E auth/tasks e cobertura de componentes essenciais via React Testing Library. |
| Documentação da API (Swagger + README + API.md) | ƒo. | Anotações `@swagger`, `/docs` e o `API.md` estático com exemplos. |
| Filtros e paginação não expostos no dashboard | ✅ | TaskService já aceita `page`, `size`, `status`, `title` e agora os controles estão expostos no dashboard com Tarefa/Status. |
| Testes de UI (React Testing Library) nos componentes principais | ✅ | Componentes de formulários e dashboard têm testes React Testing Library cobrindo estados críticos, validando inputs e interações. |
| Diferenciais (refresh tokens, CI, deploy) | ✅ | Swagger + Docker entregues; GitHub Actions CI (`.github/workflows/ci.yml`) e fluxo de deploy dev já configurados; só faltam refresh tokens. |
| Automatizar pipeline (GitHub Actions) com `pnpm lint` e `pnpm test` | ✅ | Workflow `.github/workflows/ci.yml` roda `pnpm lint` e `pnpm test` em cada push/commit, mas pode ser estendido para pull requests com o mesmo job e variáveis de ambiente definidas. |

## Problemas conhecidos 🐞
- Nenhum problema crítico aberto no momento — filtros/paginação, cobertura UI e fluxos principais já foram atendidos, e o pipeline CI/CD permanece ativo para evitar regressões.

## Próximos passos 🚀
1. Implementar refresh tokens no fluxo completo de autenticação para renovar credenciais sem obrigar logout e simplificar a transição entre ambientes (dev/CI).
2 - Expandir cobertura de testes: React Testing Library (formulários/dashboard) + testes de integração para todos os endpoints (Supertest) + novos cenários E2E.

## Tecnologias usadas 🛠️
![Docker](https://img.shields.io/badge/docker-2496ED?style=flat&logo=docker&logoColor=white) ![Next.js](https://img.shields.io/badge/next.js-000000?style=flat&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/react-61DAFB?style=flat&logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=flat&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/tailwindcss-06B6D4?style=flat&logo=tailwind-css&logoColor=white) ![Prisma](https://img.shields.io/badge/prisma-2D3748?style=flat&logo=prisma&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-4479A1?style=flat&logo=mysql&logoColor=white) ![Vitest](https://img.shields.io/badge/vitest-fe4c3a?style=flat&logo=vitest&logoColor=white) ![Swagger](https://img.shields.io/badge/swagger-85EA2D?style=flat&logo=swagger&logoColor=black) ![PNPM](https://img.shields.io/badge/pnpm-F69220?style=flat&logo=pnpm&logoColor=white)
