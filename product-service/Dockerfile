FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npx prisma generate
RUN npm prune --omit=dev


FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

COPY prisma.config.ts ./
COPY src ./src
COPY package.json ./

EXPOSE 3001

CMD ["node", "src/index.js"]