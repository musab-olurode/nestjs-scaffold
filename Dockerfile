ARG  NODE_ENV

# BUILD FOR PRODUCTION
FROM node:16-alpine AS build

WORKDIR /app

ENV NODE_ENV = ${NODE_ENV}
COPY package*.json .

COPY tsconfig.build.json .

COPY tsconfig.json .

RUN yarn --network-timeout 1000000

RUN yarn build

COPY . .


# PRODUCTION
FROM node:16-alpine3.14 AS production

WORKDIR /app


COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/ ./
RUN yarn build


CMD [ "node", "dist/main.js" ]


