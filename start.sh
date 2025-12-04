#!/bin/bash
set -e

echo "Iniciando D.Juancito Repostería - Versión FINAL Railway"

# --- 1. BUILD DEL FRONTEND (Angular) ---
echo "Instalando dependencias de Angular..."
cd frontend
# --- CORRECCIÓN AQUÍ ---
npm install --legacy-peer-deps 
# -----------------------
npm run build --configuration=production # o npm run build
cd ..

# --- 2. BUILD DEL BACKEND (Spring Boot) ---
echo "Compilando backend y copiando archivos estáticos..."
cd backend
chmod +x mvnw
# Este comando compila, empaqueta y copia el frontend dentro del JAR
./mvnw clean package -DskipTests -q 

# --- 3. EXECUCIÓN ---
# El startCommand en railway.json se encarga de esto:
# exec java -jar target/*.jar --server.port=$PORT
