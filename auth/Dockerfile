FROM node:16-alpine3.14

WORKDIR /app
COPY package.json .
COPY yarn.lock .

RUN yarn install --production=true
COPY . .

CMD ["yarn", "start"]