# Herencia Perfumería - Guía de Configuración

## Setup Inicial

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Base de Datos (Supabase PostgreSQL)

1. Crear un proyecto en [Supabase](https://supabase.com)
2. Copiar la URL de conexión PostgreSQL
3. Crear archivo `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host:5432/perfumeria_herencia
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
ADMIN_SECRET_KEY=your-secret-key-for-admin-panel
```

### 3. Ejecutar Migrations y Seed

```bash
# Crear tablas
npx prisma migrate dev --name init

# Crear datos de ejemplo
npm run prisma:seed
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Navega a `http://localhost:3000`

## Arquitectura

- **Frontend**: React + Next.js 14 (App Router)
- **Backend**: API Routes de Next.js
- **BD**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Estilos**: TailwindCSS + Custom CSS

## Capas de Arquitectura

1. **API Routes** (`/api`) - Manejo de requests
2. **Services** (`/services`) - Lógica de negocio
3. **Repositories** (`/repositories`) - Acceso a datos
4. **Components** (`/components`) - UI reutilizable
5. **Types** (`/types`) - TypeScript types

## Gateway de Segmentación

- `/` - Pantalla inicial (seleccionar Original vs Réplicas)
- `/original` - Catálogo 100% Original
- `/replicas` - Catálogo Réplicas 1.1

La selección se guarda en localStorage y es persistente.

## Panel Admin

- Ruta: `/admin`
- Autenticación: Email + Password (bcrypt)
- Funciones:
  - Gestión de marcas
  - Gestión de productos
  - Gestión de pedidos
  - Subida de imágenes

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| DATABASE_URL | Conexión PostgreSQL |
| NEXT_PUBLIC_SUPABASE_URL | URL de Supabase |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Clave anónima Supabase |
| SUPABASE_SERVICE_KEY | Clave de servicio Supabase |
| ADMIN_SECRET_KEY | Clave para autenticación admin |

## API Endpoints

### Productos
- `GET /api/productos` - Listar con filtros
- `POST /api/productos` - Crear (admin)
- `PUT /api/productos/[id]` - Actualizar (admin)

### Marcas
- `GET /api/marcas` - Listar todas

### Géneros
- `GET /api/generos` - Listar géneros disponibles

### Pedidos
- `POST /api/pedidos` - Crear pedido
- `GET /api/pedidos/[id]` - Obtener pedido

## Deployment (Vercel)

```bash
# Build
npm run build

# Start
npm start
```

El proyecto está completamente preparado para deploying en Vercel.

## Estructura de Carpetas

```
src/
├── app/                    # Next.js App Router
├── components/             # Componentes React
├── services/              # Lógica de negocio
├── repositories/          # Acceso a datos
├── lib/                   # Utilities
├── types/                 # TypeScript types
└── prisma/               # Schema y migrations
```

## Design System

- **Color Primario**: #cea299 (Arena)
- **Color Secundario**: #5b3d3b (Wengué)
- **Color Profundo**: #382d2c (Nogal)
- **Fondo**: #f8f6f4
- **Fuente**: Magnetik (Light 300, Bold 700)

## Próximas Fases

- [ ] Integración de pasarelas de pago
- [ ] Sistema de inventario
- [ ] CRM básico
- [ ] Reportes avanzados
- [ ] Integraciones externas

## Soporte

Para issues o preguntas, contactar al equipo de desarrollo.
