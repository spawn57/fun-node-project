FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

CMD [ "npm", "run", "start:prod" ]