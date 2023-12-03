#
# Stage for building the project
#
FROM node:current-alpine AS build

WORKDIR /usr/app

# Copy over project files
COPY yarn.lock package.json ./
COPY ./server ./server
COPY ./web ./web

# Install packages for all projects and build workspaces
RUN yarn install && yarn build


#
# Stage for starting the container
#
FROM node:current-alpine AS run

# Copy build output from 'build' stage
COPY --from=build /usr/app/build /usr/app

# Install needed dependecies for prod
WORKDIR /usr/app/build
RUN npm install --omit=dev

# Run prod command when running container
CMD npm run prod
