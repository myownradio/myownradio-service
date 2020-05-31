FROM node:14

WORKDIR /usr/app/

COPY package.json yarn.lock ./
COPY services/audio-uploader/package.json services/audio-uploader/
COPY libs/ libs/
RUN ["yarn", "install", "--non-interactive", "--pure-lockfile"]

COPY tsconfig.json ./
COPY services/audio-uploader services/audio-uploader

RUN ["yarn", "workspace", "@myownradio/audio-uploader", "build"]


FROM node:14-alpine

ENV NODE_ENV=production

COPY --from=0 /usr/app/services/audio-uploader/dist/ /usr/app/

CMD ["node", "/usr/app/index.js"]
