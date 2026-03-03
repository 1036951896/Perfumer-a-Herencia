# 📚 EJEMPLOS DE USO - API & FUNCIONES

Guía rápida con ejemplos prácticos de cómo usar la API y funciones del proyecto.

---

## 🔗 API ENDPOINTS

### 1. Obtener Lista de Productos con Filtros

#### Endpoint

```
GET /api/productos?tipo=ORIGINAL&genero=MASCULINO&marcaId=uuid&busqueda=sauvage&pagina=1&limite=12
```

#### Parámetros Opcionales

| Parámetro  | Tipo   | Ejemplo                                | Descripción                  |
| ---------- | ------ | -------------------------------------- | ---------------------------- |
| `tipo`     | string | `ORIGINAL`, `REPLICA`                  | Tipo de producto             |
| `genero`   | string | `MASCULINO`, `FEMENINO`, `UNISEX`      | Género                       |
| `marcaId`  | uuid   | `550e8400-e29b-41d4-a716-446655440000` | ID de marca                  |
| `busqueda` | string | `chanel`                               | Buscar en nombre/descripción |
| `pagina`   | number | `1`                                    | # de página                  |
| `limite`   | number | `12`                                   | Items por página             |

#### Respuesta Exitosa (200)

```json
{
  "exito": true,
  "datos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nombre": "Dior Sauvage",
      "descripcion": "Perfume moderno y refrescante para hombre",
      "tipo": "ORIGINAL",
      "genero": "MASCULINO",
      "marcaId": "550e8400-e29b-41d4-a716-446655440001",
      "marca": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "nombre": "Dior",
        "activo": true
      },
      "precio": 165000,
      "imagenUrl": "https://via.placeholder.com/300x300?text=Dior+Sauvage",
      "destacado": true,
      "activo": true,
      "createdAt": "2026-02-28T18:30:00Z"
    }
  ],
  "total": 45,
  "pagina": 1,
  "limite": 12,
  "totalPaginas": 4
}
```

#### Ejemplo en JavaScript (Fetch)

```javascript
async function obtenerProductos() {
  const params = new URLSearchParams({
    tipo: "ORIGINAL",
    genero: "MASCULINO",
    pagina: "1",
    limite: "12",
  });

  const response = await fetch(`/api/productos?${params}`);
  const data = await response.json();

  if (data.exito) {
    console.log(data.datos); // Array de productos
    console.log(data.totalPaginas);
  }
}
```

#### Ejemplo en React (Hook)

```typescript
import { useState, useEffect } from 'react'
import { Producto } from '@/types'

export function ProductoBuscador() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const buscar = async () => {
      setLoading(true)
      const response = await fetch(
        '/api/productos?tipo=ORIGINAL&genero=MASCULINO&pagina=1&limite=12'
      )
      const data = await response.json()
      setProductos(data.datos)
      setLoading(false)
    }

    buscar()
  }, [])

  return (
    <div className="grid grid-cols-3 gap-4">
      {productos.map(p => (
        <div key={p.id}>
          <h3>{p.nombre}</h3>
          <p>${p.precio}</p>
        </div>
      ))}
    </div>
  )
}
```

---

### 2. Obtener Detalle de un Producto

#### Endpoint

```
GET /api/productos/[id]
```

#### Ejemplo

```bash
curl http://localhost:3000/api/productos/550e8400-e29b-41d4-a716-446655440000
```

#### Respuesta (200)

```json
{
  "exito": true,
  "datos": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nombre": "Dior Sauvage",
    "descripcion": "Perfume moderno y refrescante para hombre",
    "tipo": "ORIGINAL",
    "genero": "MASCULINO",
    "precio": 165000,
    "imagenUrl": "https://...",
    "marca": { "id": "...", "nombre": "Dior" },
    "destacado": true
  }
}
```

#### Respuesta Error (404)

```json
{
  "exito": false,
  "mensaje": "Producto no encontrado"
}
```

---

### 3. Obtener Lista de Marcas

#### Endpoint

```
GET /api/marcas
```

#### Respuesta

```json
{
  "exito": true,
  "datos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "nombre": "Chanel",
      "activo": true
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "nombre": "Dior",
      "activo": true
    }
  ]
}
```

#### Uso en Componente

```tsx
import { useEffect, useState } from "react";
import { Marca } from "@/types";

export function MarcasSelect() {
  const [marcas, setMarcas] = useState<Marca[]>([]);

  useEffect(() => {
    fetch("/api/marcas")
      .then((r) => r.json())
      .then((data) => setMarcas(data.datos));
  }, []);

  return (
    <select>
      <option>Todas las marcas</option>
      {marcas.map((m) => (
        <option key={m.id} value={m.id}>
          {m.nombre}
        </option>
      ))}
    </select>
  );
}
```

