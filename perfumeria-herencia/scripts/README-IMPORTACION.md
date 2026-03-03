# 📋 Guía para Importar el Catálogo de Treinta

## 🎯 Opciones para Importar tus Productos

### ✅ Opción 1: Importación Manual (Script de Ejemplo)

He creado un script de ejemplo en:

- **`scripts/importar-catalogo-treinta.ts`**

Este script incluye **8 productos de muestra** extraídos de tu catálogo. Para ejecutarlo:

```bash
npx ts-node scripts/importar-catalogo-treinta.ts
```

### 📝 Opción 2: Agregar Más Productos al Script

Edita el archivo `scripts/importar-catalogo-treinta.ts` y agrega más productos al array `productosDelCatalogo`:

```typescript
{
  nombre: "NOMBRE DEL PRODUCTO",
  descripcion: "Descripción completa...",
  precio: 90000,
  marca: "Nombre de la Marca",
  categoria: "Perfume",
  genero: "Masculino", // o "Femenino" o "Unisex"
  tipo: "Replica", // o "Original"
  disponible: true,
  imagenUrl: "" // Opcional
}
```

### 🌐 Opción 3: Extracción Web (Avanzada)

Treinta no tiene API pública, pero puedes:

1. **Usar el panel de administración de tu proyecto:**
   - Ve a `http://localhost:3000/admin/productos/nuevo`
   - Agrega productos uno por uno con formulario visual

2. **Copiar datos manualmente:**
   - Abre tu catálogo: https://catalogo.treinta.co/HerenciaPerfumeria
   - Copia la información de cada producto
   - Agrégalos al script

3. **Exportar desde Treinta (si existe):**
   - Revisa si Treinta ofrece exportación CSV/Excel de productos
   - Si lo hace, puedo crear un script para importar ese archivo

---

## 📊 Productos de Muestra Incluidos

El script ya incluye estos **8 productos**:

1. ✅ 212 HÉROES MEN - $90,000
2. ✅ AVENTUS - $90,000
3. ✅ BLEU DE CHANEL - $90,000
4. ✅ 9 AM DIVE - $240,000 (Original)
5. ✅ 212 VIP ROSE - $90,000
6. ✅ CLOUD - $100,000
7. ✅ ASAD BOURBON - $110,000 (Original)
8. ✅ BHARARA KING - $100,000

---

## 🚀 Ejecutar la Importación

```bash
# 1. Asegúrate de estar en el directorio del proyecto
cd perfumeria-herencia

# 2. Ejecuta el script de importación
npx ts-node scripts/importar-catalogo-treinta.ts

# 3. Verifica los productos importados
npm run dev
# Luego ve a: http://localhost:3000/admin/productos
```

---

## 💡 Recomendación

Para importar todo tu catálogo de Treinta:

1. **Contacta a soporte de Treinta** y pregunta si pueden darte un export de tus productos
2. O **usa el panel de administración** de tu proyecto para agregar productos visualmente
3. O **expande el script** agregando más productos manualmente (copy-paste de tu catálogo)

---

## 🆘 ¿Necesitas ayuda?

Si Treinta te da un archivo CSV/Excel con tus productos, puedo crear un script que lo importe automáticamente.
