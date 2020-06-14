FROM node:14 as libs

WORKDIR /code

COPY tsconfig.json ./
COPY libs/shared-server libs/shared-server
RUN yarn --cwd libs/shared-server install --non-interactive --pure-lockfile
RUN yarn --cwd libs/shared-server build


FROM node:14 as service

WORKDIR /code

COPY tsconfig.json ./
COPY services/audio-player/package.json services/audio-player/
COPY services/audio-player/yarn.lock services/audio-player/
COPY services/audio-player/tsconfig.json services/audio-player/
COPY --from=libs /code/libs libs
RUN yarn --cwd services/audio-player install --non-interactive --pure-lockfile
COPY services/audio-player services/audio-player
RUN yarn --cwd services/audio-player build


FROM node:14-alpine

ENV NODE_ENV=production

COPY --from=service /code/services/audio-player/dist/ /code/
CMD node /code/index.js
