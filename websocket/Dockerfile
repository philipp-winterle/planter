FROM node:18-slim

# Update NPM to latest version
RUN npm i -g npm

COPY ./files/ /scripts/

RUN cd /scripts && npm ci

# This is what will be executed on every compose up and is needed to start fpm
ENTRYPOINT ["node", "/scripts/websocket_server.js"]
CMD ["/bin/sh"]
