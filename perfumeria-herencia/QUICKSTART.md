# ⚡ QUICK START - 5 MINUTOS

La forma más rápida para empezar a desarrollar.

---

## 1️⃣ Clonar y Setup (2 min)

```bash
cd perfumeria-herencia

# Instalar
npm install

# Copiar env
cp .env.example .env.local
```

---

## 2️⃣ Configurar BD Supabase (2 min)

1. Ir a https://supabase.com/dashboard
2. Crear proyecto
3. Copiar **Connection String** desde Settings → Database
4. Pegar en `.env.local`:

```env
DATABASE_URL=postgresql://...
```

---

## 3️⃣ Crear Tablas + Datos (1 min)

```bash
# Crear schema
npx prisma migrate dev --name init

# Agregar datos
npm run prisma:seed
```

---

## 4️⃣ Ejecutar

```bash
npm run dev

# Abre http://localhost:3000
```

---

## ✅ ¡Listo!

- Gateway funcional ✅
- Catálogos cargando ✅
- Carrito disponible ✅
- APIs respondiendo ✅

---

## 📚 Documentación Completa

| Archivo               | Para Qué                   |
| --------------------- | -------------------------- |
| **SETUP.md**          | Guía detallada paso a paso |
| **EXAMPLES.md**       | Ejemplos de API y código   |
| **PROJECT_STATUS.md** | Estado actual del proyecto |
| **README.md**         | Overview general           |

---

## 🚀 Próximos Pasos

```bash
npx prisma studio         # Ver BD
npm run build             # Compilar
npm start                 # Producción
```

---

**¿Preguntas?** Ver SETUP.md o contactar al equipo.
