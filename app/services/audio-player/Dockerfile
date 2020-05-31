FROM node:14

WORKDIR /usr/app/

COPY package.json yarn.lock ./
COPY services/audio-player/package.json services/audio-player/
COPY libs/ libs/
RUN ["yarn", "install", "--non-interactive", "--pure-lockfile"]

COPY tsconfig.json ./
COPY services/audio-player services/audio-player
RUN ["yarn", "workspace", "@myownradio/audio-player", "build"]

FROM node:14-alpine
ENV NODE_ENV=production

COPY --from=0 /usr/app/services/audio-player/dist/ /usr/app/
CMD ["node", "/usr/app/index.js"]
