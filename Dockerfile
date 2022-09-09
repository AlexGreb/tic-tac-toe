FROM node:16 AS restore

COPY ./package.json /app/
COPY ./package-lock.json /app/
WORKDIR /app

RUN npm install 

FROM restore AS build

COPY . /app/
WORKDIR /app

RUN npm run build

FROM nginx:stable-alpine AS runner

COPY --from=build /app/public /usr/share/nginx/html

EXPOSE 80
