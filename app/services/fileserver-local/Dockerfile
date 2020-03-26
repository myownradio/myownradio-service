FROM node:13

WORKDIR /usr/app/

COPY package.json yarn.lock ./
COPY services/fileserver-local/package.json services/fileserver-local/
COPY libs/shared/package.json libs/shared/
RUN ["yarn", "install", "--non-interactive", "--pure-lockfile"]

COPY services/fileserver-local services/fileserver-local
COPY libs/shared libs/shared
RUN ["yarn", "install", "--production"]

FROM node:13-alpine

ENV NODE_ENV=production

COPY --from=0 /usr/app /usr/app

CMD ["node", "/usr/app/services/fileserver-local/src/server.js"]
