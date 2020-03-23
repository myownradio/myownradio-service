FROM node:13

ENV NODE_ENV=production

WORKDIR /usr/app

RUN chown 1000 /usr/app

USER 1000

COPY --chown=1000 package.json yarn.lock ./
COPY --chown=1000 services/radiomanager-backend/package.json services/radiomanager-backend/

RUN yarn workspace @myownradio/radiomanager-backend install --production --non-interactive --pure-lockfile

COPY --chown=1000 services/radiomanager-backend/ services/radiomanager-backend/
RUN yarn workspace @myownradio/radiomanager-backend build

CMD ["yarn", "workspace", "@myownradio/radiomanager-backend", "start"]
