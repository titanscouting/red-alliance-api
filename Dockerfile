FROM node:lts
WORKDIR /usr/src/app
RUN apt-get update && apt-get install gnupg2 -y
COPY package*.json ./
RUN yarn
COPY . .
CMD [ "npm", "run", "start:prod" ]