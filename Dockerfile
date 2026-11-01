FROM node:22-bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci
COPY prisma ./prisma
COPY prisma7.config.ts ./
RUN npm run db:generate
COPY server.js normalized-store.js ./
COPY scripts/seed-if-empty.cjs ./scripts/seed-if-empty.cjs
COPY prisma/seed.ts ./prisma/seed.ts
COPY public ./public
ENV NODE_ENV=production HOST=0.0.0.0 PORT=10000 PORTAL_UPLOAD_DIR=/var/data/uploads
EXPOSE 10000
CMD ["sh", "-c", "npx prisma db push --config prisma7.config.ts && node scripts/seed-if-empty.cjs && node server.js"]
