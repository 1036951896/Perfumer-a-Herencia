# Script de PowerShell para crear la base de datos PostgreSQL
$env:PGPASSWORD = "Sa3116579677"
$psqlPath = "C:\Program Files\PostgreSQL\18\bin"

Write-Host "=== Configurando PostgreSQL Local ===" -ForegroundColor Cyan
Write-Host ""

# Crear la base de datos
Write-Host "Creando base de datos 'perfumeria_herencia'..." -ForegroundColor Yellow
& "$psqlPath\createdb.exe" -U postgres -h localhost perfumeria_herencia 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Base de datos creada exitosamente!" -ForegroundColor Green
}
else {
    Write-Host "⚠️  La base de datos puede ya existir o hubo un error" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Verificando base de datos..." -ForegroundColor Yellow
& "$psqlPath\psql.exe" -U postgres -h localhost -l 2>&1 | Select-String "perfumeria"

Write-Host ""
Write-Host "=== Siguiente paso: Ejecutar migraciones ===" -ForegroundColor Cyan
Write-Host "Ejecuta estos comandos:"
Write-Host "  npx prisma generate" -ForegroundColor White
Write-Host "  npx prisma db push" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
