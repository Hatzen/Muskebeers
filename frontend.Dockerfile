FROM node

WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY . .

ENTRYPOINT "./asset_server.sh"
