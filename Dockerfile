# syntax=docker/dockerfile:1
FROM node:24-alpine AS builder

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@12.9.0 --activate

# Set working directory
WORKDIR /app

# Copy dependency files first (for better Docker layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Install dependencies with cache mount for faster rebuilds
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy source code (this invalidates cache only when source changes)
COPY . .

# Set production environment and build
ENV NODE_ENV=production
RUN pnpm run build

# Rebuild caddy with a patched Go toolchain and golang.org/x deps: the upstream
# binary lags behind Go security releases. Cross-compiles natively on the build
# host instead of running Go under emulation.
FROM --platform=$BUILDPLATFORM golang:1.27.2-alpine AS caddy-builder
ARG TARGETOS
ARG TARGETARCH
ARG CADDY_VERSION=v2.11.7
RUN go install github.com/caddyserver/xcaddy/cmd/xcaddy@v0.4.7
RUN CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH \
    xcaddy build $CADDY_VERSION --output /usr/bin/caddy \
    --replace golang.org/x/net=golang.org/x/net@v0.61.0 \
    --replace golang.org/x/crypto=golang.org/x/crypto@v0.58.0

FROM caddy:2.11.7-alpine AS runner

LABEL org.opencontainers.image.source="https://github.com/Mozart409/blocky-frontend" \
    org.opencontainers.image.url="https://github.com/Mozart409/blocky-frontend" \
    org.opencontainers.image.title="Frontend for Blocky a DNS proxy as ad-blocker"

# Upgrade Alpine packages to patch known vulnerabilities (e.g. zlib CVEs)
RUN apk upgrade --no-cache

# Replace the stock caddy binary with the patched build
COPY --from=caddy-builder /usr/bin/caddy /usr/bin/caddy

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
