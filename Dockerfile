FROM node:24 AS builder

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

# Set working directory
WORKDIR /app

# Copy dependency files first (for better Docker layer caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies (this layer will be cached if package files don't change)
RUN pnpm install --frozen-lockfile

# Copy source code (this invalidates cache only when source changes)
COPY . .

# Set production environment and build
ENV NODE_ENV=production
RUN pnpm run build

FROM caddy:2.10.2-alpine AS runner

LABEL org.opencontainers.image.source="https://github.com/Mozart409/blocky-frontend" \
    org.opencontainers.image.url="https://github.com/Mozart409/blocky-frontend" \
    org.opencontainers.image.title="Frontend for Blocky a DNS proxy as ad-blocker" 

COPY --from=builder /app/dist /app

COPY ./Caddyfile ./Caddyfile

EXPOSE 8002

# Healthcheck to ensure the application is responding
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8002/ || exit 1

CMD [ "caddy", "run", "--config", "./Caddyfile" ]
