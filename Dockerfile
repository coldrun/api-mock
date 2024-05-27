FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY src src
COPY data data

RUN yarn build
USER node

EXPOSE 3000

CMD ["node", "src/server.js"]
