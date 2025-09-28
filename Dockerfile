# Build
FROM node:22-alpine as build
WORKDIR /opt
COPY --link package.json package-lock.json .
RUN npm ci
COPY --link . .
RUN npm run build && npm prune

# Run
FROM node:22-alpine
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0
WORKDIR /opt
RUN apk update && apk add --no-cache curl ca-certificates
COPY --from=build /opt/dist /opt/dist
CMD [ "node", "./dist/server/entry.mjs" ]
