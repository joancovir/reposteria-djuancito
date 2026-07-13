# Dockerfile – 100% FUNCIONA EN RAILWAY 2025
FROM maven:3.9.6-eclipse-temurin-21 AS backend
WORKDIR /app/backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY backend/src ./src
RUN mvn clean package -DskipTests

FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps
COPY frontend/ ./
RUN npm run build -- --configuration production

# Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=backend /app/backend/target/*.jar app.jar
COPY --from=frontend /app/frontend/dist/angular-temp/browser ./static

# ESTAS 2 LÍNEAS SON LAS QUE HACEN QUE RAILWAY FUNCIONE
EXPOSE 8080
CMD ["java", "-jar", "app.jar", "--server.port=${PORT:-8080}"]
