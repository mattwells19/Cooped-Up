FROM node:current-alpine

RUN npm i -g pnpm

WORKDIR /usr/app

# Copy over pnpm files
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Copy over package and package-lock files for each project
COPY ./server/package*.json ./server/
COPY ./web/package*.json ./web/

# Install packages for all projects
RUN pnpm i

# Copy over source code for each project
COPY ./server ./server
COPY ./web ./web

# Run the build command for each project
RUN pnpm -r run build

# Remove project folders after build
RUN rm -r ./server
RUN rm -r ./web

# Install dependencies for final build
WORKDIR /usr/app/build
RUN npm install --only=prod

# Run prod command when running container
CMD npm run prod
