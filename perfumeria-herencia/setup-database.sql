-- Script para configurar PostgreSQL local
-- Ejecuta esto en SQL Shell (psql) o pgAdmin

-- 1. Establecer contraseña para usuario postgres (si es necesario)
-- ALTER USER postgres WITH PASSWORD 'postgres';

-- 2. Crear la base de datos para el proyecto
CREATE DATABASE perfumeria_herencia
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Spain.1252'
    LC_CTYPE = 'Spanish_Spain.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- 3. Conectar a la base de datos
\c perfumeria_herencia

-- 4. Mensaje de confirmación
SELECT 'Base de datos perfumeria_herencia creada correctamente!' AS mensaje;
