FROM node:16-alpine3.14

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .

CMD ["yarn", "dev"]