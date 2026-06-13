FROM node:20-alpine

WORKDIR /app

COPY backend/package.json ./
COPY backend/prisma ./prisma/
COPY backend/src ./src/

RUN npm install --no-workspaces && npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 4000

CMD ["npx", "tsx", "src/server.js"]
