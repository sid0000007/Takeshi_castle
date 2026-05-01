FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json tsconfig.base.json ./
COPY apps/server/package.json apps/server/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm install

COPY . .
RUN npm run build --workspace @takeshi-castle/web

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g serve

COPY --from=builder /app/apps/web/dist ./dist

EXPOSE 3000
CMD ["sh", "-c", "serve -s dist -l tcp://0.0.0.0:${PORT:-3000}"]
