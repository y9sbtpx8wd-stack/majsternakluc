FROM node:22-slim AS builder
WORKDIR /app
RUN corepack enable && corepack prepare yarn@stable --activate

COPY package.json yarn.lock ./
COPY .yarn .yarn
COPY .yarnrc.yml ./

COPY apps/api/tsconfig.json ./tsconfig.json
COPY apps/api/src ./src

RUN yarn install --immutable --inline-builds
RUN yarn build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./
EXPOSE 4000
CMD ["node", "dist/main.js"]


