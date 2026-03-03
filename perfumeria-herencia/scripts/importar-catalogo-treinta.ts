// Script para importar productos del catálogo de Treinta a la base de datos
// ADVERTENCIA: Este es un ejemplo manual. Treinta no tiene API pública para extracción automática.
// Los datos deben copiarse manualmente del catálogo.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Ejemplos de datos extraídos del catálogo de Treinta
const productosDelCatalogo = [
  {
    nombre: "212 HÉROES MEN",
    descripcion: "Fragancia masculina fresca y audaz de Carolina Herrera. Se abre con pera, jengibre y cannabis, corazón de geranio y salvia, termina con musgo y cuero. Ideal para el hombre joven, auténtico y con espíritu libre.",
    precio: 90000,
    marca: "Carolina Herrera",
    categoria: "Perfume",
    genero: "Masculino",
    tipo: "Replica",
    disponible: true,
    imagenUrl: "" // Las URLs de imágenes deben extraerse del catálogo
  },
  {
    nombre: "AVENTUS",
    descripcion: "Aroma masculino elegante y con presencia de Creed. Combina piña y bergamota, con corazón amaderado y fondo almizclado. Ideal para hombres que buscan un perfume poderoso y versátil.",
    precio: 90000,
    marca: "Creed",
    categoria: "Perfume",
    genero: "Masculino",
    tipo: "Replica",
    disponible: true,
    imagenUrl: ""
  },
  {
    nombre: "BLEU DE CHANEL",
    descripcion: "Fragancia masculina elegante y versátil. Combina cítricos, amaderadas y aromáticas, logrando un aroma fresco, moderno y sofisticado.",
    precio: 90000,
    marca: "Chanel",
    categoria: "Perfume",
    genero: "Masculino",
    tipo: "Replica",
    disponible: true,
    imagenUrl: ""
  },
  {
    nombre: "9 AM DIVE",
    descripcion: "Fragancia masculina fresca y acuática. Combina cítricos vibrantes, acordes marinos y fondo amaderado limpio. Perfecto para el día y climas cálidos.",
    precio: 240000,
    marca: "Afnan",
    categoria: "Perfume",
    genero: "Masculino",
    tipo: "Original",
    disponible: true,
    imagenUrl: ""
  },
  {
    nombre: "212 VIP ROSE",
    descripcion: "Fragancia femenina elegante y festiva de Carolina Herrera. Combina champán rosado con corazón floral suave y fondo cálido. Ideal para mujeres que quieren brillar con glamour.",
    precio: 90000,
    marca: "Carolina Herrera",
    categoria: "Perfume",
    genero: "Femenino",
    tipo: "Replica",
    disponible: true,
    imagenUrl: ""
  },
  {
    nombre: "CLOUD",
    descripcion: "Fragancia femenina dulce y acogedora de Ariana Grande. Notas de lavanda, pera, crema batida y almizcle. Perfecta para mujeres que buscan un aroma soñador y moderno.",
    precio: 100000,
    marca: "Ariana Grande",
    categoria: "Perfume",
    genero: "Femenino",
    tipo: "Replica",
    disponible: true,
    imagenUrl: ""
  },
  {
    nombre: "ASAD BOURBON",
    descripcion: "Fragancia masculina intensa y seductora de Lattafa. Combina bourbon, vainilla especiada y canela sobre fondo amaderado y ambarado. Perfecto para la noche.",
    precio: 110000,
    marca: "Lattafa",
    categoria: "Perfume",
    genero: "Masculino",
    tipo: "Original",
    disponible: true,
    imagenUrl: ""
  },
  {
    nombre: "BHARARA KING",
    descripcion: "Fragancia unisex dulce-fresca y llamativa. Combina cítricos vibrantes con corazón frutal y fondo cálido de vainilla, ámbar y almizcle.",
    precio: 100000,
    marca: "Bharara",
    categoria: "Perfume",
    genero: "Unisex",
    tipo: "Replica",
    disponible: true,
    imagenUrl: ""
  }
];

async function importarProductos() {
  console.log('🚀 Iniciando importación de productos del catálogo Treinta...\n');

  try {
    // 1. Crear marcas si no existen
    const marcasUnicas = [...new Set(productosDelCatalogo.map(p => p.marca))];
    console.log(`📦 Creando ${marcasUnicas.length} marcas...`);
    
    for (const nombreMarca of marcasUnicas) {
      await prisma.marca.upsert({
        where: { nombre: nombreMarca },
        update: {},
        create: {
          nombre: nombreMarca,
          activo: true
        }
      });
    }
    console.log('✅ Marcas creadas\n');

    // 2. Obtener categorías y géneros existentes
    const categoria = await prisma.categoria.findFirst({ where: { nombre: 'Perfume' } });
    const generos = await prisma.genero.findMany();
    
    if (!categoria) {
      throw new Error('Categoría "Perfume" no encontrada');
    }

    // 3. Crear productos
    console.log(`🛍️ Importando ${productosDelCatalogo.length} productos...\n`);
    
    let importados = 0;
    let actualizados = 0;
    
    for (const prod of productosDelCatalogo) {
      const marca = await prisma.marca.findUnique({ where: { nombre: prod.marca } });
      const genero = generos.find(g => g.nombre.toLowerCase() === prod.genero.toLowerCase());
      
      if (!marca || !genero) {
        console.log(`⚠️ Saltando "${prod.nombre}" - marca o género no encontrado`);
        continue;
      }

      const productoExistente = await prisma.producto.findFirst({
        where: { nombre: prod.nombre }
      });

      if (productoExistente) {
        await prisma.producto.update({
          where: { id: productoExistente.id },
          data: {
            precio: prod.precio,
            descripcion: prod.descripcion,
            disponible: prod.disponible
          }
        });
        actualizados++;
        console.log(`🔄 Actualizado: ${prod.nombre}`);
      } else {
        await prisma.producto.create({
          data: {
            nombre: prod.nombre,
            descripcion: prod.descripcion,
            precio: prod.precio,
            stock: 10, // Stock inicial por defecto
            disponible: prod.disponible,
            tipoProducto: prod.tipo === 'Original' ? 'ORIGINAL' : 'REPLICA',
            imagenUrl: prod.imagenUrl || null,
            marcaId: marca.id,
            categoriaId: categoria.id,
            generoId: genero.id
          }
        });
        importados++;
        console.log(`✅ Importado: ${prod.nombre} - $${prod.precio.toLocaleString()}`);
      }
    }

    console.log('\n🎉 Importación completada!');
    console.log(`   ✅ ${importados} productos nuevos`);
    console.log(`   🔄 ${actualizados} productos actualizados`);
    console.log(`   📊 Total procesados: ${importados + actualizados}\n`);

  } catch (error) {
    console.error('❌ Error durante la importación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar importación
importarProductos();
