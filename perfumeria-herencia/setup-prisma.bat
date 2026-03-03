@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo CONFIGURAR BASE DE DATOS CON PRISMA
echo ========================================
echo.

echo [1/3] Generando cliente de Prisma...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al generar cliente
    pause
    exit /b 1
)
echo ✅ Cliente generado

echo.
echo [2/3] Aplicando migraciones (creando tablas)...
call npx prisma db push
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al aplicar migraciones
    pause
    exit /b 1
)
echo ✅ Tablas creadas

echo.
echo [3/3] Opcional: ¿Quieres cargar datos de ejemplo?
echo Presiona S para cargar datos o cualquier otra tecla para omitir...
choice /c SN /n /m "Cargar datos de ejemplo? [S/N]: "
if %ERRORLEVEL% EQU 1 (
    echo Cargando datos de ejemplo...
    call npx prisma db seed
)

echo.
echo ========================================
echo ✅ BASE DE DATOS CONFIGURADA
echo ========================================
echo.
echo La base de datos está lista para usar.
echo.
echo Para iniciar el servidor de desarrollo:
echo   npm run dev
echo.
pause
