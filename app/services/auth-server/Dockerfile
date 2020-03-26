FROM node:13

WORKDIR /usr/app/

COPY package.json yarn.lock ./
COPY services/auth-server/package.json services/auth-server/
COPY libs/shared/package.json libs/shared/
COPY libs/independent/package.json libs/independent/
RUN ["yarn", "install", "--non-interactive", "--pure-lockfile"]

COPY services/auth-server services/auth-server
COPY libs/shared libs/shared
COPY libs/independent libs/independent
RUN ["yarn", "install", "--production"]

FROM node:13-alpine

ENV NODE_ENV=production

COPY --from=0 /usr/app /usr/app

CMD ["node", "/usr/app/services/auth-server/src/server.js"]
