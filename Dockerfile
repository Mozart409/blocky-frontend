# Stage 1: Build the application
FROM node:22 AS builder

RUN corepack enable

RUN corepack prepare pnpm@10.6.4 --activate

# Files required by pnpm install
COPY package.json pnpm-lock.yaml ./

# PRODUCTION BUILD
RUN pnpm install 
# Bundle app source
COPY . .

ENV NODE_ENV=production
RUN echo "################"
RUN echo $NODE_ENV
RUN echo "################"
RUN pnpm run build

# Stage 2: Serve the application with Caddy
FROM caddy:2.9.1-alpine AS runner

# Add a non-root user and group with a specific UID and GID
RUN addgroup -S caddygroup && adduser -S caddyuser -G caddygroup

# Change ownership of the /app directory to the non-root user
COPY --chown=caddyuser:caddygroup --from=builder ./dist /app

# Change ownership of the Caddyfile
COPY --chown=caddyuser:caddygroup ./Caddyfile ./Caddyfile

# Switch to the non-root user
USER caddyuser

LABEL org.opencontainers.image.source="https://github.com/Mozart409/blocky-frontend" \
    org.opencontainers.image.url="https://github.com/Mozart409/blocky-frontend" \
    org.opencontainers.image.title="Frontend for Blocky a DNS proxy as ad-blocker" 

EXPOSE 8002

CMD [ "caddy", "run", "--config", "./Caddyfile" ]