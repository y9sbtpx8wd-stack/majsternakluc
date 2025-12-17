FROM node:22-slim AS builder
WORKDIR /app

# Skopíruj root Yarn súbory (iba jeden lockfile pre celé monorepo)
COPY .yarn/releases .yarn/releases
COPY .yarnrc.yml ./
COPY yarn.lock ./
COPY package.json ./

# Aktivuj Yarn cez Corepack
RUN corepack enable && corepack prepare yarn@stable --activate

# Skopíruj workspace súbory pre API
COPY apps/api/package.json ./apps/api/package.json
COPY apps/api/tsconfig.json ./apps/api/tsconfig.json
COPY apps/api/src ./apps/api/src

# Nainštaluj závislosti iba pre API workspace podľa root lockfile
RUN yarn workspaces focus --all --immutable --inline-builds

# Buildni API
RUN yarn workspace majsternakluc-api build

# Production image
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production

# Skopíruj build artefakty
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]

