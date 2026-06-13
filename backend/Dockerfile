FROM node:20-alpine

RUN apk add --no-cache python3

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/
COPY src ./src/
COPY ai-agents /ai-agents/

RUN npm install --no-workspaces && npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 4000

CMD ["npx", "tsx", "src/server.js"]
