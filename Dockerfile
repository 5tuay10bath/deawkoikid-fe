# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# use pnpm (swap to npm/yarn if you prefer)
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
# Vite -> creates /app/dist
# CRA  -> creates /app/build
RUN pnpm build

# ---------- Runtime stage ----------
FROM node:20-alpine AS runtime
WORKDIR /app

# tiny static file server with SPA fallback
RUN npm i -g serve

# pick Vite (dist) by default; for CRA pass --build-arg BUILD_DIR=build
ARG BUILD_DIR=dist
COPY --from=build /app/${BUILD_DIR} ./site

ENV PORT=3000
EXPOSE 3000

# bind to 0.0.0.0 inside container
CMD ["serve", "-s", "site", "-l", "tcp://0.0.0.0:3000"]
