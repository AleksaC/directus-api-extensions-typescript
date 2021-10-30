FROM node:16-bullseye as builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN : \
    && echo "update-notifier=false" >> ~/.npmrc \
    && npm ci \
    && rm -rf ~/.npm/* \
    && :

COPY . .

RUN npm run build

#==============================================================================

FROM node:16-bullseye as runner

USER node

RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY --from=builder --chown=node:node /app/package*.json ./

RUN : \
    && echo "update-notifier=false" >> ~/.npmrc \
    && npm ci --production \
    && rm -rf ~/.npm/* \
    && :

COPY --from=builder --chown=node:node /app/.env ./
COPY --from=builder --chown=node:node /app/extensions ./extensions

EXPOSE 8055

CMD ["npm", "start"]
