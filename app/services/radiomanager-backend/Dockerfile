FROM node:14

WORKDIR /usr/app/

COPY package.json yarn.lock ./
COPY services/radiomanager-backend/package.json services/radiomanager-backend/
COPY libs/ libs/
RUN ["yarn", "install", "--non-interactive", "--pure-lockfile"]

COPY tsconfig.json ./
COPY services/radiomanager-backend services/radiomanager-backend

RUN ["yarn", "workspace", "@myownradio/radiomanager-backend", "build"]


FROM node:14-alpine

ENV NODE_ENV=production

COPY --from=0 /usr/app/services/radiomanager-backend/dist/ /usr/app/

CMD ["node", "/usr/app/index.js"]
