FROM node:12

MAINTAINER Roman Lakhtadyr <roman.lakhtadyr@gmail.com>

ENV NODE_ENV=production

WORKDIR /usr/app

COPY package.json ./
COPY yarn.lock ./

COPY packages/migration/package.json ./packages/migration/

RUN yarn --production

COPY packages/migration/knexfile.js ./packages/migration/
COPY migrations/ ./migrations

WORKDIR /usr/app/packages/migration

CMD ["yarn", "migrate"]
