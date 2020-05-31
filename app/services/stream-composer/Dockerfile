FROM node:14

WORKDIR /usr/app/

COPY package.json yarn.lock ./
COPY services/stream-composer/package.json services/stream-composer/
COPY libs/ libs/
RUN ["yarn", "install", "--non-interactive", "--pure-lockfile"]

COPY tsconfig.json ./
COPY services/stream-composer services/stream-composer
RUN ["yarn", "workspace", "@myownradio/stream-composer", "build"]

FROM node:14-alpine
ENV NODE_ENV=production

COPY --from=0 /usr/app/services/stream-composer/dist/ /usr/app/
CMD ["node", "/usr/app/index.js"]
