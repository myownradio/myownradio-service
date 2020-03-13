FROM node:13.10

WORKDIR /usr/app

COPY ./ ./

RUN ["yarn", "workspace", "@myownradio/radiomanager-frontend", "install"]
RUN ["yarn", "workspace", "@myownradio/radiomanager-frontend", "build"]

FROM nginx:1.17

COPY --from=0 /usr/app/services/radiomanager-frontend/dist /usr/share/nginx/html
