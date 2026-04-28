# Acampamento Santa Rita — Site

Site público da comunidade. Next.js 15 + Tailwind 4. Standalone — não depende
do monorepo.

## Rodar

```bash
bun install
bun run dev
```

Abra http://localhost:3000

## Build pra produção

```bash
bun run build
bun run start
```

## Deploy

Funciona em qualquer host de Node.js / Next.js: Vercel, Netlify, Coolify, Fly,
Railway. Pra Vercel: `vercel --prod` (depois de instalar a CLI). Sem variáveis
de ambiente necessárias — o site renderiza com dados seed embutidos quando a
API não está disponível.

## Estrutura

```
site/
├── app/             # Rotas (App Router)
├── components/
│   ├── home/        # Seções da homepage
│   ├── layout/      # Header, Footer, MobileMenu
│   └── ui/          # Primitivos (Button, Card, Logo, etc.)
├── lib/             # Utilitários (api, format, types, cn)
├── public/          # Assets estáticos
└── ...configs
```

## API

O site tem suporte a buscar conteúdo de uma API pública em
`NEXT_PUBLIC_API_URL` (`/upcoming-events`, `/event/:slug`, `/gallery`,
`/gallery/:slug`, `/faq`, `/contact`). Tudo com fallback gracioso — se a API
não responde em 5s, renderiza dados seed.

Pra apontar pra uma API:
```bash
NEXT_PUBLIC_API_URL=https://api.exemplo.com bun run dev
```