---

### 4. Obtener Géneros Disponibles

#### Endpoint

```
GET /api/generos
```

#### Respuesta

```json
{
  "exito": true,
  "datos": ["MASCULINO", "FEMENINO", "UNISEX"]
}
```

---

### 5. Crear un Pedido

#### Endpoint

```
POST /api/pedidos
```

#### Body (JSON)

```json
{
  "items": [
    {
      "productoId": "550e8400-e29b-41d4-a716-446655440000",
      "cantidad": 2
    },
    {
      "productoId": "550e8400-e29b-41d4-a716-446655440001",
      "cantidad": 1
    }
  ]
}
```

#### Respuesta Exitosa (201)

```json
{
  "exito": true,
  "datos": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "referencia": "HP-2026-8745",
    "total": 495000,
    "estado": "PENDIENTE",
    "items": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "productoId": "550e8400-e29b-41d4-a716-446655440000",
        "cantidad": 2,
        "precio": 165000,
        "producto": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "nombre": "Dior Sauvage"
        }
      }
    ],
    "createdAt": "2026-02-28T18:30:00Z"
  }
}
```

#### Ejemplo JavaScript

```javascript
async function crearPedido() {
  const items = [
    { productoId: "uuid-1", cantidad: 2 },
    { productoId: "uuid-2", cantidad: 1 },
  ];

  const response = await fetch("/api/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  const data = await response.json();

  if (data.exito) {
    console.log("Referencia del pedido:", data.datos.referencia);
    // Redirigir a WhatsApp
    window.location.href = `https://wa.me/57xxxxx?text=Mi referencia es: ${data.datos.referencia}`;
  }
}
```

---

## 🛠 FUNCIONES HELPER (utils.ts)

### generarReferenciaPedido()

Genera referencia en formato `HP-YYYY-XXXX`

```typescript
import { generarReferenciaPedido } from "@/lib/utils";

const referencia = generarReferenciaPedido(); // "HP-2026-7523"
```

---

### formatarPrecio(numero)

Formatea precio a COP

```typescript
import { formatarPrecio } from "@/lib/utils";

const precio = formatarPrecio(165000); // "$165.000"
const noHay = formatarPrecio(null); // "Consultar precio"
```

---

### calcularTotal(items)

Suma el total del carrito

```typescript
import { calcularTotal } from "@/lib/utils";

const items = [
  { cantidad: 2, precio: 100000 },
  { cantidad: 1, precio: 50000 },
];

const total = calcularTotal(items); // 250000
```

---

### crearMensajeWhatsApp(referencia, items, total)

Genera mensaje formateado para WhatsApp

```typescript
import { crearMensajeWhatsApp } from "@/lib/utils";

const mensaje = crearMensajeWhatsApp(
  "HP-2026-7523",
  [
    { nombre: "Dior Sauvage", cantidad: 2, precio: 165000 },
    { nombre: "Chanel No. 5", cantidad: 1, precio: 180000 },
  ],
  510000,
);

// URL encoded y lista para WhatsApp:
window.location.href = `https://wa.me/57xxxxxxxxx?text=${mensaje}`;
```

---

### getSegmentoGuardado()

Obtiene el segment guardado en localStorage

```typescript
import { getSegmentoGuardado } from "@/lib/utils";

const segment = getSegmentoGuardado(); // "original" | "replicas" | null
```

---

### guardarSegmento(segment)

Guarda segment en localStorage

```typescript
import { guardarSegmento } from "@/lib/utils";

guardarSegmento("original"); // Guarda
guardarSegmento("replicas"); // Guarda
```

---

### esSegmentoValido(valor)

Valida si un segmento es válido

```typescript
import { esSegmentoValido } from "@/lib/utils";

esSegmentoValido("original"); // true
esSegmentoValido("replicas"); // true
esSegmentoValido("random"); // false
```

---

## 🎨 VALIDACIONES CON ZOD

### CrearProductoSchema

```typescript
import { CrearProductoSchema, CrearProductoInput } from "@/lib/validations";

try {
  const datos = CrearProductoSchema.parse({
    nombre: "Nuevo Perfume",
    tipo: "ORIGINAL",
    genero: "MASCULINO",
    marcaId: "uuid",
    precio: 150000,
    imagenUrl: "https://...",
  });
  // datos está validado y tipado
} catch (error) {
  console.log(error.errors);
}
```

---

### CrearPedidoSchema

```typescript
import { CrearPedidoSchema } from "@/lib/validations";

const datosValidados = CrearPedidoSchema.parse({
  items: [
    { productoId: "uuid", cantidad: 2 },
    { productoId: "uuid", cantidad: 1 },
  ],
});
```

---

## 📦 USANDO TYPES DE TypeScript

```typescript
import { Producto, Pedido, Marca, FiltroProductos } from "@/types";

