FROM node:22 as builder
WORKDIR /app

# Aktivuj Corepack
RUN corepack enable

# Nastav Yarn stable (to je Yarn 4.x)
RUN corepack prepare yarn@stable --activate

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM nginx:alpine as production
COPY --from=builder /app/out /usr/share/nginx/html
