# Build server jar
FROM maven:3.9.9-eclipse-temurin-21 AS builder-server
WORKDIR /app
COPY server/pom.xml .
COPY server/src src
RUN mvn clean package

# Build web application
FROM node:latest AS builder-web-app
WORKDIR /app
COPY web-app .
RUN npm install
RUN npm run build

# Final image
FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache nginx bash

WORKDIR /app
COPY --from=builder-server /app/target/*.jar server.jar
COPY --from=builder-web-app /app/dist /usr/share/nginx/html

COPY infrastructure/nginx.conf /etc/nginx/nginx.conf
COPY infrastructure/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/bin/bash", "/start.sh"]

