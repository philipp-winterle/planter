FROM node:18-bullseye-slim

ARG NODE_ENV=production

ENV GATSBY_TELEMETRY_DISABLED=1
ENV NODE_ENV=$GATSBY_NODE_ENV

# Setup Basics
RUN apt update  \
    && apt install -y --no-install-recommends apt-utils apt-transport-https gnupg2 ca-certificates libssl-dev curl locales lsb-release xdg-utils python3 build-essential \
    && rm -rf /var/lib/apt/lists/*

# Update NPM to latest version
RUN npm i -g npm
RUN npm config set unsafe-perm true

COPY ./files/ /planter/

WORKDIR /planter

RUN npm ci

#EXPOSE 8000

# This is what will be executed on every compose up and is needed to start fpm
CMD npm run start
#CMD ["/bin/sh"]
