FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY prisma ./prisma
COPY src/data ./src/data

# Generate Prisma client at build time so runtime has `.prisma/client/*`
# Ensure prisma generate uses schema inside /app/prisma (not repo root)
RUN cd /app && npx prisma generate --schema=./prisma/schema.prisma

ENV PORT=4000

EXPOSE 4000

CMD ["npx","tsx","src/server.js"]

