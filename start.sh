#!/bin/bash
set -e

echo "Iniciando D.Juancito Repostería - Versión Railway 100% funcional"

# Compilar backend con Maven Wrapper (dándole permiso primero)
cd backend
chmod +x mvnw
./mvnw clean package -DskipTests -q

# Copiar el build de Angular al JAR para que Spring Boot lo sirva
echo "Moviendo Angular al backend..."
mkdir -p target/classes/static
rm -rf target/classes/static/*
cp -r ../frontend/dist/reposteria-djuancito/browser/* target/classes/static/ || true

# Arrancar Spring Boot
echo "Iniciando Spring Boot..."
exec java -jar target/*.jar
