# syntax=docker/dockerfile:1
FROM node:24-alpine AS builder

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

# Set working directory
WORKDIR /app

# Copy dependency files first (for better Docker layer caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies with cache mount for faster rebuilds
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy source code (this invalidates cache only when source changes)
COPY . .

# Set production environment and build
ENV NODE_ENV=production
RUN pnpm run build

FROM caddy:2.11.2-alpine AS runner

LABEL org.opencontainers.image.source="https://github.com/Mozart409/blocky-frontend" \
    org.opencontainers.image.url="https://github.com/Mozart409/blocky-frontend" \
    org.opencontainers.image.title="Frontend for Blocky a DNS proxy as ad-blocker"

# Upgrade Alpine packages to patch known vulnerabilities (e.g. zlib CVEs)
RUN apk upgrade --no-cache

# Create non-root user for security
RUN adduser -D -u 1000 appuser

# Copy built assets
COPY --from=builder --chown=appuser:appuser /app/dist /app

# Copy Caddyfile
COPY --chown=appuser:appuser ./Caddyfile /etc/caddy/Caddyfile

# Switch to non-root user
USER appuser

EXPOSE 8002

# Healthcheck to ensure the application is responding
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8002/ || exit 1

CMD [ "caddy", "run", "--config", "/etc/caddy/Caddyfile" ]
