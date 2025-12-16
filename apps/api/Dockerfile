FROM node:22-slim AS builder
WORKDIR /app

RUN corepack enable && corepack prepare yarn@stable --activate

COPY package.json yarn.lock ./
COPY .yarnrc.yml ./
RUN yarn install

COPY tsconfig.json ./
COPY src ./src
RUN yarn build

FROM node:22-slim
WORKDIR /app
COPY --from=builder /app ./
CMD ["yarn", "start"]

