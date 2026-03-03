import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed de datos...')

  // Limpiar datos existentes
  await prisma.pedidoItem.deleteMany()
  await prisma.pedido.deleteMany()
  await prisma.producto.deleteMany()
  await prisma.marca.deleteMany()
  await prisma.categoria.deleteMany()

  // Crear marcas
  const marcas = await Promise.all([
    prisma.marca.create({
      data: { 
        nombre: 'Creed',
        descripcion: 'Casa de perfumería francesa fundada en 1760',
        paisOrigen: 'Francia'
      },
    }),
    prisma.marca.create({
      data: { 
        nombre: 'Tom Ford',
        descripcion: 'Fragancias de lujo modernas y atrevidas',
        paisOrigen: 'Estados Unidos'
      },
    }),
    prisma.marca.create({
      data: { 
        nombre: 'Maison Francis Kurkdjian',
        descripcion: 'Alta perfumería parisina contemporánea',
        paisOrigen: 'Francia'
      },
    }),
    prisma.marca.create({
      data: { 
        nombre: 'Le Labo',
        descripcion: 'Perfumería artesanal de Nueva York',
        paisOrigen: 'Estados Unidos'
      },
    }),
  ])

  // Crear categorías
  const categorias = await Promise.all([
    prisma.categoria.create({
      data: {
        nombre: 'Amaderado',
        descripcion: 'Fragancias con notas de madera, vetiver y cedro',
      },
    }),
    prisma.categoria.create({
      data: {
        nombre: 'Aromático Fresco',
        descripcion: 'Composiciones frescas con notas herbales y cítricas',
      },
    }),
    prisma.categoria.create({
      data: {
        nombre: 'Oriental Floral',
        descripcion: 'Fragancias cálidas con flores y especias',
      },
    }),
    prisma.categoria.create({
      data: {
        nombre: 'Cítrico',
        descripcion: 'Fragancias vibrantes con bergamota, limón y naranja',
      },
    }),
  ])

  // Crear productos Signature (Originales)
  await Promise.all([
    prisma.producto.create({
      data: {
        nombre: 'Aventus',
        descripcion: 'Una fragancia emblemática que combina notas de piña, bergamota y pachulí ahumado. Creada en 2010, celebra la fuerza, el poder y el éxito. Las notas de salida frutales evolucionan hacia un corazón especiado con abedul y jazmín, reposando sobre una base amaderada de musgo de roble y vainilla.',
        segmento: 'ORIGINAL',
        genero: 'MASCULINO',
        concentracion: 'EAU_DE_PARFUM',
        volumen: '100ml',
        marcaId: marcas[0].id,
        categoriaId: categorias[0].id,
        precio: 385,
        stock: 12,
        imagenUrl: 'https://via.placeholder.com/800x800?text=Aventus',
        destacado: true,
      },
    }),
    prisma.producto.create({
      data: {
        nombre: 'Oud Wood',
        descripcion: 'Una interpretación contemporánea del oud, ingrediente sagrado de la perfumería oriental. Tom Ford combina oud raro con sándalo rosado y cardamomo para crear una fragancia sensual y suave. Las notas amaderadas se entrelazan con ámbar y vainilla de Tonka en la base.',
        segmento: 'ORIGINAL',
        genero: 'UNISEX',
        concentracion: 'EAU_DE_PARFUM',
        volumen: '50ml',
        marcaId: marcas[1].id,
        categoriaId: categorias[0].id,
        precio: 245,
        stock: 8,
        imagenUrl: 'https://via.placeholder.com/800x800?text=Oud+Wood',
        destacado: true,
      },
    }),
    prisma.producto.create({
      data: {
        nombre: 'Baccarat Rouge 540',
        descripcion: 'Una fragancia luminosa y aérea que fusiona notas de jazmín, azafrán y ámbar gris. El acorde ambarino se combina con cedro y musgo para crear una estela sofisticada y perdurable. Galardonada como una de las mejores fragancias de la década.',
        segmento: 'ORIGINAL',
        genero: 'UNISEX',
        concentracion: 'EXTRAIT',
        volumen: '70ml',
        marcaId: marcas[2].id,
        categoriaId: categorias[2].id,
        precio: 310,
        stock: 5,
        imagenUrl: 'https://via.placeholder.com/800x800?text=Baccarat+Rouge',
        destacado: true,
      },
    }),
    prisma.producto.create({
      data: {
        nombre: 'Santal 33',
        descripcion: 'Una fragancia icónica que captura el espíritu del oeste americano. Las notas de sándalo australiano se mezclan con violeta, cardamomo y cedro de Virginia. La composición evoluciona con cuero y ámbar, creando una estela inolvidable y reconocible al instante.',
        segmento: 'ORIGINAL',
        genero: 'UNISEX',
        concentracion: 'EAU_DE_PARFUM',
        volumen: '100ml',
        marcaId: marcas[3].id,
        categoriaId: categorias[0].id,
        precio: 280,
        stock: 15,
        imagenUrl: 'https://via.placeholder.com/800x800?text=Santal+33',
        destacado: false,
      },
    }),
  ])

  // Crear productos Inspired (Réplicas de calidad)
  await Promise.all([
    prisma.producto.create({
      data: {
        nombre: 'Victory Intense',
        descripcion: 'Interpretación del legendario Aventus. Combina frutas frescas con notas ahumadas y amaderadas. Piña, bergamota y manzana en salida, con un corazón especiado de abedul y pachulí. Base amaderada con musgo de roble y vainilla. Excelente proyección y duración.',
        segmento: 'REPLICA',
        genero: 'MASCULINO',
        concentracion: 'EAU_DE_PARFUM',
        volumen: '100ml',
        marcaId: marcas[0].id,
        categoriaId: categorias[0].id,
        precio: 48,
        stock: 35,
        imagenUrl: 'https://via.placeholder.com/800x800?text=Victory+Intense',
        destacado: true,
      },
    }),
    prisma.producto.create({
      data: {
        nombre: 'Mystic Oud',
        descripcion: 'Nuestra versión del celebrado Oud Wood. Oud suave con sándalo y especias. El cardamomo aporta frescura mientras el vetiver y el ámbar crean profundidad. Una interpretación accesible de un clásico moderno con notable longevidad.',
        segmento: 'REPLICA',
        genero: 'UNISEX',
        concentracion: 'EAU_DE_PARFUM',
        volumen: '50ml',
        marcaId: marcas[1].id,
        categoriaId: categorias[0].id,
        precio: 38,
        stock: 42,
        imagenUrl: 'https://via.placeholder.com/800x800?text=Mystic+Oud',
        destacado: true,
      },
    }),
    prisma.producto.create({
      data: {
        nombre: 'Crimson Elixir',
        descripcion: 'Inspirado en Baccarat Rouge 540. Acorde ambarino luminoso con azafrán y jazmín. Notas de cedro y almizcle crean una estela sofisticada. Fragancia aérea y envolvente con excelente proyección. Ideal para quienes aprecian las composiciones ambrées.',
        segmento: 'REPLICA',
        genero: 'UNISEX',
        concentracion: 'EAU_DE_PARFUM',
        volumen: '50ml',
        marcaId: marcas[2].id,
        categoriaId: categorias[2].id,
        precio: 45,
        stock: 28,
        imagenUrl: 'https://via.placeholder.com/800x800?text=Crimson+Elixir',
        destacado: false,
      },
    }),
    prisma.producto.create({
      data: {
        nombre: 'Desert Wood',
        descripcion: 'Nuestra interpretación de Santal 33. Sándalo cremoso con violeta y cardamomo. Cuero suave y cedro en el corazón. Base ambarada persistente. Captura el espíritu de la fragancia original con notable similitud en el desarrollo y la estela.',
        segmento: 'REPLICA',
        genero: 'UNISEX',
        concentracion: 'EAU_DE_TOILETTE',
        volumen: '100ml',
        marcaId: marcas[3].id,
        categoriaId: categorias[0].id,
        precio: 42,
        stock: 30,
        imagenUrl: 'https://via.placeholder.com/800x800?text=Desert+Wood',
        destacado: false,
      },
    }),
  ])

  console.log('✅ Seed completado con éxito')
}

main()
  .catch((e) => {
    console.error('Error al ejecutar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
