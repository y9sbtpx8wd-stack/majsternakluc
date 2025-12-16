FROM node:22 AS builder
WORKDIR /app
RUN corepack enable && corepack prepare yarn@stable --activate

COPY package.json yarn.lock ./
RUN yarn install --immutable-cache --inline-builds

COPY tsconfig.json ./
COPY public ./public
COPY src ./src
COPY next.config.js ./
RUN yarn build

COPY .yarn .yarn
COPY .yarnrc.yml ./

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["yarn", "start"]

