FROM node:lts-alpine
RUN apk add --no-cache git
RUN adduser -D worker
USER worker
WORKDIR /home/worker
COPY package*.json ./
RUN yarn
COPY . .
CMD [ "yarn", "run", "start:prod" ]