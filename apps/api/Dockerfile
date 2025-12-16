FROM node:22-slim AS builder
WORKDIR /app

RUN corepack enable && corepack prepare yarn@stable --activate

COPY apps/api/package.json apps/api/yarn.lock ./
COPY .yarnrc.yml ./
RUN yarn install

COPY apps/api/tsconfig.json ./
COPY apps/api/src ./src
RUN yarn build

FROM node:22-slim
WORKDIR /app
COPY --from=builder /app ./
CMD ["yarn", "start"]

