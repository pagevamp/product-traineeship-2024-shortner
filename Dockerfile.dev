FROM node:20-alpine
USER node
WORKDIR /usr/local/app
COPY package.json .
RUN yarn install --ignore-scripts
EXPOSE ${APP_PORT}
COPY . . 
CMD ["yarn","run","start:dev"]