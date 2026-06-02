FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/
COPY src ./src/

RUN rm -f package-lock.json && npm install && npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 4000

CMD ["npx", "tsx", "src/server.js"]
