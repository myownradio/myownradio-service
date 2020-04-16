FROM node:13

WORKDIR /usr/app/

COPY package.json yarn.lock ./
COPY services/audio-player/package.json services/audio-player/
COPY libs/entities/package.json libs/entities/
RUN ["yarn", "install", "--non-interactive", "--pure-lockfile"]

COPY tsconfig.json ./
COPY services/audio-player services/audio-player
COPY libs/entities libs/entities
RUN ["yarn", "workspace", "@myownradio/audio-player", "build"]

FROM node:13-alpine
ENV NODE_ENV=production

COPY --from=0 /usr/app/services/audio-player/dist/ /usr/app/
CMD ["node", "/usr/app/index.js"]