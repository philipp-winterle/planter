#!/usr/bin/env sh

echo "Starting up Planter App with NODE_ENV: $GATSBY_NODE_ENV"
if [ "$GATSBY_NODE_ENV" = "production" ]
then
  npm run prod;
else
  npm run develop;
fi