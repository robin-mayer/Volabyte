FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src src
RUN mvn clean package

FROM eclipse-temurin:21-jre
WORKDIR /app
ENV STORAGE_UPLOADS=/data/uploads
RUN mkdir -p /data/uploads
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]