# 🚀 GUÍA DE SETUP COMPLETA - Herencia Perfumería

## Tabla de Contenidos

1. [Prerequisitos](#prerequisitos)
2. [Instalación Inicial](#instalación-inicial)
3. [Configuración de Base de Datos](#configuración-de-base-de-datos)
4. [Desarrollo Local](#desarrollo-local)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [API Endpoints](#api-endpoints)
7. [Deployment](#deployment)
8. [Solución de Problemas](#solución-de-problemas)

---

## Prerequisitos

Asegúrate de tener instalado:

- **Node.js** 18.0 o superior
- **npm** 8.0 o superior (o yarn/pnpm)
- **Git**
- **Cuenta en Supabase** (https://supabase.com)

Verifica las versiones:

```bash
node --version  # v18.0.0 o superior
npm --version   # 8.0.0 o superior
```

---

## Instalación Inicial

### 1. Clonar Repositorio

```bash
git clone <tu-repositorio-url>
cd perfumeria-herencia
```

### 2. Instalar Dependencias

```bash
npm install
```

Esto descargará:

- Next.js 14
- React 18
- Prisma
- TailwindCSS
- Zod
- y otras dependencias

⏱ **Tiempo estimado**: 2-3 minutos

### 3. Verificar Instalación

```bash
npm run lint  # Sin errores = OK
```

---

## Configuración de Base de Datos

### Paso 1: Crear Proyecto en Supabase

1. Ir a https://supabase.com
2. Crear cuenta (o login)
3. Crear nuevo proyecto
   - Nombre: `perfumeria-herencia`
   - Región: Seleccionar la más cercana
   - Contraseña: Guardar en lugar seguro

### Paso 2: Obtener Credenciales

1. En Supabase, ir a **Settings** → **Database**
2. Copiar **Connection String** (escoger "URI")
3. Se verá así:

```
postgresql://postgres.[PROYECTO]:[CONTRASEÑA]@db.[REGIÓN].supabase.co:5432/postgres
```

### Paso 3: Crear Archivo `.env.local`

Copiar contenido de `.env.example`:

```bash
cp .env.example .env.local
```

Llenar `.env.local`:

```env
# Base de Datos - REEMPLAZA CON TUS CREDENCIALES
DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# Supabase (opcional por ahora)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxx
SUPABASE_SERVICE_KEY=xxxxxx

# Admin
ADMIN_SECRET_KEY=mi-clave-secreta-super-segura
```

### Paso 4: Crear Schema de BD

```bash
# Crear tablas automáticamente
npx prisma migrate dev --name init
```

Te pedirá un nombre, escribe: `init`

Esto creará:

- ✅ Tabla `marcas`
- ✅ Tabla `productos`
- ✅ Tabla `categorias`
- ✅ Tabla `pedidos`
- ✅ Tabla `admin_users`
- Y otras tablas relacionadas

### Paso 5: Cargar Datos de Ejemplo

```bash
npm run prisma:seed
```

Esto cargará:

- 6 marcas
- 11 productos (6 originales + 5 réplicas)
- 4 categorías

Puedes ver los datos en Supabase → SQL Editor o con:

```bash
npx prisma studio
```

---

## Desarrollo Local

### Ejecutar en Desarrollo

```bash
npm run dev
```

Abre: http://localhost:3000

### Estructura de Carpetas Importantes

```
src/
├── app/
│   ├── page.tsx            👈 Gateway (seleccionar Original/Réplicas)
│   ├── (catalog)/original   👈 Catálogo Original
│   ├── (catalog)/replicas   👈 Catálogo Réplicas
│   ├── api/
│   │   ├── productos        👈 API de productos
│   │   ├── marcas           👈 API de marcas
│   │   ├── generos          👈 API de géneros
│   │   └── pedidos          👈 API de pedidos
│   └── globals.css          👈 Estilos globales
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      👈 Navegación
│   │   └── Footer.tsx      👈 Pie de página
│   └── catalog/
│       ├── ProductCard.tsx      👈 Tarjeta de producto
│       ├── FiltroBuscador.tsx   👈 Filtros
│       ├── CatalogoPorSegmento.tsx  👈 Grid de productos
│       └── CarritoCompras.tsx       👈 Carrito
│
├── services/               👈 Lógica de negocio
├── repositories/           👈 Acceso a datos (Prisma)
├── lib/
│   ├── utils.ts           👈 Funciones útiles
│   └── validations.ts     👈 Schemas Zod
└── types/
    └── index.ts           👈 Tipos TypeScript
```

### Flujo de Navegación

```
/ (Gateway)
├─ Usuario selecciona "Original"
│  └─ /original
│     ├─ Navbar (botones para cambiar segment o ver carrito)
│     ├─ Filtros (marca, género, búsqueda)
│     ├─ Grid de productos
│     ├─ /original/producto/[id] (detalle)
│     └─ /original/carrito
│
└─ Usuario selecciona "Réplicas"
   └─ /replicas
      ├─ Navbar
      ├─ Filtros
      ├─ Grid de productos
      ├─ /replicas/producto/[id]
      └─ /replicas/carrito
```

---

## API Endpoints

### Productos

```bash
# Listar con filtros
GET /api/productos?tipo=ORIGINAL&genero=MASCULINO&marcaId=uuid&busqueda=chanel&pagina=1&limite=12

# Obtener uno
GET /api/productos/[id]

# Crear (admin, próximo)
POST /api/productos

# Actualizar (admin, próximo)
PUT /api/productos/[id]
```

Ejemplo de respuesta:

```json
{
  "exito": true,
  "datos": [
    {
      "id": "uuid",
      "nombre": "Chanel No. 5",
      "tipo": "ORIGINAL",
      "genero": "FEMENINO",
      "precio": 180000,
      "imagenUrl": "https://...",
      "marca": { "id": "uuid", "nombre": "Chanel" }
    }
  ],
  "total": 100,
  "pagina": 1,
  "limite": 12,
  "totalPaginas": 9
}
```

### Marcas

```bash
# Listar todas
GET /api/marcas

# Crear (admin, próximo)
POST /api/marcas
```

### Géneros

```bash
# Listar géneros disponibles
GET /api/generos
```

### Pedidos

```bash
# Crear pedido
POST /api/pedidos
Body:
{
  "items": [
    {
      "productoId": "uuid",
      "cantidad": 2
    }
  ]
}

# Listar pedidos (admin, próximo)
GET /api/pedidos?pagina=1&limite=20

# Obtener uno
GET /api/pedidos/[id]
```

---

## Variables de Entorno

| Variable                        | Requisita | Descripción                           |
| ------------------------------- | --------- | ------------------------------------- |
| `DATABASE_URL`                  | ✅        | URL conexión PostgreSQL Supabase      |
| `NEXT_PUBLIC_SUPABASE_URL`      | ⏭️        | URL de Supabase (para Storage future) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⏭️        | Clave anónima Supabase                |
| `SUPABASE_SERVICE_KEY`          | ⏭️        | Clave de servicio Supabase            |
| `ADMIN_SECRET_KEY`              | ✅        | Clave para panel admin                |

✅ = Necesaria ahora
⏭️ = Para futuro

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev              # Inicia servidor desarrollo

# Build & Production
npm run build            # Compila para producción
npm start                # Inicia servidor producción

# Prisma
npx prisma studio       # GUI para ver/editar BD
npx prisma migrate dev  # Crear nueva migration
npm run prisma:seed     # Ejecutar seed
npx prisma migrate reset # CUIDADO: Limpia BD y re-seed

# Linter
npm run lint             # Revisar errores

# Otros
npm install [paquete]   # Instalar dependencia
```

---

## Design System

### Colores

- **@primary (#cea299)**: Botones, highlight original
- **@dark (#5b3d3b)**: Texto secundario, botones réplicas
- **@deep (#382d2c)**: Texto principal, botones deep
- **@background (#f8f6f4)**: Fondo páginas

### Uso en TailwindCSS

```tsx
<div className="bg-primary">        {/* #cea299 */}
<div className="text-dark">          {/* #5b3d3b */}
<div className="bg-deep">            {/* #382d2c */}
<div className="bg-background">      {/* #f8f6f4 */}
```

### Fuente

- **Magnetik Light (300)**: Descripciones, textos
- **Magnetik Bold (700)**: Headers, botones

```tsx
<h1 className="font-magnetik font-bold">Título</h1>
```

---

## Deployment en Vercel

### Opción 1: Automático (Recomendado)

1. Push código a GitHub
2. Ir a https://vercel.com/import
3. Seleccionar repositorio
4. Agregar variables de entorno:
   - DATABASE_URL
   - ADMIN_SECRET_KEY
   - (etc...)
5. Deploy automático en cada push

### Opción 2: Manual

```bash
npm run build   # Compila
npm start       # Inicia servidor
```

### Checklist pre-deploy

- [ ] `.env.local` no está en git (.gitignore)
- [ ] BASE_URL es correcta en Supabase
- [ ] Variables de entorno en Vercel
- [ ] Build local sin errores: `npm run build`

---

## Solución de Problemas

### Error: "DATABASE_URL no está definida"

```bash
# Solución:
# 1. Verificar que .env.local existe
# 2. Reiniciar servidor: Ctrl+C y npm run dev
# 3. Verifica que DATABASE_URL está correcta
```

### Error: "Migraciones no encontradas"

```bash
# Solución:
npx prisma migrate dev --name init
```

### Error: "No hay datos en el catálogo"

```bash
# Solución:
npm run prisma:seed
```

### Error: "El puerto 3000 está en uso"

```bash
# Ejecutar en otro puerto:
npm run dev -- -p 3001
```

### Error: "Tipos de Prisma no generados"

```bash
# Solución:
npx prisma generate
```

---

## Próximos Pasos

1. ✅ **Setup completado**
2. ⏭️ Panel Admin (CRUD de productos)
3. ⏭️ Pasarelas de pago (Stripe/PayPal)
4. ⏭️ Sistema de inventario
5. ⏭️ Autenticación con Supabase Auth
6. ⏭️ Analytics y reportes

---

## Recursos Útiles

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **TailwindCSS**: https://tailwindcss.com/docs
- **Supabase**: https://supabase.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

**¿Problemas?** Contacta al equipo de desarrollo.
