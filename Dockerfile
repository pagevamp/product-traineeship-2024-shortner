FROM node:20-alpine
USER root
WORKDIR /usr/local/app
COPY package.json .
RUN yarn
COPY . .
EXPOSE 3000
CMD ["yarn","run","start:dev"]