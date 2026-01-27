FROM node:24 AS builder

RUN corepack enable

RUN corepack prepare pnpm@10.28.2 --activate

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

FROM caddy:2.10.2-alpine AS runner

LABEL org.opencontainers.image.source="https://github.com/Mozart409/blocky-frontend" \
    org.opencontainers.image.url="https://github.com/Mozart409/blocky-frontend" \
    org.opencontainers.image.title="Frontend for Blocky a DNS proxy as ad-blocker" 

COPY --from=builder ./dist /app

COPY ./Caddyfile ./Caddyfile

EXPOSE 8002

CMD [ "caddy", "run", "--config", "./Caddyfile" ]
