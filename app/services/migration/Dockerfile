FROM node:14

WORKDIR /code/

COPY package.json ./
COPY services/migration/package.json services/migration/
COPY services/migration/yarn.lock services/migration/
RUN yarn --cwd services/migration install --non-interactive --pure-lockfile

COPY services/migration/knexfile.js services/migration/


FROM node:14-alpine

ENV NODE_ENV=production

COPY --from=0 /code /code
COPY migrations /code/migrations

WORKDIR /code/services/migration/

CMD echo 'To run migrations please run this image with following command: npx knex migrate:latest'
