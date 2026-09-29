# URL Shortener

API para encurtar URLs, feita com Nest 12, PostgreSQL e MikroORM.

## Stack

- Nest 12 (ESM), bun, Node 22
- PostgreSQL 17 via Docker Compose
- MikroORM 7 com migrations
- oxlint, Prettier, Vitest
- GitHub Actions (lint, formatação, build, testes unit e e2e)
- Bruno para as requests (coleção em `bruno/`)

## Rodando localmente

1. `cp .env.example .env` e defina `PSQL_PASSWORD`.
2. `bun install`
3. `docker compose up -d --wait`
4. `bun run migration:up`
5. `bun run start:dev`

A API sobe na porta `APP_PORT` (padrão 3000) e o Postgres na 5433. `APP_BASE_URL` define a origem dos links curtos (padrão `http://localhost:APP_PORT`).

## Scripts

| Script | O que faz |
| --- | --- |
| `start:dev` | Sobe a app em watch mode |
| `build` | Compila para `dist/` |
| `lint` / `lint:fix` | oxlint (+ Prettier no fix) |
| `test` / `test:e2e` | Testes unitários / e2e (e2e precisa do banco) |
| `migration:create` / `up` / `down` | Migrations do MikroORM |

Rode sempre com `bun run`, que carrega o `.env`.

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/health` | Status da app e do banco (200 ou 503) |
| `POST` | `/api/v1/data/shorten` | Body `{ "longUrl": "https://..." }` → `201 { code, shortUrl, longUrl }`. Mesma URL devolve o mesmo código |
| `GET` | `/:code` | `302` para a URL original, `404` se não existir, `400` se o código for inválido |

## Geração do código curto

Segue o capítulo "Design a URL Shortener" do *System Design Interview* (Alex Xu):

- **Estimativa:** 100M URLs/dia × 365 × 10 anos ≈ 365 bilhões de registros.
- **Tamanho do código:** com `[0-9a-zA-Z]` (62 chars), o menor `n` com `62^n ≥ 365 bi` é 7 (`62^7 ≈ 3,5 tri`).
- **Estratégia:** base62 sobre um ID único, em vez de hash + resolução de colisão. Não há colisões e não precisa checar o banco a cada tentativa.
- **Fluxo do POST:** a URL já existe? Devolve o código existente. Senão, insere; o Postgres gera o ID, que é convertido para base62.
- **Exatamente 7 chars:** a sequence de identity vai de `62^6` (`"1000000"`) a `62^7 - 1` (`"ZZZZZZZ"`), ≈ 3,46 tri de IDs.
- **O código não é armazenado:** ele é o próprio ID em base62. O GET decodifica o código e busca pela PK.
- **302 em vez de 301:** toda requisição passa pelo servidor, o que abre espaço para analytics; o custo é mais carga.

### Trade-offs e próximos passos

- **IDs sequenciais são enumeráveis.** Para esconder o volume, dá para embaralhar o ID antes de codificar (bijeção em `[62^6, 62^7)`).
- **Um único Postgres é o gerador de IDs.** Em escala, trocaria por um gerador distribuído (ex.: ranges pré-alocados por instância).
- **Dedup por `long_url` não é atômica.** Duas requests simultâneas com a mesma URL podem gerar dois códigos. É inofensivo; um índice único resolveria.
- **Leitura ≫ escrita:** cache (Redis) na frente do `GET /:code` e réplicas de leitura.
- **Não implementado:** rate limit no POST, expiração e contagem de cliques.
