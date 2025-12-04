#!/bin/bash
set -e

echo "Iniciando D.Juancito Repostería - Versión FINAL Railway"

# --- 1. BUILD DEL FRONTEND (Angular) ---
echo "Iniciando build de Angular..."
cd frontend
npm install
npm run build --configuration=production # o npm run build
cd ..

# --- 2. BUILD DEL BACKEND (Spring Boot) ---
cd backend
chmod +x mvnw
# Este comando compila y empaqueta el frontend dentro del JAR
./mvnw clean package -DskipTests -q 

# --- 3. COPIADO (Esto solo es necesario si Maven no lo hace) ---
# Si tu pom.xml no copia los archivos de Angular automáticamente, esta línea es vital:
# cp -r frontend/dist/reposteria-djuancito/browser/* target/classes/static/ || true

# Ya no necesitamos el 'exec java...' aquí, porque 'railway.json' lo hace por nosotros.
