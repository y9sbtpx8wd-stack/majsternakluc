FROM node:22-slim AS builder
WORKDIR /app

# Nainštaluj systémové balíky potrebné pre Prisma, bcrypt, esbuild
RUN apt-get update -y && apt-get install -y \
    openssl \
    libssl-dev \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*
    
# Root Yarn súbory
COPY .yarn/releases .yarn/releases
COPY .yarnrc.yml ./
COPY yarn.lock ./
COPY package.json ./

RUN corepack enable && corepack prepare yarn@stable --activate

# Skopíruj všetky workspaces (apps/)
COPY apps apps

# Nainštaluj závislosti podľa root lockfile
RUN yarn install --immutable --inline-builds

# Buildni konkrétny workspace
RUN yarn workspace majsternakluc-web build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000
CMD ["yarn", "workspace", "majsternakluc-web", "start"]
