FROM node:14 as libs

WORKDIR /code

COPY tsconfig.json ./
COPY libs/shared-server libs/shared-server
RUN yarn --cwd libs/shared-server install --non-interactive --pure-lockfile
RUN yarn --cwd libs/shared-server build


FROM node:14 as service

WORKDIR /code

COPY tsconfig.json ./
COPY services/audio-uploader/package.json services/audio-uploader/
COPY services/audio-uploader/yarn.lock services/audio-uploader/
COPY services/audio-uploader/tsconfig.json services/audio-uploader/
COPY --from=libs /code/libs libs
RUN yarn --cwd services/audio-uploader install --non-interactive --pure-lockfile
COPY services/audio-uploader services/audio-uploader
RUN yarn --cwd services/audio-uploader build


FROM node:14-alpine

ENV NODE_ENV=production
ENV PORT=8080

COPY --from=service /code/services/audio-uploader/dist/ /code/
CMD node /code/index.js

EXPOSE 8080
