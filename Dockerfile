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

FROM caddy:2.9.1-alpine AS runner

LABEL org.opencontainers.image.source="https://github.com/Mozart409/blocky-frontend" \
    org.opencontainers.image.url="https://github.com/Mozart409/blocky-frontend" \
    org.opencontainers.image.title="Frontend for Blocky a DNS proxy as ad-blocker" 

COPY --from=Builder ./dist /app

COPY ./Caddyfile ./Caddyfile

EXPOSE 8002

CMD [ "caddy", "run", "--config", "./Caddyfile" ]
