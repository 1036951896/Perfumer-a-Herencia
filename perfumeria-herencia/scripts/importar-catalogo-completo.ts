// Script para convertir datos del catálogo Treinta a formato importable
// Este script te ayudará a importar los 117 productos de forma más eficiente

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// INSTRUCCIONES:
// 1. Abre tu catálogo: https://catalogo.treinta.co/HerenciaPerfumeria
// 2. Abre la consola del navegador (F12)
// 3. Pega este código en la consola:
/*
const productos = [];
document.querySelectorAll('a[href*="/product/"]').forEach(link => {
  const nombre = link.querySelector('h3, h2, strong')?.textContent?.trim();
  const precio = link.textContent.match(/\$\s*([\d,.]+)/)?.[1]?.replace(/[,\.]/g, '');
  const descripcion = link.querySelector('p')?.textContent?.trim();
  
  if (nombre && precio) {
    productos.push({
      nombre: nombre.replace(/\s+/g, ' '),
      descripcion: descripcion || '',
      precio: parseInt(precio) || 0,
      url: link.href
    });
  }
});

console.log(JSON.stringify(productos, null, 2));
*/
// 4. Copia el resultado JSON
// 5. Pégalo en el array PRODUCTOS_JSON abajo
// 6. Ejecuta: npm run import:treinta:full

const PRODUCTOS_JSON = [
  // PEGA AQUÍ EL JSON DE LA CONSOLA DEL NAVEGADOR
];

// Función para determinar marca, género y tipo basado en el nombre y descripción
function extraerMetadatos(nombre: string, descripcion: string) {
  const nombreLower = nombre.toLowerCase();
  const descLower = descripcion.toLowerCase();
  
  // Detectar tipo (Original vs Réplica)
  let tipo: 'ORIGINAL' | 'REPLICA' = 'REPLICA';
  if (nombreLower.includes('original') || descLower.includes('original')) {
    tipo = 'ORIGINAL';
  }
  
  // Detectar género
  let genero = 'Unisex';
  if (descLower.includes('masculin') || descLower.includes('hombre') || descLower.includes('men')) {
    genero = 'Masculino';
  } else if (descLower.includes('femenin') || descLower.includes('mujer') || descLower.includes('women') || descLower.includes('dama')) {
    genero = 'Femenino';
  }
  
  // Detectar marca (lista común de marcas)
  const marcasConocidas = [
    'Carolina Herrera', 'Chanel', 'Creed', 'Dior', 'Paco Rabanne',
    'Versace', 'Giorgio Armani', 'Hugo Boss', 'Jean Paul Gaultier',
    'Yves Saint Laurent', 'Tom Ford', 'Dolce Gabbana', 'Givenchy',
    'Burberry', 'Hermès', 'Prada', 'Gucci', 'Calvin Klein',
    'Ariana Grande', 'Lattafa', 'Bharara', 'Afnan', 'Montblanc'
  ];
  
  let marca = 'Sin Marca';
  for (const m of marcasConocidas) {
    if (nombreLower.includes(m.toLowerCase()) || descLower.includes(m.toLowerCase())) {
      marca = m;
      break;
    }
  }
  
  return { tipo, genero, marca };
}

async function importarProductosCompletos() {
  console.log('🚀 Iniciando importación completa del catálogo...\n');
  
  if (PRODUCTOS_JSON.length === 0) {
    console.log('❌ ERROR: No hay productos para importar.');
    console.log('\n📋 INSTRUCCIONES:');
    console.log('1. Abre https://catalogo.treinta.co/HerenciaPerfumeria');
    console.log('2. Presiona F12 para abrir la consola del navegador');
    console.log('3. Copia y pega el código JavaScript que está en los comentarios de este archivo');
    console.log('4. Copia el resultado JSON');
    console.log('5. Pégalo en la variable PRODUCTOS_JSON de este archivo');
    console.log('6. Ejecuta: npm run import:treinta:full\n');
    return;
  }

  try {
    // Crear categoría Perfume si no existe
    const categoria = await prisma.categoria.upsert({
      where: { nombre: 'Perfume' },
      update: {},
      create: { nombre: 'Perfume', descripcion: 'Fragancias' }
    });

    // Asegurar que existan los géneros
    const generos = ['Masculino', 'Femenino', 'Unisex'];
    for (const gen of generos) {
      await prisma.genero.upsert({
        where: { nombre: gen },
        update: {},
        create: { nombre: gen }
      });
    }

    let importados = 0;
    let errores = 0;

    console.log(`📦 Procesando ${PRODUCTOS_JSON.length} productos...\n`);

    for (const prod of PRODUCTOS_JSON) {
      try {
        const { tipo, genero, marca: nombreMarca } = extraerMetadatos(prod.nombre, prod.descripcion);

        // Crear marca si no existe
        const marca = await prisma.marca.upsert({
          where: { nombre: nombreMarca },
          update: {},
          create: { nombre: nombreMarca, activo: true }
        });

        // Obtener género
        const generoObj = await prisma.genero.findUnique({ where: { nombre: genero } });
        
        if (!generoObj) continue;

        // Verificar si el producto ya existe
        const existente = await prisma.producto.findFirst({
          where: { nombre: prod.nombre }
        });

        if (!existente) {
          await prisma.producto.create({
            data: {
              nombre: prod.nombre,
              descripcion: prod.descripcion || `Fragancia ${genero.toLowerCase()}`,
              precio: prod.precio,
              stock: 10,
              disponible: true,
              tipoProducto: tipo,
              marcaId: marca.id,
              categoriaId: categoria.id,
              generoId: generoObj.id
            }
          });
          importados++;
          console.log(`✅ ${importados}. ${prod.nombre} - $${prod.precio.toLocaleString()}`);
        }
      } catch (error) {
        errores++;
        console.log(`❌ Error en: ${prod.nombre}`);
      }
    }

    console.log('\n🎉 Importación completada!');
    console.log(`   ✅ ${importados} productos importados`);
    console.log(`   ❌ ${errores} errores`);
    console.log(`   📊 Total procesados: ${PRODUCTOS_JSON.length}\n`);

  } catch (error) {
    console.error('❌ Error durante la importación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importarProductosCompletos();
