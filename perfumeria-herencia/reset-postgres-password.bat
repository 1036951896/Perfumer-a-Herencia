@echo off
chcp 65001 >nul
echo ========================================
echo RESETEAR CONTRASEÑA DE POSTGRESQL
echo ========================================
echo.
echo Este script va a:
echo 1. Hacer backup del archivo de configuración
echo 2. Permitir acceso temporal sin contraseña
echo 3. Reiniciar PostgreSQL
echo 4. Establecer la contraseña como: postgres
echo 5. Crear la base de datos
echo 6. Restaurar la configuración segura
echo.
echo Presiona Ctrl+C para cancelar o cualquier tecla para continuar...
pause >nul

echo.
echo [1/6] Haciendo backup de pg_hba.conf...
copy "C:\Program Files\PostgreSQL\18\data\pg_hba.conf" "C:\Program Files\PostgreSQL\18\data\pg_hba.conf.backup" >nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: No se pudo hacer backup. ¿Ejecutaste como Administrador?
    echo Haz clic derecho en este archivo y selecciona "Ejecutar como administrador"
    pause
    exit /b 1
)
echo ✅ Backup creado

echo.
echo [2/6] Modificando configuración para acceso temporal...
powershell -Command "(Get-Content 'C:\Program Files\PostgreSQL\18\data\pg_hba.conf') -replace 'host    all             all             127.0.0.1/32            scram-sha-256', 'host    all             all             127.0.0.1/32            trust' -replace 'host    all             all             ::1/128                 scram-sha-256', 'host    all             all             ::1/128                 trust' | Set-Content 'C:\Program Files\PostgreSQL\18\data\pg_hba.conf'"
echo ✅ Configuración modificada

echo.
echo [3/6] Reiniciando servicio PostgreSQL...
net stop postgresql-x64-18 >nul 2>&1
timeout /t 2 >nul
net start postgresql-x64-18 >nul 2>&1
timeout /t 3 >nul
echo ✅ Servicio reiniciado

echo.
echo [4/6] Estableciendo nueva contraseña (postgres)...
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
if %ERRORLEVEL% EQU 0 (
    echo ✅ Contraseña establecida correctamente
) else (
    echo ❌ Error al establecer contraseña
    goto restore
)

echo.
echo [5/6] Creando base de datos...
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d postgres -c "CREATE DATABASE perfumeria_herencia;"
if %ERRORLEVEL% EQU 0 (
    echo ✅ Base de datos creada
) else (
    echo ⚠️  La base de datos puede ya existir
)

:restore
echo.
echo [6/6] Restaurando configuración segura...
copy "C:\Program Files\PostgreSQL\18\data\pg_hba.conf.backup" "C:\Program Files\PostgreSQL\18\data\pg_hba.conf" >nul
net stop postgresql-x64-18 >nul 2>&1
timeout /t 2 >nul
net start postgresql-x64-18 >nul 2>&1
timeout /t 3 >nul
echo ✅ Configuración restaurada y servicio reiniciado

echo.
echo ========================================
echo ✅ CONFIGURACIÓN COMPLETADA
echo ========================================
echo.
echo Contraseña de PostgreSQL: postgres
echo Base de datos: perfumeria_herencia
echo.
echo Ahora ejecuta en PowerShell:
echo   cd perfumeria-herencia
echo   npx prisma generate
echo   npx prisma db push
echo   npm run dev
echo.
pause
