# Herencia Perfumería - E-Commerce Escalable

E-commerce profesional, modular y escalable para Herencia Perfumería con soporte para múltiples marcas, categorías y segmentación comercial (Original vs Réplicas).

## 🎯 Características

- ✅ Segmentación comercial (100% Original vs Réplicas 1.1)
- ✅ Catálogo dinámico y escalable sin datos hardcodeados
- ✅ Sistema de filtros avanzado (marca, género, tendencias, búsqueda)
- ✅ Paginación automática
- ✅ Carrito de compras con generación de referencias
- ✅ Panel admin escalable
- ✅ Autenticación segura (bcrypt + Zod)
- ✅ Integración Supabase (PostgreSQL + Storage)
- ✅ Diseño elegante y minimalista
- ✅ Preparado para producción (Vercel)

## 🏗 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS
- **Base de Datos**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Storage**: Supabase Storage
- **Validación**: Zod
- **Seguridad**: bcrypt
- **Arquitectura**: Service + Repository Pattern

## 📦 Estructura de Carpetas

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── admin/             # Panel Admin
│   ├── original/          # Catálogo 100% Original
│   ├── replicas/          # Catálogo Réplicas
│   ├── layout.tsx         # Layout raíz
│   ├── page.tsx           # Gateway de segmentación
│   └── globals.css
├── components/            # Componentes React
│   ├── layout/           # Navbar, Footer, etc.
│   └── catalog/          # Componentes de catálogo
├── services/             # Lógica de negocio
├── repositories/         # Acceso a datos (Prisma)
├── lib/                  # Utilidades y helpers
├── types/                # Tipos TypeScript
└── prisma/              # Schema y migrations
```

## 🗃 Modelo de Base de Datos

```typescript
-Marca(id, nombre, activo) -
  Categoria(id, nombre, tipo, activa) -
  Producto(
    id,
    nombre,
    descripcion,
    tipo,
    genero,
    marca,
    precio,
    imagenUrl,
    destacado,
    activo,
  ) -
  Pedido(id, referencia, productos, total, estado);
```

## 🚀 Instalación

### Prerequisitos

- Node.js 18+
- npm o yarn
- PostgreSQL (Supabase)

### Pasos

1. **Clonar repositorio**

```bash
git clone <repository>
cd perfumeria-herencia
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

4. **Configurar Prisma**

```bash
npx prisma migrate dev
npx prisma db seed
```

5. **Ejecutar en desarrollo**

```bash
npm run dev
```

El sitio estará disponible en `http://localhost:3000`

## 🎨 Paleta de Colores

- **Arena (Primario)**: #cea299
- **Wengué (Secundario)**: #5b3d3b
- **Nogal (Profundo)**: #382d2c
- **Fondo Base**: #f8f6f4

## 🔐 Autenticación Admin

El panel admin está protegido con autenticación por token. Las credenciales se asecuran con bcrypt.

Ruta: `/admin`

## 📱 Responsive Design

- Mobile First
- Diseño adaptable para todos los tamaños
- Optimizado para SEO

## 🚢 Deployment

Preparado para Vercel:

```bash
npm run build
npm start
```

## 📄 Licencia

MIT

## 👥 Soporte

Para reportar bugs o sugerencias, contactar al equipo de desarrollo.
