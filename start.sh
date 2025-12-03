#!/bin/bash

echo "Iniciando D.Juancito Repostería - Modo Railway PRO"

# Compila el backend
cd backend || exit
./mvnw clean package -DskipTests -q

# Copia el build de Angular al JAR para que Spring Boot lo sirva
echo "Copiando frontend al backend..."
mkdir -p target/classes/static
rm -rf target/classes/static/* 2>/dev/null || true
cp -r ../frontend/dist/reposteria-djuancito/browser/* target/classes/static/ 2>/dev/null || cp -r ../frontend/dist/reposteria-djuancito/browser/. target/classes/static/ 2>/dev/null || true

# Arranca solo Spring Boot
echo "Arrancando Spring Boot en puerto $PORT..."
exec java -jar target/*.jar
