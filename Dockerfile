FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g serve
COPY . .
RUN npm run build


EXPOSE 3000
CMD [ "serve", "-s", "dist" ]