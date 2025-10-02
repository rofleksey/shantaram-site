# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g serve
RUN apk update && \
    apk add --no-cache curl ca-certificates && \
    update-ca-certificates && \
    ulimit -n 100000
RUN npm ci
COPY --from=builder /app/dist ./dist
EXPOSE 8080
ENV HOST=0.0.0.0
ENV PORT=8080
HEALTHCHECK --interval=10s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/v1/heathz || exit 1
CMD ["node", "./dist/server/entry.mjs"]