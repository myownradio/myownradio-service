FROM node:14

WORKDIR /usr/app/

COPY package.json yarn.lock ./
COPY services/migration/package.json services/migration/
RUN ["yarn", "install", "--non-interactive", "--pure-lockfile"]

COPY services/migration/knexfile.js services/migration/
RUN ["yarn", "install", "--production"]


FROM node:14-alpine

ENV NODE_ENV=production

COPY --from=0 /usr/app /usr/app
COPY migrations /usr/app/migrations

WORKDIR /usr/app/services/migration/

CMD echo 'To run migrations please run this image with following command: npx knex migrate:latest'
