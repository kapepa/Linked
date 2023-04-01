FROM node:14.17.5 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:1.21.6
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/www/ /usr/share/nginx/html/





