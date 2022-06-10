FROM node:14 as Builder

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

# Files required by pnpm install
COPY package.json pnpm-lock.yaml ./

# PRODUCTION BUILD
# RUN pnpm install --frozen-lockfile --prod
RUN pnpm install --frozen-lockfile 

# Bundle app source
COPY . .

RUN pnpm run build

FROM caddy:2.5.1-alpine as Runner

COPY --from=Builder ./dist /app

COPY ./Caddyfile ./Caddyfile

EXPOSE 80

CMD [ "caddy", "run", "--config", "./Caddyfile" ]