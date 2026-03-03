@echo off
chcp 65001 >nul
echo ========================================
echo Configurando PostgreSQL Local
echo ========================================
echo.

set PGPASSWORD=Sa3116579677

echo Creando base de datos 'perfumeria_herencia'...
"C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres -h localhost perfumeria_herencia

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Base de datos creada exitosamente!
) else (
    echo.
    echo ⚠️  Error o la base de datos ya existe
)

echo.
echo Verificando bases de datos...
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -l | findstr "perfumeria"

echo.
echo ========================================
echo Configuración completada
echo ========================================
echo.
echo Ahora ejecuta estos comandos en PowerShell:
echo   cd perfumeria-herencia
echo   npx prisma generate
echo   npx prisma db push
echo   npm run dev
echo.
pause
