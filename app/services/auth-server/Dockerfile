FROM node:14

WORKDIR /usr/app/

COPY package.json yarn.lock ./
COPY services/auth-server/package.json services/auth-server/
COPY libs/ libs/
RUN ["yarn", "install", "--non-interactive", "--pure-lockfile"]

COPY services/auth-server services/auth-server
RUN ["yarn", "install", "--production"]

FROM node:14-alpine

ENV NODE_ENV=production

COPY --from=0 /usr/app /usr/app

CMD ["node", "/usr/app/services/auth-server/src/server.js"]
