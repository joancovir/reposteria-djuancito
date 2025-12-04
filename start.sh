#!/bin/bash
set -e

echo "Iniciando D.Juancito Repostería - Versión FINAL Railway"

# --- 1. BUILD DEL FRONTEND (Angular) ---
echo "Instalando dependencias de Angular..."
cd frontend
npm install # <-- ¡Asegura que esta línea esté para descargar node_modules!
npm run build --configuration=production # o el comando de build que uses
cd ..

# --- 2. BUILD DEL BACKEND (Spring Boot) ---
echo "Compilando backend y copiando archivos estáticos..."
cd backend
chmod +x mvnw
# Este comando compila, empaqueta y (si está configurado en el pom.xml) copia los archivos de frontend a target/classes/static
./mvnw clean package -DskipTests -q 

# --- 3. EXECUCIÓN (Esta parte es opcional si usas el startCommand en railway.json) ---
# Si tu railway.json ya tiene el startCommand, puedes omitir esta línea, 
# pero la dejaremos como respaldo si Railway la necesita para la fase de Build/Start:
# exec java -jar target/*.jar --server.port=$PORT 

# Volvemos a la carpeta raíz para que los comandos de Railway funcionen bien después
cd ..
