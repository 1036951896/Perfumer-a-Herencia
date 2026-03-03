import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed de datos...')

  await prisma.pedidoItem.deleteMany()
  await prisma.pedido.deleteMany()
  await prisma.producto.deleteMany()
  await prisma.marca.deleteMany()
  await prisma.categoria.deleteMany()

  const [
    mCarolinaHerrera, mAfnan, mGiorgioArmani, mLattafa, mCreed,
    mChanel, mArianaGrande, mBharara, mAhli, mGillesCantuel,
    mLeLabo, mSinMarca, mRyanCastro,
  ] = await Promise.all([
    prisma.marca.create({ data: { nombre: 'Carolina Herrera', descripcion: 'Casa de moda venezolana-americana', paisOrigen: 'Venezuela' } }),
    prisma.marca.create({ data: { nombre: 'Afnan', descripcion: 'Casa de perfumeria arabe de lujo', paisOrigen: 'Emiratos Arabes' } }),
    prisma.marca.create({ data: { nombre: 'Giorgio Armani', descripcion: 'Casa de moda italiana de lujo', paisOrigen: 'Italia' } }),
    prisma.marca.create({ data: { nombre: 'Lattafa', descripcion: 'Casa de perfumeria arabe contemporanea', paisOrigen: 'Emiratos Arabes' } }),
    prisma.marca.create({ data: { nombre: 'Creed', descripcion: 'Casa de perfumeria francesa fundada en 1760', paisOrigen: 'Francia' } }),
    prisma.marca.create({ data: { nombre: 'Chanel', descripcion: 'Iconica casa de moda francesa', paisOrigen: 'Francia' } }),
    prisma.marca.create({ data: { nombre: 'Ariana Grande', descripcion: 'Fragancias de la cantante Ariana Grande', paisOrigen: 'Estados Unidos' } }),
    prisma.marca.create({ data: { nombre: 'Bharara', descripcion: 'Casa de perfumeria de lujo', paisOrigen: 'Estados Unidos' } }),
    prisma.marca.create({ data: { nombre: 'Ahli', descripcion: 'Perfumeria arabe de alta gama', paisOrigen: 'Arabia Saudita' } }),
    prisma.marca.create({ data: { nombre: 'Gilles Cantuel', descripcion: 'Casa de perfumeria francesa', paisOrigen: 'Francia' } }),
    prisma.marca.create({ data: { nombre: 'Le Labo', descripcion: 'Perfumeria artesanal de Nueva York', paisOrigen: 'Estados Unidos' } }),
    prisma.marca.create({ data: { nombre: 'Sin Marca', descripcion: 'Productos sin marca especifica', paisOrigen: 'Colombia' } }),
    prisma.marca.create({ data: { nombre: 'Ryan Castro', descripcion: 'Fragancias del artista Ryan Castro', paisOrigen: 'Colombia' } }),
  ])

  const [cPerfume, cAmaderado, cOriental, cFrutal, cAcuatico, _cMascota] = await Promise.all([
    prisma.categoria.create({ data: { nombre: 'Perfume', descripcion: 'Fragancias en general' } }),
    prisma.categoria.create({ data: { nombre: 'Amaderado', descripcion: 'Fragancias con notas de madera' } }),
    prisma.categoria.create({ data: { nombre: 'Oriental', descripcion: 'Fragancias calidas y especiadas' } }),
    prisma.categoria.create({ data: { nombre: 'Frutal', descripcion: 'Fragancias con notas frutales' } }),
    prisma.categoria.create({ data: { nombre: 'Acuatico', descripcion: 'Fragancias frescas y marinas' } }),
    prisma.categoria.create({ data: { nombre: 'Mascotas y Vehiculos', descripcion: 'Aromatizantes para mascotas y vehiculos' } }),
  ])

  await Promise.all([
    prisma.producto.create({ data: { nombre: '212 HEROES MEN', descripcion: 'Fragancia masculina fresca y audaz de Carolina Herrera. Se abre con pera, jengibre, corazon de geranio y salvia, termina con musgo y cuero.', segmento: 'REPLICA', genero: 'MASCULINO', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mCarolinaHerrera.id, categoriaId: cPerfume.id, precio: 90000, stock: 10, imagenUrl: 'https://placehold.co/600x600/1a1a2e/ffffff?text=212+Heroes+Men', destacado: true }}),
    prisma.producto.create({ data: { nombre: '212 MEN CLASICA', descripcion: 'Fragancia fresca, elegante y moderna de Carolina Herrera. Mezcla notas verdes, citricos y especias suaves sobre fondo amaderado.', segmento: 'REPLICA', genero: 'MASCULINO', concentracion: 'EAU_DE_TOILETTE', volumen: '100ml', marcaId: mCarolinaHerrera.id, categoriaId: cPerfume.id, precio: 90000, stock: 10, imagenUrl: 'https://placehold.co/600x600/1a1a2e/ffffff?text=212+Men+Clasica', destacado: false }}),
    prisma.producto.create({ data: { nombre: '212 VIP BLACK', descripcion: 'Fragancia masculina nocturna y seductora de Carolina Herrera. Apertura herbal con anis e hinojo, corazon de lavanda, base de vainilla negra y almizcle.', segmento: 'REPLICA', genero: 'MASCULINO', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mCarolinaHerrera.id, categoriaId: cPerfume.id, precio: 90000, stock: 10, imagenUrl: 'https://placehold.co/600x600/0d0d0d/ffffff?text=212+VIP+Black', destacado: true }}),
    prisma.producto.create({ data: { nombre: '212 VIP MEN', descripcion: 'Fragancia masculina vibrante y sofisticada de Carolina Herrera. Perfecta para el hombre moderno con confianza y presencia.', segmento: 'REPLICA', genero: 'MASCULINO', concentracion: 'EAU_DE_TOILETTE', volumen: '100ml', marcaId: mCarolinaHerrera.id, categoriaId: cPerfume.id, precio: 90000, stock: 10, imagenUrl: 'https://placehold.co/600x600/2c2c54/ffffff?text=212+VIP+Men', destacado: false }}),
    prisma.producto.create({ data: { nombre: 'ACQUA DI GIO PROFUM', descripcion: 'Fragancia masculina fresca y marina con tonos aromaticos de Giorgio Armani. Aroma limpio, moderno y sofisticado.', segmento: 'REPLICA', genero: 'MASCULINO', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mGiorgioArmani.id, categoriaId: cAcuatico.id, precio: 85000, stock: 15, imagenUrl: 'https://placehold.co/600x600/16213e/ffffff?text=Acqua+Di+Gio', destacado: true }}),
    prisma.producto.create({ data: { nombre: 'ARSENAL BLACK GILLES', descripcion: 'Fragancia masculina energica de Gilles Cantuel que mezcla notas especiadas, citricas y amaderadas.', segmento: 'REPLICA', genero: 'MASCULINO', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mGillesCantuel.id, categoriaId: cAmaderado.id, precio: 100000, stock: 10, imagenUrl: 'https://placehold.co/600x600/1a1a1a/ffffff?text=Arsenal+Black', destacado: false }}),
    prisma.producto.create({ data: { nombre: 'ASAD BOURBON', descripcion: 'Fragancia masculina intensa de Lattafa. Combina bourbon, vainilla especiada y canela sobre fondo amaderado y ambarado.', segmento: 'REPLICA', genero: 'MASCULINO', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mLattafa.id, categoriaId: cOriental.id, precio: 110000, stock: 10, imagenUrl: 'https://placehold.co/600x600/3d1a00/ffffff?text=Asad+Bourbon', destacado: false }}),
    prisma.producto.create({ data: { nombre: 'AVENTUS', descripcion: 'Fragancia masculina elegante de Creed. Notas afrutadas de pina y bergamota, corazon amaderado y fondo almizclado.', segmento: 'REPLICA', genero: 'MASCULINO', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mCreed.id, categoriaId: cAmaderado.id, precio: 90000, stock: 10, imagenUrl: 'https://placehold.co/600x600/2d4a22/ffffff?text=Aventus', destacado: true }}),
    prisma.producto.create({ data: { nombre: 'BLEU DE CHANEL', descripcion: 'Fragancia masculina elegante y versatil de Chanel. Notas citricas, amaderadas y aromaticas para un aroma fresco y sofisticado.', segmento: 'REPLICA', genero: 'MASCULINO', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mChanel.id, categoriaId: cAmaderado.id, precio: 90000, stock: 15, imagenUrl: 'https://placehold.co/600x600/001f5b/ffffff?text=Bleu+de+Chanel', destacado: true }}),
    prisma.producto.create({ data: { nombre: '212 VIP ROSE', descripcion: 'Fragancia femenina elegante y festiva de Carolina Herrera. Notas de champan rosado, corazon floral y fondo calido.', segmento: 'REPLICA', genero: 'FEMENINO', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mCarolinaHerrera.id, categoriaId: cPerfume.id, precio: 90000, stock: 10, imagenUrl: 'https://placehold.co/600x600/8b1a4a/ffffff?text=212+VIP+Rose', destacado: true }}),
    prisma.producto.create({ data: { nombre: 'AGUA DE SOL', descripcion: 'Fragancia femenina fresca y frutal. Mezcla notas de frambuesa, citricos y durazno con fondo suave y veraniego.', segmento: 'REPLICA', genero: 'FEMENINO', concentracion: 'EAU_DE_TOILETTE', volumen: '100ml', marcaId: mSinMarca.id, categoriaId: cFrutal.id, precio: 90000, stock: 10, imagenUrl: 'https://placehold.co/600x600/d4a017/ffffff?text=Agua+de+Sol', destacado: false }}),
    prisma.producto.create({ data: { nombre: 'CLOUD', descripcion: 'Fragancia femenina dulce de Ariana Grande. Notas de lavanda, pera, crema batida y almizcle. Aroma etereo y confortable.', segmento: 'REPLICA', genero: 'FEMENINO', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mArianaGrande.id, categoriaId: cFrutal.id, precio: 100000, stock: 10, imagenUrl: 'https://placehold.co/600x600/7b68ee/ffffff?text=Cloud', destacado: true }}),
    prisma.producto.create({ data: { nombre: 'AMATHYS', descripcion: 'Fragancia unisex elegante de Lattafa. Mezcla rosas, jazmin y fondo calido de oud, ambar y vainilla.', segmento: 'REPLICA', genero: 'UNISEX', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mLattafa.id, categoriaId: cOriental.id, precio: 130000, stock: 10, imagenUrl: 'https://placehold.co/600x600/4a0040/ffffff?text=Amathys', destacado: false }}),
    prisma.producto.create({ data: { nombre: 'AVENTUS SILVER MOUNTAIN', descripcion: 'Fragancia unisex fresca de Creed. Bergamota, grosella negra y fondo de sandalo y almizcle.', segmento: 'REPLICA', genero: 'UNISEX', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mCreed.id, categoriaId: cAmaderado.id, precio: 90000, stock: 10, imagenUrl: 'https://placehold.co/600x600/4a7c59/ffffff?text=Aventus+Silver', destacado: false }}),
    prisma.producto.create({ data: { nombre: 'BERGAMOTE 22', descripcion: 'Fragancia unisex fresca y elegante de Le Labo. Bergamota brillante, toques florales y fondo amaderado.', segmento: 'REPLICA', genero: 'UNISEX', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mLeLabo.id, categoriaId: cPerfume.id, precio: 90000, stock: 10, imagenUrl: 'https://placehold.co/600x600/b5a642/000000?text=Bergamote+22', destacado: false }}),
    prisma.producto.create({ data: { nombre: 'BHARARA KING', descripcion: 'Fragancia unisex llamativa de Bharara. Citricos vibrantes con corazon frutal y fondo calido de vainilla y ambar.', segmento: 'REPLICA', genero: 'UNISEX', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mBharara.id, categoriaId: cFrutal.id, precio: 100000, stock: 10, imagenUrl: 'https://placehold.co/600x600/8b4513/ffffff?text=Bharara+King', destacado: false }}),
    prisma.producto.create({ data: { nombre: 'BLEECKER', descripcion: 'Fragancia unisex moderna. Notas verdes, arandanos y violeta sobre fondo ambarado y amaderado.', segmento: 'REPLICA', genero: 'UNISEX', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mSinMarca.id, categoriaId: cAmaderado.id, precio: 150000, stock: 10, imagenUrl: 'https://placehold.co/600x600/3b3b3b/ffffff?text=Bleecker', destacado: false }}),
    prisma.producto.create({ data: { nombre: 'AHLI MACABEL', descripcion: 'Fragancia arabe original de alta gama. Composicion lujosa con notas orientales profundas y estela duradera.', segmento: 'ORIGINAL', genero: 'UNISEX', concentracion: 'EXTRAIT', volumen: '100ml', marcaId: mAhli.id, categoriaId: cOriental.id, precio: 420000, stock: 5, imagenUrl: 'https://placehold.co/600x600/c9a84c/000000?text=Ahli+Macabel', destacado: true }}),
    prisma.producto.create({ data: { nombre: 'AHLI VEGA', descripcion: 'Fragancia arabe original de alta gama. Composicion refinada con notas orientales de gran longevidad.', segmento: 'ORIGINAL', genero: 'UNISEX', concentracion: 'EXTRAIT', volumen: '100ml', marcaId: mAhli.id, categoriaId: cOriental.id, precio: 420000, stock: 5, imagenUrl: 'https://placehold.co/600x600/d4af37/000000?text=Ahli+Vega', destacado: true }}),
    prisma.producto.create({ data: { nombre: 'ART OF UNIVERSE', descripcion: 'Fragancia original unisex moderna y sofisticada. Notas frescas, especiadas y amaderadas en balance perfecto.', segmento: 'ORIGINAL', genero: 'UNISEX', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mSinMarca.id, categoriaId: cAmaderado.id, precio: 280000, stock: 5, imagenUrl: 'https://placehold.co/600x600/1c1c3a/ffffff?text=Art+of+Universe', destacado: false }}),
    prisma.producto.create({ data: { nombre: 'ARTE DEL BARRIO RYAN CASTRO', descripcion: 'Fragancia exclusiva del artista colombiano Ryan Castro. Una creacion unica que captura la creatividad urbana colombiana.', segmento: 'ORIGINAL', genero: 'MASCULINO', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mRyanCastro.id, categoriaId: cPerfume.id, precio: 220000, stock: 5, imagenUrl: 'https://placehold.co/600x600/ff6b00/ffffff?text=Arte+del+Barrio', destacado: true }}),
    prisma.producto.create({ data: { nombre: 'ASAD BOURBON ORIGINAL', descripcion: 'Version original de Lattafa. Fragancia masculina intensa con bourbon, vainilla especiada y canela sobre fondo amaderado.', segmento: 'ORIGINAL', genero: 'MASCULINO', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mLattafa.id, categoriaId: cOriental.id, precio: 230000, stock: 5, imagenUrl: 'https://placehold.co/600x600/5c2a00/ffffff?text=Asad+Bourbon', destacado: true }}),
    prisma.producto.create({ data: { nombre: '9 AM', descripcion: 'Fragancia masculina original de Afnan, fresca y acuatica. Notas citricas vibrantes, acordes marinos y fondo amaderado.', segmento: 'ORIGINAL', genero: 'MASCULINO', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mAfnan.id, categoriaId: cAcuatico.id, precio: 240000, stock: 5, imagenUrl: 'https://placehold.co/600x600/003366/ffffff?text=9+AM', destacado: true }}),
    prisma.producto.create({ data: { nombre: '9 PM', descripcion: 'Fragancia masculina original de Afnan, dulce y seductora. Vainilla, canela y manzana roja sobre fondo ambarado para la noche.', segmento: 'ORIGINAL', genero: 'MASCULINO', concentracion: 'EAU_DE_PARFUM', volumen: '100ml', marcaId: mAfnan.id, categoriaId: cOriental.id, precio: 240000, stock: 5, imagenUrl: 'https://placehold.co/600x600/0a0a2e/ffffff?text=9+PM', destacado: true }}),
  ])

  console.log('Seed completado: 13 marcas, 6 categorias, 24 productos')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })