FROM node:13.10

COPY ./ /usr/app/

WORKDIR /usr/app/services/radiomanager-frontend

RUN ["yarn", "install"]
RUN ["yarn", "build"]

FROM nginx:1.17

COPY --from=0 /usr/app/services/radiomanager-frontend/dist /usr/share/nginx/html
