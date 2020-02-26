FROM ubuntu:19.04

MAINTAINER Roman Lakhtadyr <roman.lakhtadyr@gmail.com>

ARG SERVICE
ARG NODE_VERSION=12

ENV SERVICE=$SERVICE
ENV DEBIAN_FRONTEND=noninteractive

# Install container dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends --no-install-suggests \
        curl \
        apt-transport-https \
        ca-certificates \
        && \
    (curl -sL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash) && \
    apt-get install -y --no-install-recommends --no-install-suggests \
        nodejs \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    npm i -g yarn

WORKDIR /usr/app

COPY package.json yarn.lock ./
COPY packages/shared/ packages/shared/
COPY packages/independent/ packages/independent/
COPY packages/$SERVICE/ packages/$SERVICE/

RUN yarn install --non-interactive --pure-lockfile

CMD npm --prefix packages/${SERVICE} start
