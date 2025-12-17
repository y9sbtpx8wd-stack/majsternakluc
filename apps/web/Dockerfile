FROM node:22-slim AS builder
WORKDIR /app

COPY .yarn/releases .yarn/releases
COPY .yarnrc.yml ./
COPY package.json yarn.lock ./

RUN corepack enable && corepack prepare yarn@stable --activate

COPY apps/web/tsconfig.json ./tsconfig.json
COPY apps/web/next.config.js ./next.config.js
COPY apps/web/public ./public
COPY apps/web/src ./src

RUN yarn install --immutable --inline-builds
RUN yarn build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["yarn", "start"]

