# FROM alpine:3.7
FROM node:latest

RUN npm i -g pnpm

WORKDIR /usr/app
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

COPY ./server/package*.json ./server/
COPY ./web/package*.json ./web/
COPY ./server/package*.json ./build/

RUN pnpm i
COPY ./server ./server
COPY ./web ./web
RUN pnpm -r run build

WORKDIR /usr/app/build
RUN npm i

CMD npm run prod
