# API.md

Documentação completa dos endpoints disponíveis no backend do TaskFlow. Todas as rotas descritas abaixo estão implementadas como API Routes do Next.js (src/app/api) e usam o proxy (`src/proxy.ts`) para validar o JWT e injetar os cabeçalhos `x-user-id`/`x-user-email`.

## Autenticação

### `POST /api/auth/register`
- **Descrição:** Cria um usuário novo com validação de e-mail único e senha forte.
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "SenhaForte123"
  }
  ```
- **Resposta 201:** Inclui `message` e `user` (id, name, email).
  ```json
  {
    "message": "Usuário criado com sucesso",
    "user": {
      "id": "uuid-v4",
      "name": "João Silva",
      "email": "joao@example.com"
    }
  }
  ```
- **Erros:** 400 quando o body é inválido ou e-mail já existe, 500 para erros inesperados.

### `POST /api/auth/login`
- **Descrição:** Verifica credenciais e retorna JWT.
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "joao@example.com",
    "password": "SenhaForte123"
  }
  ```
- **Resposta 200:** Token válido mais dados do usuário.
  ```json
  {
    "token": "<token-jwt>",
    "user": {
      "id": "uuid-v4",
      "name": "João Silva",
      "email": "joao@example.com"
    }
  }
  ```
- **Erros:** 401 para credenciais inválidas, 400 para payload mal formado, 500 caso o bcrypt falhe.

### `GET /api/auth/me`
- **Descrição:** Retorna os dados do usuário extraídos do cabeçalho `x-user-id` (injetado pelo proxy após validar o JWT).
- **Headers obrigatórios:** `Authorization: Bearer <token>` (triggers proxy), `x-user-id`, `x-user-email`.
- **Resposta 200:**
  ```json
  {
    "user": {
      "id": "uuid-v4",
      "name": "João Silva",
      "email": "joao@example.com"
    }
  }
  ```
- **Erros:** 401 quando o cabeçalho `x-user-id` não existe (token inválido), 500 em caso de problema com o banco.

### `POST /api/auth/logout`
- **Descrição:** Endpoint simples que verifica se o usuário está autenticado e retorna mensagem de logout.
- **Headers:** `Authorization: Bearer <token>`
- **Resposta 200:** `{ "message": "Logout realizado com sucesso" }`
- **Erros:** 401 quando não autenticado.

## Tarefas (`/api/tasks`)

Todas as rotas de tarefas usam o token Bearer. O proxy garante que `x-user-id` e `x-user-email` sejam definidos antes dos handlers. Os DTOs e schemas (Zod) garantem validação de title/description/status.

### `GET /api/tasks`
- **Descrição:** Lista paginada de tarefas do usuário.
- **Headers:** Autenticação Bearer + cabeçalhos `x-user-*`.
- **Query Parameters:**
  - `page` (opcional, default `1`)
  - `size` (opcional, default `10`)
  - `title` (opcional, busca parcial)
  - `status` (opcional, `PENDING`, `IN_PROGRESS`, `COMPLETED`)
- **Resposta 200:**
  ```json
  {
    "items": [
      {
        "id": "uuid",
        "userId": "uuid",
        "title": "Implementar login",
        "description": "Descrição",
        "status": "PENDING",
        "createdAt": "2025-12-16T...",
        "updatedAt": "2025-12-16T..."
      }
    ],
    "total": 42,
    "page": 1,
    "size": 10
  }
  ```
- **Erros:** 401 quando o token está ausente/inválido.

### `POST /api/tasks`
- **Descrição:** Cria nova tarefa para o usuário autenticado.
- **Headers:** `Authorization`, `Content-Type: application/json`, `x-user-id`.
- **Body:**
  ```json
  {
    "title": "Nova tarefa",
    "description": "Detalhes",
    "status": "PENDING"
  }
  ```
- **Resposta 201:** `{ "task": { ... } }` com dados completos (timestamps, status, userId).
- **Validação:** `title` obrigatório, `status` enum (Zod schema shared).
- **Erros:** 400 para entrada inválida, 401 para não autenticado.

### `PUT /api/tasks/:id`
- **Descrição:** Atualiza campos de tarefa existente (title, description, status).
- **Headers:** `Authorization`, `x-user-id`.
- **Path Parameters:**
  - `id`: ID da tarefa.
- **Body (qualquer combinação):**
  ```json
  {
    "title": "Título atualizado",
    "description": "Nova descrição",
    "status": "COMPLETED"
  }
  ```
- **Resposta 200:** `{ "task": { ... } }`
- **Erros:** 401 quando o token estiver inválido, 404 se a tarefa não pertencer ao usuário (tratamento via task factory + repositório).

### `DELETE /api/tasks/:id`
- **Descrição:** Remove tarefa do usuário autenticado.
- **Headers:** `Authorization`, `x-user-id`.
- **Path Parameters:** `id`
- **Resposta 200:** `{ "message": "Task deleted successfully" }`
- **Erros:** 401/404 conforme validações do repositório.

## Infra & suporte

### `GET /api/health`
- **Descrição:** Endpoint simples para readiness. Retorna `{ "status": "ok" }`.
- **Auth:** Pública.

### `GET /api/swagger`
- **Descrição:** Gera a spec OpenAPI usando `swagger-jsdoc`. Serve os dados consumidos pela UI em `/docs`.
- **Auth:** Pública.

## Observações Gerais
- Todos os endpoints protegidos dependem do middleware `src/proxy.ts`, que valida os tokens JWT gerados via `shared/helpers/token.ts` (alguns valores controlados por `.env`: `JWT_SECRET`, `JWT_EXPIRES_IN`).
- Os handlers nunca leem diretamente o token; eles confiam no cabeçalho `x-user-id` injetado pelo proxy.
- As mensagens de erro seguem o padrão `NextResponse.json({ error: ... })` com `status` apropriado (401, 400, 500).
