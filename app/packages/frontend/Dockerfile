FROM node:12

WORKDIR /usr/app

RUN chown 1000 /usr/app

USER 1000

# Copy packages.json for packages
COPY --chown=1000 package.json yarn.lock ./
COPY --chown=1000 packages/frontend/package.json ./packages/frontend/
COPY --chown=1000 packages/independent/package.json ./packages/independent/

RUN yarn --cwd /usr/app/packages/frontend install \
         --non-interactive \
         --pure-lockfile

COPY --chown=1000 packages/frontend packages/frontend
COPY --chown=1000 packages/independent packages/independent

WORKDIR /usr/app/packages/frontend

RUN yarn build

CMD yarn start
