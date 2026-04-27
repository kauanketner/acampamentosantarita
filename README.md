# Acampamento Santa Rita

Plataforma da comunidade Santa Rita — site público, app PWA e painel administrativo, com backend único em Bun + Fastify.

## Estrutura

Monorepo Turborepo + Bun workspaces.

```
acampamentosantarita/
├── apps/
│   ├── web/      # Next.js 15 — site público (acampamentosantarita.com.br)
│   ├── admin/    # React SPA — painel interno (anuntech.acampamentosantarita.com.br)
│   └── app/      # React PWA — comunidade (app.acampamentosantarita.com.br)
├── services/
│   └── api/      # Fastify 5 + Drizzle (api.acampamentosantarita.com.br)
└── packages/
    ├── db/           # Schema Drizzle compartilhado
    ├── shared/       # Zod schemas, tipos, constantes
    ├── ui/           # shadcn/ui compartilhado
    ├── api-client/   # Cliente tipado (gerado do OpenAPI)
    └── config/       # TS, Biome, Tailwind base
```

## Setup

```bash
# 1. Clonar e instalar
git clone git@github.com:kauanketner/acampamentosantarita.git
cd acampamentosantarita
bun install

# 2. Configurar .env
cp .env.example .env

# 3. Subir banco
docker compose up -d postgres

# 4. Migrations
bun run db:migrate

# 5. Dev (sobe os 4 serviços em paralelo)
bun run dev
```

## URLs (dev)

| Serviço | URL                        |
|---------|----------------------------|
| Site    | http://localhost:3000      |
| Admin   | http://localhost:3001      |
| App PWA | http://localhost:3002      |
| API     | http://localhost:3333      |
| Swagger | http://localhost:3333/docs |

## Documentação

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — visão técnica
- [docs/MODULES.md](docs/MODULES.md) — status dos módulos

## Stack

Fastify 5 · Drizzle ORM · Bun · PostgreSQL 16 · React 19 · Vite · TanStack Router/Query · shadcn/ui · Tailwind 4 · Next.js 15 · Better Auth · Asaas · Cloudflare R2 · Vite PWA · Zod · Biome · Turborepo
