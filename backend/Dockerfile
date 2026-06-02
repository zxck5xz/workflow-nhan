# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy backend package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy backend source
COPY . .

# Generate Prisma Client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Production stage
FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

EXPOSE 4000

CMD ["npx", "tsx", "src/server.js"]
