FROM node:12

ENV NODE_ENV=production

WORKDIR /usr/app

RUN chown 1000 /usr/app

USER 1000

COPY --chown=1000 package.json yarn.lock ./
COPY --chown=1000 services/fileserver-local/package.json services/fileserver-local/

COPY --chown=1000 libs/shared/package.json libs/shared/
COPY --chown=1000 libs/independent/package.json libs/independent/

RUN yarn workspace @myownradio/fileserver-local install --production --non-interactive --pure-lockfile

COPY --chown=1000 services/fileserver-local/ services/fileserver-local/
COPY --chown=1000 libs/ libs/

CMD ["yarn", "workspace", "@myownradio/fileserver-local", "start"]
