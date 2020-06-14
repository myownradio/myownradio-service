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
COPY services/radiomanager-backend/package.json services/radiomanager-backend/
COPY services/radiomanager-backend/yarn.lock services/radiomanager-backend/
COPY services/radiomanager-backend/tsconfig.json services/radiomanager-backend/
COPY --from=libs /code/libs libs
RUN yarn --cwd services/radiomanager-backend install --non-interactive --pure-lockfile
COPY services/radiomanager-backend services/radiomanager-backend
RUN yarn --cwd services/radiomanager-backend build


FROM node:14-alpine

ENV NODE_ENV=production

COPY --from=service /code/services/radiomanager-backend/dist/ /code/
CMD node /code/index.js
