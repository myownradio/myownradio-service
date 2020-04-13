FROM node:13

WORKDIR /usr/app/

COPY package.json yarn.lock ./
COPY services/scheduler/package.json services/scheduler/
RUN ["yarn", "install", "--non-interactive", "--pure-lockfile"]

COPY tsconfig.json ./
COPY services/scheduler services/scheduler
RUN ["yarn", "workspace", "@myownradio/scheduler", "build"]

FROM node:13-alpine
ENV NODE_ENV=production

COPY --from=0 /usr/app/services/scheduler/dist/ /usr/app/
CMD ["node", "/usr/app/index.js"]
