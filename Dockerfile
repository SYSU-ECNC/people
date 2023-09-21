FROM node:18-alpine3.14

RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

COPY package*.json .
COPY prisma ./prisma/
RUN npm ci && npm cache clean --force

COPY . .
RUN npm run build

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000 

ENTRYPOINT ["node", ".output/server/index.mjs"]
