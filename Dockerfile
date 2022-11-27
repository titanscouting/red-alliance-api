FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn --prod
COPY . .
RUN yarn run build
CMD [ "yarn", "run", "start:prod" ]