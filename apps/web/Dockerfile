FROM node:22-slim AS builder
WORKDIR /app

COPY .yarn/releases .yarn/releases
COPY .yarnrc.yml ./
COPY yarn.lock ./
COPY package.json ./

RUN corepack enable && corepack prepare yarn@stable --activate

COPY apps/web/package.json ./apps/web/package.json
COPY apps/web/tsconfig.json ./apps/web/tsconfig.json
COPY apps/web/next.config.js ./apps/web/next.config.js
COPY apps/web/public ./apps/web/public
COPY apps/web/src ./apps/web/src

RUN yarn install --immutable --inline-builds
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
