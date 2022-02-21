FROM node:14-alpine3.14

WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .

CMD ["yarn", "dev"]