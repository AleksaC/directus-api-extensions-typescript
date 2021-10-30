#!/usr/bin/env bash

set -eou pipefail

cd "$(dirname "$0")"

docker-compose run --rm directus bash -c "npm run bootstrap"
docker-compose down

docker-compose up -d
