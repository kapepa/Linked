#FROM node:14.17.5 as node
#WORKDIR /usr/src/app
#COPY . .
#RUN npm run build
#
#FROM nginx:1.21.6
#COPY nginx.conf /etc/nginx/nginx.conf
#WORKDIR /usr/share/nginx/html

FROM node:14.17.5 as build
WORKDIR /app
COPY package.json /app/package.json

RUN npm install
COPY . .
RUN npm build


FROM nginx:1.21.6
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/www/index.html /usr/share/nginx/html
