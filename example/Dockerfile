FROM node:16-bullseye

RUN : \
    && apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        # Needed by tree-kill
        procps \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && :

USER node

RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package.json package-lock.json ./
RUN : \
    && echo "update-notifier=false" >> ~/.npmrc \
    && npm install \
    && rm -rf ~/.npm/* \
    && :

COPY --chown=node:node . .

EXPOSE 8055

CMD ["npm", "run", "dev"]
