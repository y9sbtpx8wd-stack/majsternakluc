FROM node:22

# Nastav pracovný adresár
WORKDIR /app

# Skopíruj package.json a package-lock.json
COPY package*.json ./

# Nainštaluj závislosti
RUN npm install --production

# Skopíruj zvyšok kódu
COPY . .

# Prisma migrácie (ak používaš)
RUN npx prisma generate

# Spusti aplikáciu
CMD ["npm", "start"]

