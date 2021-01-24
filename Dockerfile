FROM "node:10-alpine" AS builder

## build API
COPY ./api /app
WORKDIR /app
RUN npm i 

COPY wrapper.sh /entry.sh
RUN chmod 0755 /entry.sh

USER node

ENTRYPOINT ["/entry.sh"]

EXPOSE 5000
