FROM node:lts
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn
COPY . .
CMD [ "npm", "run", "start:prod" ]