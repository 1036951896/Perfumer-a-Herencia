# 🚀 GUÍA: Importar los 117 Productos de Treinta

## 📋 Proceso en 4 Pasos Simples

### **PASO 1: Extraer datos del catálogo**

1. Abre tu catálogo en Chrome o Edge:

   ```
   https://catalogo.treinta.co/HerenciaPerfumeria
   ```

2. Presiona **F12** (o clic derecho → "Inspeccionar")

3. Ve a la pestaña **"Console"** (Consola)

4. Abre el archivo: `scripts/extraer-productos-browser.js`

5. **Copia TODO el contenido** del archivo

6. **Pégalo en la consola** del navegador

7. Presiona **Enter**

8. Espera 30-60 segundos mientras el script:
   - Hace scroll automático
   - Carga todos los productos
   - Extrae nombres, precios, descripciones

9. **Copia el JSON** que aparece en la consola (entre las líneas de `=======`)

---

### **PASO 2: Preparar la importación**

1. Abre el archivo: `scripts/importar-catalogo-completo.ts`

2. Busca la línea que dice:

   ```typescript
   const PRODUCTOS_JSON = [
     // PEGA AQUÍ EL JSON DE LA CONSOLA DEL NAVEGADOR
   ];
   ```

3. **Pega el JSON** que copiaste de la consola del navegador entre los corchetes:

   ```typescript
   const PRODUCTOS_JSON = [
     {
       "nombre": "212 HÉROES MEN",
       "descripcion": "Fragancia masculina...",
       "precio": 90000,
       ...
     },
     // ... resto de productos ...
   ];
   ```

4. **Guarda el archivo** (Ctrl + S)

---

### **PASO 3: Ejecutar la importación**

Abre la terminal de VS Code y ejecuta:

```bash
npm run import:treinta:full
```

Verás algo como:

```
🚀 Iniciando importación completa del catálogo...
📦 Procesando 117 productos...
✅ 1. 212 HÉROES MEN - $90,000
✅ 2. AVENTUS - $90,000
✅ 3. BLEU DE CHANEL - $90,000
...
🎉 Importación completada!
   ✅ 117 productos importados
```

---

### **PASO 4: Verificar**

1. Inicia el servidor:

   ```bash
   npm run dev
   ```

2. Abre en el navegador:

   ```
   http://localhost:3000/admin/productos
   ```

3. Deberías ver todos tus 117 productos importados

---

## 🔧 Solución de Problemas

### ❌ "No hay productos para importar"

- Asegúrate de haber pegado el JSON en `PRODUCTOS_JSON`
- Verifica que el JSON esté entre los corchetes `[ ]`

### ❌ Error de sintaxis JSON

- Verifica que copiaste el JSON completo
- Asegúrate de que no haya comas extra al final

### ❌ El script del navegador no funciona

- Prueba con Chrome o Edge (Firefox puede tener problemas)
- Asegúrate de copiar TODO el archivo `.js`
- Espera a que termine el scroll automático

---

## 💡 Notas Importantes

- ✅ El script detecta automáticamente:
  - **Marcas** (Carolina Herrera, Chanel, etc.)
  - **Género** (Masculino, Femenino, Unisex)
  - **Tipo** (Original o Réplica)

- ✅ No se importan duplicados

- ✅ Se crean marcas automáticamente si no existen

- ✅ Stock inicial: 10 unidades por producto

---

## 🆘 ¿Necesitas Ayuda?

Si algo no funciona, compárteme:

1. El mensaje de error completo
2. En qué paso tuviste el problema
