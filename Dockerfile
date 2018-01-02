FROM node:8.9.3-alpine

COPY package.json /code
COPY package-lock.json /code
RUN npm install -g nodemon
RUN npm install --production
WORKDIR /code
ENTRYPOINT [ "nodemon", "server.js" ]