FROM node

WORKDIR /app
COPY package.json .
COPY yarn.lock .

ENTRYPOINT yarn install && yarn start
