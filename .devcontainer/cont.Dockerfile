FROM node:lts-alpine
RUN apk add --no-cache git redis curl vim nano bash
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn
COPY . .