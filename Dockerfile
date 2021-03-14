FROM node:lts-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn
COPY . .
CMD [ "yarn", "run", "start:prod" ]