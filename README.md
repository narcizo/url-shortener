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

A API sobe na porta `APP_PORT` (padrão 3000) e o Postgres na 5433.

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
