# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

# Install dependencies using cache
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# ---------- Runtime stage ----------
FROM node:20-alpine AS runtime
WORKDIR /app

RUN npm i -g serve

ARG BUILD_DIR=dist
COPY --from=build /app/${BUILD_DIR} ./site

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV PORT=3000
EXPOSE 3000

CMD ["/entrypoint.sh"]
