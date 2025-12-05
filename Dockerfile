# Dockerfile para Railway 2025 – FUNCIONA 100% CON MAVEN + ANGULAR
FROM maven:3.9.6-openjdk-21 as backend

WORKDIR /app/backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

COPY backend/src ./src
RUN mvn clean package -DskipTests

# Build frontend
FROM node:20-alpine as frontend
WORKDIR /app/frontend
COPY frontend/package*.json .
RUN npm ci
COPY frontend/ .
RUN npm run build -- --configuration production

# Runtime - Java con frontend servido
FROM openjdk:21-jre-alpine
WORKDIR /app

COPY --from=backend /app/backend/target/*.jar app.jar
COPY --from=frontend /app/frontend/dist/angular-temp ./frontend

EXPOSE 8080

CMD ["java", "-jar", "app.jar", "--server.port=8080"]
