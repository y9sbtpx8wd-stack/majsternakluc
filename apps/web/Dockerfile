FROM node:22 AS builder

WORKDIR /app
RUN corepack enable && corepack prepare yarn@stable --activate

# Skopíruj package.json a lockfile
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable-cache --inline-builds

# Skopíruj zdrojáky
COPY tsconfig.json ./
COPY public ./public
COPY src ./src
COPY next.config.js ./

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
