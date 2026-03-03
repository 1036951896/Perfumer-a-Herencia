#!/bin/bash
# Script para configurar PostgreSQL local
# Ejecuta este script desde Git Bash

echo "=== Configurando PostgreSQL Local ==="
echo ""

# Agregar PostgreSQL al PATH
export PATH="/c/Program Files/PostgreSQL/18/bin:$PATH"

echo "✓ PATH configurado"
echo ""

# Verificar versión de PostgreSQL
echo "Versión de PostgreSQL:"
psql --version
echo ""

# Contraseña correcta
PASSWORD="Sa3116579677"

# Intentar crear la base de datos
echo "Creando base de datos 'perfumeria_herencia'..."
echo ""

PGPASSWORD=$PASSWORD createdb -U postgres -h localhost perfumeria_herencia 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Base de datos creada exitosamente!"
    echo ""
    
    # Verificar que existe
    echo "=== Verificando base de datos ==="
    PGPASSWORD=$PASSWORD psql -U postgres -h localhost -l 2>&1 | grep perfumeria
    echo ""
    
    echo "✅ PostgreSQL configurado correctamente!"
    echo ""
    echo "=== Siguiente paso: Ejecutar migraciones ==="
    echo "Ejecuta estos comandos:"
    echo "  npx prisma generate"
    echo "  npx prisma db push"
    echo "  npm run dev"
else
    echo "❌ Error al crear la base de datos"
    echo "Verifica la contraseña o el estado del servicio PostgreSQL"
fi
