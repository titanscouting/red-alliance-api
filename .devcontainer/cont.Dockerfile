FROM node:lts-alpine
RUN apk add --no-cache git
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn
COPY . .