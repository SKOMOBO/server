from node:8.9.3-alpine

RUN npm install -g nodemon
RUN npm install express compress helmet mysql2
WORKDIR /code
ENTRYPOINT [ "nodemon", "dust_cleaner_client/dust_cleaner_bridge.js" ]