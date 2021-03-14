FROM node:lts-alpine
WORKDIR /usr/src/app
RUN apk add --no-cache git
COPY package*.json ./
RUN yarn
COPY . .
CMD [ "yarn", "run", "start:prod" ]