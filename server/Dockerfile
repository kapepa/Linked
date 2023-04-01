FROM node:14.17.5 as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4500

CMD "npm" "run" "start:prod"