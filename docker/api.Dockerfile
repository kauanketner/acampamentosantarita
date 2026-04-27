# syntax=docker/dockerfile:1.7
ARG BUN_VERSION=1.2-alpine

# ---------- base ----------
FROM oven/bun:${BUN_VERSION} AS base
WORKDIR /app
ENV NODE_ENV=production

# ---------- deps ----------
FROM base AS deps
COPY package.json bun.lockb* ./
COPY services/api/package.json services/api/
COPY packages/db/package.json packages/db/
COPY packages/shared/package.json packages/shared/
RUN bun install --frozen-lockfile || bun install

# ---------- dev ----------
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
WORKDIR /app
EXPOSE 3333
CMD ["bun", "--hot", "run", "services/api/src/index.ts"]

# ---------- build ----------
FROM deps AS build
COPY . .
RUN bun build services/api/src/index.ts --target=bun --outdir=services/api/dist

# ---------- prod ----------
FROM base AS prod
COPY --from=build /app/services/api/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
EXPOSE 3333
CMD ["bun", "run", "dist/index.js"]