// Tipado automático
const producto: Producto = {
  id: "uuid",
  nombre: "Chanel No. 5",
  tipo: "ORIGINAL",
  genero: "FEMENINO",
  precio: 180000,
  // ... más fields
};

// Filtros tipados
const filtros: FiltroProductos = {
  tipo: "ORIGINAL",
  genero: "MASCULINO",
  marcaId: "uuid",
  busqueda: "dior",
  pagina: 1,
  limite: 12,
};
```

---

## 🗂 REPOSITORY PATTERN

### Usar ProductoRepository

```typescript
import { ProductoRepository } from "@/repositories";

// Listar con filtros
const resultado = await ProductoRepository.obtenerConFiltros({
  tipo: "ORIGINAL",
  pagina: 1,
  limite: 12,
});

// Obtener uno
const producto = await ProductoRepository.obtenerPorId("uuid");

// Obtener destacados
const destacados = await ProductoRepository.obtenerDestacados(8);
```

---

## 🎯 SERVICE PATTERN

### Usar ProductoService

```typescript
import { ProductoService } from "@/services";

// En un API route o servidor
try {
  const productos = await ProductoService.obtenerConFiltros({
    tipo: "ORIGINAL",
    genero: "MASCULINO",
  });
} catch (error) {
  console.error(error.message);
}
```

---

## 🚀 EJEMPLO COMPLETO: Crear Pedido

### 1. Frontend (Carrito)

```typescript
'use client'
import { useState } from 'react'

export function CarritoCheckout() {
  const [loading, setLoading] = useState(false)

  const handleComprar = async () => {
    setLoading(true)

    // Items del carrito
    const items = [
      { productoId: 'uuid-1', cantidad: 2 },
      { productoId: 'uuid-2', cantidad: 1 }
    ]

    // Crear pedido
    const response = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    })

    const data = await response.json()

    if (data.exito) {
      const { referencia, total } = data.datos

      // Crear mensaje WhatsApp
      const mensaje = crearMensajeWhatsApp(
        referencia,
        items.map(i => ({...})),
        total
      )

      // Redirigir
      window.location.href = `https://wa.me/57xxxxxxxx?text=${mensaje}`
    }

    setLoading(false)
  }

  return (
    <button onClick={handleComprar} disabled={loading}>
      {loading ? 'Procesando...' : 'Comprar'}
    </button>
  )
}
```

### 2. Backend (API Route)

```typescript
// src/app/api/pedidos/route.ts
import { PedidoService } from "@/services";

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const pedido = await PedidoService.crear(body);
    return NextResponse.json({ exito: true, datos: pedido }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { exito: false, mensaje: error.message },
      { status: 500 },
    );
  }
}
```

### 3. Service (Lógica)

```typescript
// src/services/index.ts
export class PedidoService {
  static async crear(datos: CrearPedidoDTO) {
    // 1. Validar productos existen
    for (const item of datos.items) {
      const producto = await ProductoRepository.obtenerPorId(item.productoId)
      if (!producto) throw new Error('Producto no encontrado')
    }

    // 2. Generear referencia
    const referencia = generarReferenciaPedido()

    // 3. Crear en BD
    return await PedidoRepository.crear({
      referencia,
      total: calcularTotal(...),
      items: { createMany: { data: [...] } }
    })
  }
}
```

### 4. Repository (BD)

```typescript
// src/repositories/index.ts
export class PedidoRepository {
  static async crear(datos: any) {
    return prisma.pedido.create({
      data: datos,
      include: { items: true },
    });
  }
}
```

---

## 📝 CLIENT vs SERVER COMPONENTS

### Client Component (Interactivo)

```typescript
'use client'  // ← Importante!

import { useState } from 'react'

export function Filtros() {
  const [busqueda, setBusqueda] = useState('')

  return (
    <input
      value={busqueda}
      onChange={e => setBusqueda(e.target.value)}
    />
  )
}
```

### Server Component (Por defecto)

```typescript
// No necesita 'use client'
import { ProductoService } from '@/services'

export async function ListaProductos() {
  const productos = await ProductoService.obtenerConFiltros({})

  return (
    <div>
      {productos.datos.map(p => (
        <h3>{p.nombre}</h3>
      ))}
    </div>
  )
}
```

---

## 🔍 DEBUGGING

### Ver BD en GUI

```bash
npx prisma studio
# Abre http://localhost:5555
```

### Ver Logs (Server)

```typescript
console.log("Debug:", data); // En server components
```

### Network Inspector

- F12 → Network
- Buscar `/api/`
- Ver Request/Response

---

**¿Más ejemplos?** Revisa el código en `src/components/` y `src/services/`
