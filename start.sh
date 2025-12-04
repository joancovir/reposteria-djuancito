#!/bin/bash
set -e

echo "Iniciando D.Juancito Repostería - Versión FINAL Railway"

# --- 1. BUILD DEL FRONTEND (Angular) ---
echo "Iniciando build de Angular..."
cd frontend
npm install
npm run build --configuration=production # Usa el flag de produccion para un build optimizado
cd ..

# --- 2. BUILD DEL BACKEND (Spring Boot) Y COPIADO DEL FRONTEND ---
cd backend
chmod +x mvnw
./mvnw clean package -DskipTests -q # Este comando construye el JAR y copia los recursos estáticos

# (Opcional) Si necesitas copiar manualmente si Maven no lo hace automáticamente:
# Asegúrate que el directorio de Angular sea correcto:
# cp -r ../frontend/dist/reposteria-djuancito/browser/* target/classes/static/ || true

# --- 3. EXECUCIÓN ---
# El startCommand en railway.json se encargará de ejecutar esto:
# exec java -jar target/*.jar --server.port=$PORT 

# MANTENEMOS la ejecución al final del script para pruebas:
exec java -jar target/*.jar --server.port=$PORT
