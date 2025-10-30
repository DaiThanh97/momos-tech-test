# Build stage
FROM node:22.21-alpine3.21 AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install all dependencies (including dev)
RUN yarn

COPY . .

RUN yarn build

# Production stage
FROM node:22.21-alpine3.21

WORKDIR /app

# Install Chromium and required dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-emoji

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install production dependencies only
RUN yarn install --production && \
    yarn cache clean

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Start application
CMD ["node", "dist/main.js"]