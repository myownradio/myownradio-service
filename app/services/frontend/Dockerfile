FROM node:12

ENV NODE_ENV=production

WORKDIR /usr/app

RUN chown 1000 /usr/app

USER 1000

# Copy packages.json for packages
COPY --chown=1000 package.json yarn.lock ./
COPY --chown=1000 services/frontend/package.json services/frontend/
COPY --chown=1000 libs/ libs/

RUN yarn workspace @myownradio/frontend install --production --non-interactive --pure-lockfile

COPY --chown=1000 services/frontend services/frontend/
COPY --chown=1000 libs/ libs/

RUN yarn workspace @myownradio/frontend build

CMD ["yarn", "workspace", "@myownradio/frontend", "start"]
