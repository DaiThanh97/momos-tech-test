FROM node:18-alpine AS build

RUN mkdir /media-scraper-ui
WORKDIR /media-scraper-ui

COPY package*.json ./ 
COPY yarn.lock ./

# Install all dependencies (including dev)
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

#---------------------------

FROM node:18-alpine

RUN mkdir /media-scraper-ui
WORKDIR /media-scraper-ui

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --production --frozen-lockfile && \
    yarn cache clean

COPY . .

COPY --from=build /media-scraper-ui/build ./build

ENV NODE_ENV=production

CMD [ "yarn", "start" ]
