FROM node:13

WORKDIR /usr/app/

COPY package.json yarn.lock ./

RUN ["yarn", "install", "--non-interactive", "--pure-lockfile"]

COPY . .

RUN ["yarn", "build"]


FROM node:13-alpine

ENV NODE_ENV=production

COPY --from=0 /usr/app/dist/ /usr/app/

CMD ["node", "/usr/app/index.js"]
