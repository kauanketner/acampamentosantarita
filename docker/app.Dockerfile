# syntax=docker/dockerfile:1.7
ARG BUN_VERSION=1.2-alpine

FROM oven/bun:${BUN_VERSION} AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lockb* ./
COPY apps/app/package.json apps/app/
COPY packages/shared/package.json packages/shared/
COPY packages/ui/package.json packages/ui/
COPY packages/api-client/package.json packages/api-client/
COPY packages/config/package.json packages/config/
RUN bun install --frozen-lockfile || bun install

FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3002
WORKDIR /app/apps/app
CMD ["bun", "run", "dev"]

FROM deps AS build
COPY . .
WORKDIR /app/apps/app
RUN bun run build

FROM nginx:alpine AS prod
COPY --from=build /app/apps/app/dist /usr/share/nginx/html
COPY docker/nginx-spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 3002
