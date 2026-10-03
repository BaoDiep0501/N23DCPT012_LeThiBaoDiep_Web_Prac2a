FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Cài cả dev dependencies để có Prisma CLI
RUN npm ci

# Copy Prisma schema + config vào image
COPY prisma ./prisma
COPY prisma.config.ts ./

# Generate Prisma Client
RUN npx prisma generate

# Sau khi generate xong mới bỏ dev dependencies
RUN npm prune --omit=dev


FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

COPY src ./src
COPY package.json ./

EXPOSE 3001

CMD ["node", "src/index.js"]