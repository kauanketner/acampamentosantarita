# syntax=docker/dockerfile:1.7
ARG BUN_VERSION=1.2-alpine

FROM oven/bun:${BUN_VERSION} AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lockb* ./
COPY apps/admin/package.json apps/admin/
COPY packages/shared/package.json packages/shared/
COPY packages/ui/package.json packages/ui/
COPY packages/api-client/package.json packages/api-client/
COPY packages/config/package.json packages/config/
RUN bun install --frozen-lockfile || bun install

FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3001
WORKDIR /app/apps/admin
CMD ["bun", "run", "dev"]

FROM deps AS build
COPY . .
WORKDIR /app/apps/admin
RUN bun run build

# Servir o estático com Caddy/nginx — aqui só copiamos o dist.
FROM nginx:alpine AS prod
COPY --from=build /app/apps/admin/dist /usr/share/nginx/html
COPY docker/nginx-spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 3001
