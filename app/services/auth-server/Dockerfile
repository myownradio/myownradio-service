FROM node:12

ENV NODE_ENV=production

WORKDIR /usr/app

RUN chown 1000 /usr/app

USER 1000

COPY --chown=1000 package.json yarn.lock ./
COPY --chown=1000 services/auth-server/package.json services/auth-server/

COPY --chown=1000 libs/shared/package.json libs/shared/
COPY --chown=1000 libs/independent/package.json libs/independent/

RUN yarn workspace @myownradio/auth-server install --production --non-interactive --pure-lockfile

COPY --chown=1000 services/auth-server/ services/auth-server/
COPY --chown=1000 libs/ libs/

CMD ["yarn", "workspace", "@myownradio/auth-server", "start"]
