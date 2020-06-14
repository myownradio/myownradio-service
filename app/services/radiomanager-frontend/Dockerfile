FROM node:14 as libs

WORKDIR /code

COPY tsconfig.json ./

COPY libs/shared-types libs/shared-types
RUN yarn --cwd libs/shared-types install --non-interactive --pure-lockfile
RUN yarn --cwd libs/shared-types build


FROM node:14 as service

WORKDIR /code

COPY tsconfig.json ./

COPY services/radiomanager-frontend/package.json services/radiomanager-frontend/
COPY services/radiomanager-frontend/yarn.lock services/radiomanager-frontend/
COPY services/radiomanager-frontend/tsconfig.json services/radiomanager-frontend/
COPY --from=libs /code/libs libs
RUN yarn --cwd services/radiomanager-frontend install --non-interactive --pure-lockfile
COPY services/radiomanager-frontend services/radiomanager-frontend
RUN yarn --cwd services/radiomanager-frontend build


FROM nginx:1.17

COPY services/radiomanager-frontend/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=service /code/services/radiomanager-frontend/dist /usr/share/nginx/html
