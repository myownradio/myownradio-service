FROM node:14

WORKDIR /usr/app

COPY package.json yarn.lock ./
COPY services/radiomanager-frontend/package.json services/radiomanager-frontend/
COPY libs/ libs/
RUN ["yarn", "install", "--non-interactive", "--pure-lockfile"]

COPY tsconfig.json ./
COPY services/radiomanager-frontend services/radiomanager-frontend
RUN ["yarn", "workspace", "@myownradio/radiomanager-frontend", "build"]

FROM nginx:1.17

COPY services/radiomanager-frontend/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /usr/app/services/radiomanager-frontend/dist /usr/share/nginx/html
