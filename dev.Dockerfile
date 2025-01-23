FROM node:22-alpine
USER node
WORKDIR /usr/local/app
COPY package.json .
RUN yarn install
EXPOSE ${APP_PORT}
COPY . . 
CMD ["yarn","run","start:dev"]