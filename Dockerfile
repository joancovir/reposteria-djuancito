# Dockerfile para Railway 2025 – FIX ERESOLVE con legacy-peer-deps
FROM maven:3.9.6-eclipse-temurin-21 as backend

WORKDIR /app/backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Frontend con FIX para ERESOLVE
FROM node:20-alpine as frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps  # ← ESTA LÍNEA ARREGLA EL ERESOLVE
COPY frontend/ ./
RUN npm run build -- --configuration production

# Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=backend /app/backend/target/*.jar app.jar
COPY --from=frontend /app/frontend/dist/angular-temp ./frontend

EXPOSE 8080

CMD ["java", "-jar", "app.jar", "--server.port=8080"]

CMD ["java", "-jar", "app.jar", "--server.port=8080"]
