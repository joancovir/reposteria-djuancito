# DOCKERFILE 100% FUNCIONAL EN RAILWAY ABRIL 2025
FROM maven:3.9.6-eclipse-temurin-21 as backend

WORKDIR /app/backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Frontend
FROM node:20-alpine as frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build -- --configuration production

# Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=backend /app/backend/target/*.jar app.jar
COPY --from=frontend /app/frontend/dist/angular-temp ./frontend

EXPOSE 8080

CMD ["java", "-jar", "app.jar", "--server.port=8080"]
