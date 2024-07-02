FROM node:10-alpine

ENV NODE_ENV=production

WORKDIR /app

RUN npm ci \
    && npm run build \
    && npm prune --production

COPY --from=build --chown=node:node /app/package*.json ./
COPY --from=build --chown=node:node /app/node_modules/ ./node_modules/
COPY --from=build --chown=node:node /app/graphql-schema.gql ./graphql-schema.gql
COPY --from=build --chown=node:node /app/dist/ ./

EXPOSE ${PORT}

USER node

CMD ["node", "main"]
