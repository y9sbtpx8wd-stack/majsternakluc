FROM node:22 as builder
WORKDIR /app

# Aktivuj Corepack
RUN corepack enable
RUN corepack prepare yarn@stable --activate

# Skopíruj Yarn config
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn


# Nainštaluj závislosti
RUN yarn install --frozen-lockfile

# Skopíruj zdrojáky
COPY . .

# Build
RUN yarn build

# Production image
FROM nginx:alpine as production
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/out .   # alebo /app/build podľa frameworku

