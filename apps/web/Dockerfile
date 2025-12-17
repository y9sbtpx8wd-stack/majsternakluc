FROM node:22-slim AS builder
WORKDIR /app

# Skopíruj root Yarn súbory (iba jeden lockfile pre celé monorepo)
COPY .yarn/releases .yarn/releases
COPY .yarnrc.yml ./
COPY yarn.lock ./
COPY package.json ./

# Aktivuj Yarn cez Corepack
RUN corepack enable && corepack prepare yarn@stable --activate

# Skopíruj workspace súbory pre web
COPY apps/web/package.json ./apps/web/package.json
COPY apps/web/tsconfig.json ./apps/web/tsconfig.json
COPY apps/web/next.config.js ./apps/web/next.config.js
COPY apps/web/public ./apps/web/public
COPY apps/web/src ./apps/web/src

# Nainštaluj závislosti podľa root lockfile
RUN yarn workspaces focus web --immutable --inline-builds

# Buildni web
RUN yarn workspace majsternakluc-web build

# Production image
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production

# Skopíruj build artefakty
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000
CMD ["yarn", "workspace", "majsternakluc-web", "start"]
