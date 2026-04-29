FROM node:20-alpine
WORKDIR /app
COPY . .
CMD ["sh", "-c", "echo 'Use apps/server/Dockerfile or apps/web/Dockerfile for service builds.'"]
