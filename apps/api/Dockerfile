FROM node:22-slim AS builder
WORKDIR /app
RUN corepack enable && corepack prepare yarn@stable --activate

COPY package.json yarn.lock ./
COPY .yarn .yarn
COPY .yarnrc.yml ./
RUN yarn install --immutable-cache --inline-builds

COPY tsconfig.json ./
COPY src ./src
RUN yarn build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./
EXPOSE 4000
CMD ["node", "dist/main.js"]


