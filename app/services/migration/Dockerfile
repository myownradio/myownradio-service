FROM node:12

ENV NODE_ENV=production

MAINTAINER Roman Lakhtadyr <roman.lakhtadyr@gmail.com>

WORKDIR /usr/app

RUN chown 1000 /usr/app

USER 1000

COPY --chown=1000 package.json yarn.lock ./
COPY --chown=1000 services/migration/package.json services/migration/

RUN yarn workspace @myownradio/migration --production --non-interactive --pure-lockfile

COPY --chown=1000 services/migration/knexfile.js services/migration/
COPY --chown=1000 migrations/ migrations/

CMD ["yarn", "workspace", "@myownradio/migration", "migrate"]
