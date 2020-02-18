FROM ubuntu:18.04

MAINTAINER Roman Lakhtadyr <roman.lakhtadyr@gmail.com>


ARG SERVICE_NAME
ARG NODE_VERSION=12

ENV SERVICE_NAME=$SERVICE_NAME
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
COPY packages/ packages/

RUN yarn install --non-interactive --pure-lockfile

CMD npm --prefix packages/${SERVICE_NAME} start
