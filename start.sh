#!/bin/bash
set -e

echo "Iniciando D.Juancito Repostería - Versión FINAL Railway"

# Compilar backend
cd backend
chmod +x mvnw
./mvnw clean package -DskipTests -q

# Copiar Angular al JAR
echo "Moviendo frontend a static..."
mkdir -p target/classes/static
rm -rf target/classes/static/*
cp -r ../frontend/dist/reposteria-djuancito/browser/* target/classes/static/ || true

# Arrancar Spring Boot usando el puerto que Railway nos da
echo "Iniciando Spring Boot en puerto $PORT"
exec java -jar target/*.jar --server.port=$PORT
