# syntax=docker/dockerfile:1.7
ARG BUN_VERSION=1.2-alpine

FROM oven/bun:${BUN_VERSION} AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lockb* ./
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
COPY packages/ui/package.json packages/ui/
COPY packages/config/package.json packages/config/
RUN bun install --frozen-lockfile || bun install

FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
WORKDIR /app/apps/web
CMD ["bun", "run", "dev"]

FROM deps AS build
COPY . .
WORKDIR /app/apps/web
RUN bun run build

FROM base AS prod
COPY --from=build /app/apps/web/.next ./apps/web/.next
COPY --from=build /app/apps/web/public ./apps/web/public
COPY --from=build /app/apps/web/package.json ./apps/web/
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
WORKDIR /app/apps/web
CMD ["bun", "run", "start"]
