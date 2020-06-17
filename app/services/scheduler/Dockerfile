FROM node:14 as libs

WORKDIR /code

COPY tsconfig.json ./
COPY libs/shared-server libs/shared-server
RUN yarn --cwd libs/shared-server install --non-interactive --pure-lockfile
RUN yarn --cwd libs/shared-server build

COPY libs/shared-types libs/shared-types
RUN yarn --cwd libs/shared-types install --non-interactive --pure-lockfile
RUN yarn --cwd libs/shared-types build


FROM node:14 as service

WORKDIR /code

COPY tsconfig.json ./
COPY services/scheduler/package.json services/scheduler/
COPY services/scheduler/yarn.lock services/scheduler/
COPY services/scheduler/tsconfig.json services/scheduler/
COPY --from=libs /code/libs libs
RUN yarn --cwd services/scheduler install --non-interactive --pure-lockfile
COPY services/scheduler services/scheduler
RUN yarn --cwd services/scheduler build


FROM node:14-alpine

ENV NODE_ENV=production

COPY --from=service /code/services/scheduler/dist/ /code/
CMD node /code/index.js
