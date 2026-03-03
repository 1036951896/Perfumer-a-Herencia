# 🗄️ Guía: Configurar PostgreSQL Local

## ✅ Ya completado:

- ✓ PostgreSQL 18 instalado
- ✓ Servicio corriendo
- ✓ Archivo `.env` actualizado
- ✓ Backup de Supabase creado (`.env.supabase.backup`)

## 📋 Pasos a seguir:

### **Opción 1: Usando SQL Shell (psql)** ⭐ Recomendado

1. **Abre SQL Shell (psql):**
   - Presiona la tecla Windows
   - Busca "SQL Shell" o "psql"
   - Abre la aplicación

2. **Conéctate a PostgreSQL:**

   ```
   Server [localhost]: (presiona Enter)
   Database [postgres]: (presiona Enter)
   Port [5432]: (presiona Enter)
   Username [postgres]: (presiona Enter)
   Password for user postgres:
   ```

   Prueba estas contraseñas en orden:
   - Presiona Enter (sin contraseña)
   - Escribe: `postgres`
   - Escribe: `admin`
   - Escribe: `root`

3. **Si ninguna funciona, establece la contraseña:**
   Si logras entrar, ejecuta:

   ```sql
   ALTER USER postgres WITH PASSWORD 'postgres';
   ```

4. **Crea la base de datos:**

   ```sql
   CREATE DATABASE perfumeria_herencia;
   ```

5. **Verifica:**
   ```sql
   \l
   ```
   Deberías ver `perfumeria_herencia` en la lista.

### **Opción 2: Usando pgAdmin 4** 🖥️

1. **Abre pgAdmin 4:**
   - Menú Inicio → busca "pgAdmin 4"
   - Al abrirse, te pedirá una contraseña maestra (la que estableciste al instalar)

2. **Conecta al servidor:**
   - En el panel izquierdo, haz clic en "Servers" → "PostgreSQL 18"
   - Si pide contraseña, prueba: `postgres`, `admin`, o déjala vacía

3. **Crea la base de datos:**
   - Clic derecho en "Databases" → "Create" → "Database"
   - Database: `perfumeria_herencia`
   - Owner: `postgres`
   - Clic en "Save"

4. **Establece la contraseña (si es necesario):**
   - Clic derecho en "Login/Group Roles" → "postgres" → "Properties"
   - Pestaña "Definition"
   - Password: `postgres`
   - Clic en "Save"

---

## 🚀 Después de configurar:

Vuelve a VS Code y ejecuta en la terminal:

```powershell
cd perfumeria-herencia
npx prisma generate
npx prisma db push
npm run dev
```

---

## 🔄 Para volver a Supabase:

Si quieres volver a usar Supabase en el futuro:

1. Abre `.env.supabase.backup`
2. Copia el contenido
3. Reemplaza el `DATABASE_URL` en `.env`

---

## ❓ Problemas comunes:

**Error: contraseña incorrecta**

- Intenta las contraseñas sugeridas arriba
- O reinstala PostgreSQL y anota la contraseña

**Error: base de datos no existe**

- Asegúrate de crear la base de datos `perfumeria_herencia`

**Error: no puede conectar**

- Verifica que el servicio esté corriendo: `Get-Service postgresql-x64-18`
- Reinicia el servicio si es necesario

---

## 📞 ¿Necesitas ayuda?

Si encuentras algún problema, avísame qué error ves y te ayudaré.
