#!/bin/bash

echo "Iniciando D.Juancito Repostería (modo producción Railway)"

# 1. Compila el backend
cd backend
./mvnw clean package -DskipTests

# 2. Copia el build del Angular dentro del JAR de Spring Boot
echo "Copiando frontend al backend..."
mkdir -p target/classes/static
cp -r ../frontend/dist/reposteria-djuancito/browser/* target/classes/static/

# 3. Arranca solo el backend (él va a servir el frontend estático)
echo "Arrancando Spring Boot en puerto $PORT..."
java -jar target/*.jar
