/*
 * SCRIPT PARA EXTRAER PRODUCTOS DEL CATÁLOGO TREINTA
 * 
 * INSTRUCCIONES:
 * 1. Abre tu catálogo: https://catalogo.treinta.co/HerenciaPerfumeria
 * 2. Presiona F12 para abrir DevTools (Consola del navegador)
 * 3. Copia TODO este archivo y pégalo en la consola
 * 4. Presiona Enter
 * 5. El script extraerá todos los productos y generará un JSON
 * 6. Copia el JSON generado
 * 7. Pégalo en scripts/importar-catalogo-completo.ts en la variable PRODUCTOS_JSON
 * 8. Ejecuta: npm run import:treinta:full
 */

(async function extraerProductosTreinta() {
    console.log('🚀 Extrayendo productos del catálogo...');
    
    const productos = [];
    let paginaActual = 1;
    let totalProductos = 0;
    
    // Desplázate hasta el final de la página para cargar todos los productos
    console.log('📜 Desplazándose para cargar todos los productos...');
    console.log('⏳ Por favor espera...');
    
    // Hacer scroll automático
    await new Promise((resolve) => {
        let lastHeight = document.body.scrollHeight;
        const scrollInterval = setInterval(() => {
            window.scrollTo(0, document.body.scrollHeight);
            
            setTimeout(() => {
                let newHeight = document.body.scrollHeight;
                if (newHeight === lastHeight) {
                    clearInterval(scrollInterval);
                    resolve();
                }
                lastHeight = newHeight;
            }, 1000);
        }, 1000);
        
        // Timeout de seguridad de 30 segundos
        setTimeout(() => {
            clearInterval(scrollInterval);
            resolve();
        }, 30000);
    });
    
    console.log('✅ Scroll completado. Extrayendo productos...');
    
    // Extraer todos los productos visibles
    const enlaces = document.querySelectorAll('a[href*="/product/"]');
    
    enlaces.forEach((link, index) => {
        try {
            // Extraer nombre (puede estar en diferentes elementos)
            let nombre = link.querySelector('h3')?.textContent?.trim() ||
                        link.querySelector('h2')?.textContent?.trim() ||
                        link.querySelector('strong')?.textContent?.trim() ||
                        '';
            
            // Extraer precio
            const precioMatch = link.textContent.match(/\$\s*([\d,.]+)/);
            let precio = 0;
            if (precioMatch) {
                precio = parseInt(precioMatch[1].replace(/[,\.]/g, ''));
            }
            
            // Extraer descripción (texto largo)
            let descripcion = '';
            const parrafos = link.querySelectorAll('p');
            parrafos.forEach(p => {
                const texto = p.textContent?.trim() || '';
                if (texto.length > descripcion.length && !texto.includes('$')) {
                    descripcion = texto;
                }
            });
            
            // Extraer URL de imagen
            let imagenUrl = '';
            const img = link.querySelector('img');
            if (img) {
                imagenUrl = img.src || img.getAttribute('data-src') || '';
            }
            
            if (nombre && precio > 0) {
                productos.push({
                    nombre: nombre.replace(/\s+/g, ' ').trim(),
                    descripcion: descripcion.replace(/\s+/g, ' ').trim(),
                    precio: precio,
                    imagenUrl: imagenUrl,
                    url: link.href
                });
            }
        } catch (error) {
            console.warn(`Error procesando producto ${index + 1}:`, error);
        }
    });
    
    // Eliminar duplicados
    const productosUnicos = [];
    const nombresVistos = new Set();
    
    productos.forEach(p => {
        if (!nombresVistos.has(p.nombre)) {
            nombresVistos.add(p.nombre);
            productosUnicos.push(p);
        }
    });
    
    console.log('\n✅ Extracción completada!');
    console.log(`📦 Total de productos encontrados: ${productosUnicos.length}`);
    console.log('\n📋 Copia el JSON de abajo:');
    console.log('='.repeat(80));
    console.log(JSON.stringify(productosUnicos, null, 2));
    console.log('='.repeat(80));
    console.log('\n💡 SIGUIENTE PASO:');
    console.log('1. Copia el JSON de arriba');
    console.log('2. Abre: scripts/importar-catalogo-completo.ts');
    console.log('3. Pégalo en la variable PRODUCTOS_JSON');
    console.log('4. Ejecuta: npm run import:treinta:full');
    
    return productosUnicos;
})();
