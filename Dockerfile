FROM node:latest

RUN npm i -g pnpm

WORKDIR /usr/app

# Copy over pnpm files
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Copy over package and package-lock files for each project
COPY ./server/package*.json ./server/
COPY ./web/package*.json ./web/
COPY ./server/package*.json ./build/

# Install packages for all projects
RUN pnpm i

# Copy over source code for each project
COPY ./server ./server
COPY ./web ./web

# Run the build command for each project
RUN pnpm -r run build

# Install dependencies for final build
WORKDIR /usr/app/build
RUN npm i

# Run prod command when running container
CMD npm run prod
