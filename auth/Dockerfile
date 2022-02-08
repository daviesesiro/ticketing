FROM node:alpine

WORKDIR /app
COPY package.json .
COPY yarn.lock .

RUN yarn install --production=true
COPY . .

CMD ["yarn", "start"]