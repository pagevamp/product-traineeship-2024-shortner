FROM node:20-alpine
USER root
WORKDIR /usr/local/app
COPY package.json .
RUN yarn
EXPOSE ${APP_PORT}
COPY . .
CMD ["yarn","run","start:dev"]