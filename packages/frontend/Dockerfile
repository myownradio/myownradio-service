FROM node:12

WORKDIR /usr/app

RUN chown 1000 /usr/app

USER 1000

COPY --chown=1000 packages/frontend packages/frontend
COPY --chown=1000 package.json yarn.lock ./

RUN yarn install

CMD yarn start
