#!/bin/bash

# Script para Railway - arranca frontend y backend en paralelo

echo "🚀 Iniciando D.Juancito Repostería..."

# Arranca el backend (Spring Boot)
echo "Backend: Compilando y arrancando..."
cd backend
./mvnw clean package -DskipTests
java -jar target/*.jar &

# Arranca el frontend (Angular)
echo "Frontend: Compilando y sirviendo..."
cd ../frontend
npm run build
npx serve -s dist/reposteria-djuancito/browser -l $PORT &
echo "D.Juancito listo en https://reposteria-djuancito.up.railway.app"
# Espera a que ambos terminen
wait
