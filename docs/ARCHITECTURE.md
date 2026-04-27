# Arquitetura — Acampamento Santa Rita

## Visão geral

Quatro superfícies, um backend único.

```
                       ┌──────────────────────────┐
   acampamentosantarita.com.br ──▶│  apps/web (Next.js 15)   │──┐
                       └──────────────────────────┘  │
                       ┌──────────────────────────┐  │   GET /public/*
   anuntech.acampamentosantarita.com.br ──▶│ apps/admin (Vite + React)│──┤
                       └──────────────────────────┘  │   /v1/* (auth)
                       ┌──────────────────────────┐  │
   app.acampamentosantarita.com.br ──▶│ apps/app (Vite + PWA)    │──┤
                       └──────────────────────────┘  │
                                                      ▼
                                          ┌──────────────────────┐
                                          │ services/api         │
                                          │ Bun + Fastify 5      │
                                          │ Drizzle + Postgres   │
                                          └──────────────────────┘
                                                      │
                       ┌──────────────────────────┐  │
                       │ Asaas, R2, Resend,       │◀─┘
                       │ Web Push (VAPID)         │
                       └──────────────────────────┘
```

## Decisões

### Monorepo
Turborepo + Bun workspaces. `apps/*` (3 superfícies) + `services/*` (api) + `packages/*` (db, shared, ui, api-client, config).

### Stack
- **API:** Fastify 5 + Drizzle ORM + Bun + PostgreSQL 16. Type provider Zod.
- **Frontends React:** React 19 + Vite + TanStack Router + TanStack Query + shadcn/ui + Tailwind 4.
- **Site público:** Next.js 15 (App Router, SSR/SSG) — apenas conteúdo público via `/public/*`.
- **Auth:** Better Auth (cookie de sessão HttpOnly).
- **Pagamentos:** Asaas (PIX + cartão + boleto). Webhook em `/webhooks/asaas`.
- **Storage:** Cloudflare R2 (avatares, galeria, banners).
- **PWA:** Vite PWA Plugin (Workbox) + Web Push API.

### Modelagem central

Todo participante da comunidade é uma `persons` (entidade central). A partir dela:
- `health_profiles` (1:1) — atualizado em cada inscrição (snapshot guardado em `registration_health_snapshots`).
- `faith_profiles` (1:1) + `received_sacraments` (1:N).
- `emergency_contacts` (1:N, mín. 2, máx. 3).
- `camp_participations` (1:N) — histórico de acampamentos:
  - `is_legacy=true`: declarado pelo usuário (1º a 13º).
  - `is_legacy=false`: gerado pelo sistema quando a inscrição num evento numerado é confirmada.

### Fluxo de inscrição

1. Pessoa abre evento na PWA (precisa estar autenticada e com `profile_completed_at`).
2. Escolhe `roleIntent` (campista/equipista). API bloqueia "campista" se houver participação anterior naquele acampamento ou se `allow_first_timer=false`.
3. Revisão de saúde: `health_profile` é editado, `last_reviewed_at` atualizado, snapshot salvo.
4. Responde perguntas customizadas do evento (filtradas por audiência).
5. Cria `registrations` (status `pendente`). Se evento `is_paid`, gera `invoices` (type=`registration`).
6. Pessoa paga via Asaas (PIX/cartão/boleto) ou admin registra dinheiro.
7. Webhook do Asaas atualiza `payments` e `invoices.status`.
8. Admin aprova → status `aprovada`. Quando o evento começa, marca presença → `attended=true`.
9. Quando confirmada num acampamento numerado, cria `camp_participations` (`is_legacy=false`).

### Tribos — regra de mistério

Tribos só ficam visíveis para o membro **após o final do evento**.
- Admin atribui via `tribe_members`.
- Cada `tribe_member` tem `is_revealed_to_member`.
- Endpoint `POST /v1/tribes/event/:eventId/reveal-tribes` é o único que vira `true` (em massa).
- `GET /v1/tribes/me/current` na PWA respeita esse flag.

### PDV interno

Durante o evento, admin lança consumos na conta de cada pessoa.
- `pos_accounts` por (pessoa, evento). Status `aberta` → `fechada` → `paga`.
- Pessoa pode pagar parcial a qualquer momento (gera invoice tipo `pos`).
- Quando admin "fecha" a conta, gera invoice com saldo restante.

### Lojinha

Duas lojinhas distintas:
- **Site público:** catálogo `shop_products` → click abre WhatsApp (sem checkout).
- **Durante evento (PDV):** `pos_items` (cantina/lojinha/outros) lançados pelo admin.

## URLs (produção)

| Subdomínio                                 | Função      |
|--------------------------------------------|-------------|
| acampamentosantarita.com.br                | Site        |
| app.acampamentosantarita.com.br            | PWA         |
| anuntech.acampamentosantarita.com.br       | Admin       |
| api.acampamentosantarita.com.br            | API + Swagger |

## Deploy

VPS `5.161.209.4` via Coolify + Docker. Cada serviço tem seu Dockerfile em `docker/`.
