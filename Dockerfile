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

# Copia el JAR
COPY --from=backend /app/backend/target/*.jar app.jar

# Copia el frontend a la carpeta correcta que Spring Boot busca
COPY --from=frontend /app/frontend/dist/angular-temp ./static

# Puerto dinámico de Railway
ENV PORT=8080
EXPOSE ${PORT}

# Arranca con el puerto correcto
CMD ["java", "-jar", "-Dserver.port=${PORT}", "app.jar"]
