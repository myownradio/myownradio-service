FROM node:14 as libs

WORKDIR /code

COPY tsconfig.json ./
COPY libs/shared-server libs/shared-server
RUN yarn --cwd libs/shared-server install --non-interactive --pure-lockfile
RUN yarn --cwd libs/shared-server build


FROM node:14 as service

WORKDIR /code

COPY tsconfig.json ./
COPY services/stream-composer/package.json services/stream-composer/
COPY services/stream-composer/yarn.lock services/stream-composer/
COPY services/stream-composer/tsconfig.json services/stream-composer/
COPY --from=libs /code/libs libs
RUN yarn --cwd services/stream-composer install --non-interactive --pure-lockfile
COPY services/stream-composer services/stream-composer
RUN yarn --cwd services/stream-composer build


FROM node:14-alpine

ENV NODE_ENV=production

COPY --from=service /code/services/stream-composer/dist/ /code/
CMD node /code/index.js
