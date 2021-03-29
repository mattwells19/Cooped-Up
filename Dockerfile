FROM node:current-alpine

RUN npm i -g pnpm

WORKDIR /usr/app

# Copy over pnpm files
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy over source code for each project
COPY ./server ./server
COPY ./web ./web

# Install packages for all projects
RUN pnpm i

# Run the build command for each project
RUN pnpm -r run build

# Remove project folders after build
RUN rm -r ./server ./web

# Install dependencies for final build
WORKDIR /usr/app/build
RUN npm install --only=prod

# Run prod command when running container
CMD npm run prod
