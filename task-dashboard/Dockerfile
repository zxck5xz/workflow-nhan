# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy workspace config (all workspace packages needed for npm workspaces)
COPY package.json package-lock.json ./
COPY task-dashboard/package.json ./task-dashboard/package.json
COPY backend/package.json ./backend/package.json
COPY harness-context-engineering/package.json ./harness-context-engineering/package.json

# Install dependencies
RUN npm install --frozen-lockfile

# Copy frontend source
COPY task-dashboard ./task-dashboard

# Build frontend
WORKDIR /app/task-dashboard
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production stage (Nginx)
FROM nginx:alpine

COPY --from=builder /app/task-dashboard/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
