FROM node:22-slim AS builder
WORKDIR /app

RUN apt-get update -y && apt-get install -y \
    openssl \
    libssl-dev \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

COPY .yarn/releases .yarn/releases
COPY .yarnrc.yml ./
COPY yarn.lock ./
COPY package.json ./

RUN corepack enable && corepack prepare yarn@stable --activate

COPY apps apps
RUN yarn install --immutable --inline-builds
RUN yarn workspace majsternakluc-web build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production

# Root workspace súbory
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /app/.yarn ./ .yarn

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web ./apps/web

EXPOSE 3000
CMD ["corepack", "yarn", "workspace", "majsternakluc-web", "start"]
