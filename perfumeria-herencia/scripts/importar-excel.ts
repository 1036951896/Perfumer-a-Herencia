/**
 * Script de importación desde el Excel de inventario
 * Mapeo de columnas:
 *  Caballeros       → genero: MASCULINO, segmento: REPLICA
 *  Damas            → genero: FEMENINO,  segmento: REPLICA
 *  Unisex           → genero: UNISEX,    segmento: REPLICA
 *  Originales Árabes→ genero: UNISEX,    segmento: ORIGINAL, cat: Oriental
 *  Mascotas/vehíc.  → genero: UNISEX,    segmento: REPLICA,  cat: Mascotas y Vehiculos
 *  Nombre con (original/Original) → segmento: ORIGINAL
 *
 * Ejecutar: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/importar-excel.ts
 */

import { PrismaClient, Segmento, Genero, Concentracion } from '@prisma/client'

const prisma = new PrismaClient()

// ─── Marcas inferidas por nombre de producto ─────────────────────────────────
const MARCAS = [
  { nombre: 'Carolina Herrera',  descripcion: 'Casa de moda venezolana-americana',       paisOrigen: 'Venezuela'       },
  { nombre: 'Afnan',             descripcion: 'Casa de perfumería árabe de lujo',         paisOrigen: 'Emiratos Árabes' },
  { nombre: 'Giorgio Armani',    descripcion: 'Casa de moda italiana de lujo',            paisOrigen: 'Italia'          },
  { nombre: 'Lattafa',           descripcion: 'Casa de perfumería árabe contemporánea',   paisOrigen: 'Emiratos Árabes' },
  { nombre: 'Creed',             descripcion: 'Casa de perfumería francesa fundada 1760', paisOrigen: 'Francia'         },
  { nombre: 'Chanel',            descripcion: 'Icónica casa de moda francesa',            paisOrigen: 'Francia'         },
  { nombre: 'Ariana Grande',     descripcion: 'Fragancias de la cantante Ariana Grande',  paisOrigen: 'Estados Unidos'  },
  { nombre: 'Bharara',           descripcion: 'Casa de perfumería de lujo',               paisOrigen: 'Estados Unidos'  },
  { nombre: 'Ahli',              descripcion: 'Perfumería árabe de alta gama',            paisOrigen: 'Arabia Saudita'  },
  { nombre: 'Gilles Cantuel',    descripcion: 'Casa de perfumería francesa',              paisOrigen: 'Francia'         },
  { nombre: 'Le Labo',           descripcion: 'Perfumería artesanal de Nueva York',       paisOrigen: 'Estados Unidos'  },
  { nombre: 'Dior',              descripcion: 'Casa de alta costura francesa',            paisOrigen: 'Francia'         },
  { nombre: 'Versace',           descripcion: 'Casa de moda italiana de lujo',            paisOrigen: 'Italia'          },
  { nombre: 'Hugo Boss',         descripcion: 'Marca alemana de moda y fragancias',       paisOrigen: 'Alemania'        },
  { nombre: 'Paco Rabanne',      descripcion: 'Casa de moda española-francesa',           paisOrigen: 'Francia'         },
  { nombre: 'Jean Paul Gaultier',descripcion: 'Diseñador francés de moda',               paisOrigen: 'Francia'         },
  { nombre: 'Issey Miyake',      descripcion: 'Diseñador japonés de moda',               paisOrigen: 'Japón'           },
  { nombre: 'Nautica',           descripcion: 'Marca americana de estilo marino',         paisOrigen: 'Estados Unidos'  },
  { nombre: 'Lacoste',           descripcion: 'Marca francesa de moda deportiva',         paisOrigen: 'Francia'         },
  { nombre: 'Dolce & Gabbana',   descripcion: 'Casa de moda italiana de lujo',           paisOrigen: 'Italia'          },
  { nombre: 'Montale',           descripcion: 'Casa de perfumería de nicho francesa',     paisOrigen: 'Francia'         },
  { nombre: 'Moschino',          descripcion: 'Marca italiana de moda',                  paisOrigen: 'Italia'          },
  { nombre: 'Perry Ellis',       descripcion: 'Marca americana de moda',                 paisOrigen: 'Estados Unidos'  },
  { nombre: 'Valentino',         descripcion: 'Casa de alta costura italiana',            paisOrigen: 'Italia'          },
  { nombre: 'Juicy Couture',     descripcion: 'Marca americana de moda',                 paisOrigen: 'Estados Unidos'  },
  { nombre: 'Xerjoff',           descripcion: 'Casa de perfumería italiana de nicho',    paisOrigen: 'Italia'          },
  { nombre: 'Rasasi',            descripcion: 'Casa de perfumería árabe',                paisOrigen: 'Emiratos Árabes' },
  { nombre: 'Louis Vuitton',     descripcion: 'Casa de lujo francesa',                   paisOrigen: 'Francia'         },
  { nombre: 'Ryan Castro',       descripcion: 'Artista colombiano',                      paisOrigen: 'Colombia'        },
  { nombre: 'Sin Marca',         descripcion: 'Productos sin marca específica',          paisOrigen: 'Colombia'        },
]

// ─── Helper para inferir marca por nombre del producto ───────────────────────
function inferirMarca(nombre: string): string {
  const n = nombre.toUpperCase()
  if (n.startsWith('212') || n.includes('CAROLINA HERRERA'))      return 'Carolina Herrera'
  if (n.startsWith('9 AM') || n.includes('CLUB DE NUIT') || n.includes('ODYSSEY') || n.includes('SORBETTO'))
                                                                    return 'Afnan'
  if (n.includes('ACQUA DI GIO'))                                  return 'Giorgio Armani'
  if (n.includes('ASAD') || n.includes('KHAMRAH') || n.includes('LATTAFA') || n.includes('FAKHAR') || n.includes('YARA'))
                                                                    return 'Lattafa'
  if (n.includes('AVENTUS') || n.includes('SILVER MOUNTAIN'))     return 'Creed'
  if (n.includes('BLEU DE CHANEL') || n.includes('COCO MADEMOISELLE')) return 'Chanel'
  if (n.includes('SWEET LIKE CANDY') || n.includes('THANK U NEXT') || n.includes('CLOUD'))
                                                                    return 'Ariana Grande'
  if (n.includes('BHARARA'))                                       return 'Bharara'
  if (n.includes('AHLI'))                                          return 'Ahli'
  if (n.includes('ARSENAL') || n.includes('GILLES'))              return 'Gilles Cantuel'
  if (n.includes('BERGAMOTE'))                                     return 'Le Labo'
  if (n.includes('SAUVAGE') || n.includes('MISS DIOR'))           return 'Dior'
  if (n.includes('DYLAN'))                                         return 'Versace'
  if (n.includes('HUGO BOSS') || n.includes('BOSS UNLIMITED'))    return 'Hugo Boss'
  if (n.includes('INVICTUS') || n.includes('OLYMPEA') || n.includes('ONE MILLION') || n.includes('PHANTOM'))
                                                                    return 'Paco Rabanne'
  if (n.includes('SCANDAL') || n.includes('ULTRA MALE'))          return 'Jean Paul Gaultier'
  if (n.includes('ISSEY MIYAKE'))                                  return 'Issey Miyake'
  if (n.includes('NAUTICA') || n.includes('VOYAGE'))              return 'Nautica'
  if (n.includes('LACOSTE'))                                       return 'Lacoste'
  if (n.includes('LIGHT BLUE'))                                    return 'Dolce & Gabbana'
  if (n.includes('MONTALE') || n.includes('MÓNTALE'))             return 'Montale'
  if (n.includes('MOSCHINO'))                                      return 'Moschino'
  if (n.includes('PERRY ELLIS'))                                   return 'Perry Ellis'
  if (n.includes('VALENTINO'))                                     return 'Valentino'
  if (n.includes('VIVA LA JUICY'))                                 return 'Juicy Couture'
  if (n.includes('ERBA PURA'))                                     return 'Xerjoff'
  if (n.includes('HAWAS'))                                         return 'Rasasi'
  if (n.includes('OMBRE NOMADE'))                                  return 'Louis Vuitton'
  if (n.includes('ARTE DEL BARRIO') || n.includes('RYAN'))        return 'Ryan Castro'
  return 'Sin Marca'
}

// ─── Datos del Excel ──────────────────────────────────────────────────────────
// excelCategoria: columna Categoría del Excel
// precio:        columna Precio unitario
// stock:         columna Cant.
interface ExcelRow {
  nombre: string
  excelCategoria: 'Caballeros' | 'Damas' | 'Unisex' | 'Originales Árabes' | 'Mascotas y vehículos'
  precio: number
  stock: number
}

const PRODUCTOS_EXCEL: ExcelRow[] = [
  // ── Caballeros ──────────────────────────────────────────────────────────────
  { nombre: '212 HEROES MEN',           excelCategoria: 'Caballeros',         precio: 90000,  stock: 0 },
  { nombre: '212 MEN CLASICA',          excelCategoria: 'Caballeros',         precio: 90000,  stock: 1 },
  { nombre: '212 VIP BLACK',            excelCategoria: 'Caballeros',         precio: 90000,  stock: 0 },
  { nombre: '212 VIP MEN',              excelCategoria: 'Caballeros',         precio: 90000,  stock: 0 },
  { nombre: 'ACQUA DI GIO PROFUM',      excelCategoria: 'Caballeros',         precio: 85000,  stock: 0 },
  { nombre: 'ARSENAL BLACK GILLES',     excelCategoria: 'Caballeros',         precio: 100000, stock: 0 },
  { nombre: 'ASAD BOURBON',             excelCategoria: 'Caballeros',         precio: 110000, stock: 0 },
  { nombre: 'BLEU DE CHANEL',           excelCategoria: 'Caballeros',         precio: 90000,  stock: 0 },
  { nombre: 'CLUB DE NUIT INTENSE',     excelCategoria: 'Caballeros',         precio: 110000, stock: 0 },
  { nombre: 'CREMA CORPORAL',           excelCategoria: 'Caballeros',         precio: 30000,  stock: 1 },
  { nombre: 'DIOR SAUVAGE',             excelCategoria: 'Caballeros',         precio: 90000,  stock: 0 },
  { nombre: 'HAWAS ELIXIR',             excelCategoria: 'Caballeros',         precio: 110000, stock: 1 },
  { nombre: 'HUGO BOSS UNLIMITED',      excelCategoria: 'Caballeros',         precio: 90000,  stock: 0 },
  { nombre: 'INVICTUS',                 excelCategoria: 'Caballeros',         precio: 90000,  stock: 0 },
  { nombre: 'INVICTUS LEGEND',          excelCategoria: 'Caballeros',         precio: 90000,  stock: 0 },
  { nombre: 'INVICTUS ONIX',            excelCategoria: 'Caballeros',         precio: 90000,  stock: 0 },
  { nombre: 'ISSEY MIYAKE POUR HOMME',  excelCategoria: 'Caballeros',         precio: 90000,  stock: 0 },
  { nombre: 'LACOSTE BLANC',            excelCategoria: 'Caballeros',         precio: 80000,  stock: 0 },
  { nombre: 'LACOSTE RED',              excelCategoria: 'Caballeros',         precio: 80000,  stock: 0 },
  { nombre: 'LIGHT BLUE MEN',           excelCategoria: 'Caballeros',         precio: 90000,  stock: 1 },
  { nombre: 'MOSCHINO TOY BOY',         excelCategoria: 'Caballeros',         precio: 110000, stock: 0 },
  { nombre: 'NÁUTICA VOYAGE',           excelCategoria: 'Caballeros',         precio: 85000,  stock: 1 },
  { nombre: 'NITRO RED',                excelCategoria: 'Caballeros',         precio: 130000, stock: 0 },
  { nombre: 'ODYSSEY MEGA',             excelCategoria: 'Caballeros',         precio: 110000, stock: 0 },
  { nombre: 'ODYSSEY TYRANT',           excelCategoria: 'Caballeros',         precio: 110000, stock: 0 },
  { nombre: 'ONE MILLION PRIVÉ',        excelCategoria: 'Caballeros',         precio: 90000,  stock: 0 },
  { nombre: 'PHANTOM',                  excelCategoria: 'Caballeros',         precio: 90000,  stock: 0 },
  { nombre: 'SCANDAL ABSOLU',           excelCategoria: 'Caballeros',         precio: 90000,  stock: 0 },
  { nombre: 'ULTRA MALE',               excelCategoria: 'Caballeros',         precio: 95000,  stock: 0 },
  { nombre: 'VALENTINO BORN IN ROMA',   excelCategoria: 'Caballeros',         precio: 90000,  stock: 0 },
  { nombre: 'VALENTINO UOMO',           excelCategoria: 'Caballeros',         precio: 100000, stock: 0 },
  // ── Damas ───────────────────────────────────────────────────────────────────
  { nombre: '212 VIP ROSE',             excelCategoria: 'Damas',              precio: 90000,  stock: 0 },
  { nombre: 'AGUA DE SOL',              excelCategoria: 'Damas',              precio: 90000,  stock: 0 },
  { nombre: 'COCO MADEMOISELLE',        excelCategoria: 'Damas',              precio: 80000,  stock: 1 },
  { nombre: 'CREMA SENSUALITY',         excelCategoria: 'Damas',              precio: 40000,  stock: 0 },
  { nombre: 'CREMA SENSUALITY TRAVIESA',excelCategoria: 'Damas',              precio: 40000,  stock: 0 },
  { nombre: 'DYLAN TURQUOISE',          excelCategoria: 'Damas',              precio: 110000, stock: 1 },
  { nombre: 'GIARDINI DI TOSCANA',      excelCategoria: 'Damas',              precio: 130000, stock: 0 },
  { nombre: 'LIGHT BLUE FEM',           excelCategoria: 'Damas',              precio: 95000,  stock: 0 },
  { nombre: 'MISS DIOR',                excelCategoria: 'Damas',              precio: 90000,  stock: 1 },
  { nombre: 'MOSCHINO FUNNY',           excelCategoria: 'Damas',              precio: 90000,  stock: 0 },
  { nombre: 'MOSCHINO TOY BOY 2',       excelCategoria: 'Damas',              precio: 110000, stock: 0 },
  { nombre: 'NOBLE BLUSH',              excelCategoria: 'Damas',              precio: 130000, stock: 0 },
  { nombre: 'NOW WOMAN',                excelCategoria: 'Damas',              precio: 130000, stock: 0 },
  { nombre: 'ODYSSEY CANDEE',           excelCategoria: 'Damas',              precio: 110000, stock: 0 },
  { nombre: 'OLYMPEA',                  excelCategoria: 'Damas',              precio: 90000,  stock: 1 },
  { nombre: 'PERRY ELLIS 360°',         excelCategoria: 'Damas',              precio: 90000,  stock: 0 },
  { nombre: 'SCANDAL DAMA',             excelCategoria: 'Damas',              precio: 90000,  stock: 0 },
  { nombre: 'SORBETTO ROSSO',           excelCategoria: 'Damas',              precio: 90000,  stock: 0 },
  { nombre: 'SUBLIME',                  excelCategoria: 'Damas',              precio: 130000, stock: 0 },
  { nombre: 'SWEET LIKE CANDY',         excelCategoria: 'Damas',              precio: 110000, stock: 0 },
  { nombre: 'THANK U NEXT 2.0',         excelCategoria: 'Damas',              precio: 100000, stock: 0 },
  { nombre: 'VIVA LA JUICY',            excelCategoria: 'Damas',              precio: 90000,  stock: 0 },
  { nombre: 'YARA',                     excelCategoria: 'Damas',              precio: 110000, stock: 1 },
  { nombre: 'YARA MOI',                 excelCategoria: 'Damas',              precio: 110000, stock: 0 },
  { nombre: 'YARA TOUS',                excelCategoria: 'Damas',              precio: 110000, stock: 0 },
  // ── Unisex ──────────────────────────────────────────────────────────────────
  { nombre: 'AMATHUS',                  excelCategoria: 'Unisex',             precio: 130000, stock: 0 },
  { nombre: 'AVENTUS',                  excelCategoria: 'Unisex',             precio: 90000,  stock: 0 },
  { nombre: 'AVENTUS SILVER MOUNTAIN',  excelCategoria: 'Unisex',             precio: 90000,  stock: 0 },
  { nombre: 'BERGAMOTE 22',             excelCategoria: 'Unisex',             precio: 90000,  stock: 0 },
  { nombre: 'BHARARA KING',             excelCategoria: 'Unisex',             precio: 100000, stock: 0 },
  { nombre: 'BLEECKER',                 excelCategoria: 'Unisex',             precio: 150000, stock: 1 },
  { nombre: 'CLOUD',                    excelCategoria: 'Unisex',             precio: 100000, stock: 0 },
  { nombre: 'ERBA PURA',                excelCategoria: 'Unisex',             precio: 130000, stock: 0 },
  { nombre: 'HONOR & GLORY',            excelCategoria: 'Unisex',             precio: 90000,  stock: 0 },
  { nombre: 'IATTAR',                   excelCategoria: 'Unisex',             precio: 220000, stock: 0 },
  { nombre: 'MIAMI BLOSSOM',            excelCategoria: 'Unisex',             precio: 90000,  stock: 0 },
  { nombre: 'MÓNTALE PARIS ARABIANS',   excelCategoria: 'Unisex',             precio: 95000,  stock: 0 },
  { nombre: 'MOSCHINO TOY 2',           excelCategoria: 'Unisex',             precio: 110000, stock: 0 },
  { nombre: 'MOSCHINO TOY 2 PEARL',     excelCategoria: 'Unisex',             precio: 110000, stock: 0 },
  { nombre: 'MUESTRA',                  excelCategoria: 'Unisex',             precio: 10000,  stock: 17 },
  { nombre: 'ODYSSEY MANDARIN SKY',     excelCategoria: 'Unisex',             precio: 110000, stock: 3 },
  { nombre: 'ODYSSEY SPECTRA',          excelCategoria: 'Unisex',             precio: 110000, stock: 1 },
  { nombre: 'OMBRE NOMADE',             excelCategoria: 'Unisex',             precio: 120000, stock: 0 },
  { nombre: 'PERFUMERO',                excelCategoria: 'Unisex',             precio: 3500,   stock: 17 },
  { nombre: 'RITUAL AL',                excelCategoria: 'Unisex',             precio: 90000,  stock: 0 },
  { nombre: 'SEX-SEA',                  excelCategoria: 'Unisex',             precio: 105000, stock: 0 },
  { nombre: 'SUMMER HAMMER',            excelCategoria: 'Unisex',             precio: 120000, stock: 0 },
  { nombre: 'ZUM YUM',                  excelCategoria: 'Unisex',             precio: 160000, stock: 2 },
  // ── Originales Árabes ───────────────────────────────────────────────────────
  { nombre: '9 AM (original)',           excelCategoria: 'Originales Árabes', precio: 240000, stock: 2 },
  { nombre: 'AHLI MACABEL',             excelCategoria: 'Originales Árabes', precio: 420000, stock: 1 },
  { nombre: 'AHLI VEGA',                excelCategoria: 'Originales Árabes', precio: 420000, stock: 1 },
  { nombre: 'ART OF UNIVERSE (original)',excelCategoria: 'Originales Árabes', precio: 280000, stock: 0 },
  { nombre: 'ARTE DEL BARRIO RYAN',     excelCategoria: 'Originales Árabes', precio: 220000, stock: 1 },
  { nombre: 'ASAD BOURBON (Original)',  excelCategoria: 'Originales Árabes', precio: 230000, stock: 1 },
  { nombre: 'CLUB DE NUIT INTENSE (Original)', excelCategoria: 'Originales Árabes', precio: 220000, stock: 0 },
  { nombre: 'CLUB DE NUIT PRECIEUX',    excelCategoria: 'Originales Árabes', precio: 360000, stock: 0 },
  { nombre: 'CLUB DE NUIT SILLAGE',     excelCategoria: 'Originales Árabes', precio: 250000, stock: 0 },
  { nombre: 'ECLAIRE (original)',        excelCategoria: 'Originales Árabes', precio: 250000, stock: 0 },
  { nombre: 'FAKHAR BLACK (original)',  excelCategoria: 'Originales Árabes', precio: 225000, stock: 0 },
  { nombre: 'HAWAS FIRE (original)',    excelCategoria: 'Originales Árabes', precio: 360000, stock: 0 },
  { nombre: 'HAWAS ICE (original)',     excelCategoria: 'Originales Árabes', precio: 280000, stock: 0 },
  { nombre: 'HAWAS MALIBÚ (original)', excelCategoria: 'Originales Árabes', precio: 310000, stock: 0 },
  { nombre: 'HAWAS TROPICAL (original)',excelCategoria: 'Originales Árabes', precio: 320000, stock: 0 },
  { nombre: 'KHAMRAH',                  excelCategoria: 'Originales Árabes', precio: 260000, stock: 1 },
  { nombre: 'LATTAFA HAYA (original)', excelCategoria: 'Originales Árabes', precio: 220000, stock: 0 },
  { nombre: 'LIQUID BRUN (original)',   excelCategoria: 'Originales Árabes', precio: 280000, stock: 1 },
  { nombre: 'MARSHMALLOW BLUSH',        excelCategoria: 'Originales Árabes', precio: 300000, stock: 0 },
  { nombre: 'MAYAN CHERRY',             excelCategoria: 'Originales Árabes', precio: 250000, stock: 0 },
  { nombre: 'NEBRAS (original)',        excelCategoria: 'Originales Árabes', precio: 230000, stock: 0 },
  { nombre: 'ODYSSEY ACQUA (original)',  excelCategoria: 'Originales Árabes', precio: 110000, stock: 2 },
  { nombre: 'ODYSSEY ARTISTO (original)',excelCategoria: 'Originales Árabes', precio: 270000, stock: 0 },
  { nombre: 'ODYSSEY BA HA MÁS (original)',excelCategoria:'Originales Árabes',precio: 270000, stock: 1 },
  { nombre: 'ODYSSEY GO MANGO',         excelCategoria: 'Originales Árabes', precio: 270000, stock: 0 },
  { nombre: 'ODYSSEY HOMME (original)', excelCategoria: 'Originales Árabes', precio: 110000, stock: 2 },
  { nombre: 'ODYSSEY HOMME WHITE',      excelCategoria: 'Originales Árabes', precio: 220000, stock: 0 },
  { nombre: 'ODYSSEY MANDARIN SKY (Original)', excelCategoria: 'Originales Árabes', precio: 265000, stock: 2 },
  { nombre: 'ODYSSEY TYREN (Original)', excelCategoria: 'Originales Árabes', precio: 220000, stock: 0 },
  { nombre: 'VULCAN FEU',               excelCategoria: 'Originales Árabes', precio: 265000, stock: 1 },
  { nombre: 'YARA (original)',           excelCategoria: 'Originales Árabes', precio: 210000, stock: 1 },
  { nombre: 'YARA CANDY (original)',    excelCategoria: 'Originales Árabes', precio: 210000, stock: 2 },
  { nombre: 'YARA TOUS (original)',     excelCategoria: 'Originales Árabes', precio: 210000, stock: 1 },
  // ── Mascotas y vehículos ────────────────────────────────────────────────────
  { nombre: 'NEW CAR',                  excelCategoria: 'Mascotas y vehículos', precio: 60000, stock: 0 },
]

// ─── Mapeo Excel → campos del sistema ────────────────────────────────────────
function mapearCampos(row: ExcelRow): { genero: Genero; segmento: Segmento; categoriaNombre: string } {
  const esOriginalPorNombre = /\(original\)/i.test(row.nombre)

  switch (row.excelCategoria) {
    case 'Caballeros':
      return { genero: 'MASCULINO', segmento: 'REPLICA', categoriaNombre: 'Perfume' }
    case 'Damas':
      return { genero: 'FEMENINO', segmento: 'REPLICA', categoriaNombre: 'Perfume' }
    case 'Unisex':
      return {
        genero: 'UNISEX',
        segmento: esOriginalPorNombre ? 'ORIGINAL' : 'REPLICA',
        categoriaNombre: 'Perfume',
      }
    case 'Originales Árabes':
      return { genero: 'UNISEX', segmento: 'ORIGINAL', categoriaNombre: 'Oriental' }
    case 'Mascotas y vehículos':
      return { genero: 'UNISEX', segmento: 'REPLICA', categoriaNombre: 'Mascotas y Vehiculos' }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('📦 Iniciando importación desde Excel...\n')

  // 1. Upsert marcas
  console.log('🏷  Upsertando marcas...')
  for (const m of MARCAS) {
    await prisma.marca.upsert({
      where: { nombre: m.nombre },
      update: {},
      create: m,
    })
  }
  console.log(`   ✅ ${MARCAS.length} marcas listas\n`)

  // 2. Cargar mapas de IDs
  const marcasDB = await prisma.marca.findMany()
  const marcaMap = Object.fromEntries(marcasDB.map(m => [m.nombre, m.id]))

  const categoriasDB = await prisma.categoria.findMany()
  const catMap = Object.fromEntries(categoriasDB.map(c => [c.nombre, c.id]))

  // Verificar que las categorías necesarias existen
  const catsNecesarias = ['Perfume', 'Oriental', 'Mascotas y Vehiculos']
  for (const cat of catsNecesarias) {
    if (!catMap[cat]) {
      console.warn(`⚠️  Categoría "${cat}" no encontrada en la BD — se creará`)
      const nueva = await prisma.categoria.create({ data: { nombre: cat } })
      catMap[cat] = nueva.id
    }
  }

  // 3. Insertar / actualizar productos
  console.log('🛍  Importando productos...')
  let insertados = 0
  let actualizados = 0
  let errores = 0

  for (const row of PRODUCTOS_EXCEL) {
    const { genero, segmento, categoriaNombre } = mapearCampos(row)
    const marcaNombre = inferirMarca(row.nombre)
    const marcaId = marcaMap[marcaNombre]
    const categoriaId = catMap[categoriaNombre]

    if (!marcaId) {
      console.error(`❌ Marca no encontrada: "${marcaNombre}" para "${row.nombre}"`)
      errores++
      continue
    }
    if (!categoriaId) {
      console.error(`❌ Categoría no encontrada: "${categoriaNombre}" para "${row.nombre}"`)
      errores++
      continue
    }

    try {
      const existing = await prisma.producto.findFirst({ where: { nombre: row.nombre } })
      if (existing) {
        await prisma.producto.update({
          where: { id: existing.id },
          data: { precio: row.precio, stock: row.stock },
        })
        actualizados++
      } else {
        await prisma.producto.create({
          data: {
            nombre: row.nombre,
            segmento,
            genero,
            concentracion: 'EAU_DE_PARFUM' as Concentracion,
            volumen: '100ml',
            marcaId,
            categoriaId,
            precio: row.precio,
            stock: row.stock,
            imagenUrl: `https://placehold.co/600x600/1a1a2e/ffffff?text=${encodeURIComponent(row.nombre.substring(0, 20))}`,
            destacado: false,
          },
        })
        insertados++
      }
    } catch (e: any) {
      console.error(`❌ Error en "${row.nombre}": ${e.message}`)
      errores++
    }
  }

  console.log(`\n✅ Importación completada:`)
  console.log(`   🆕 Insertados:  ${insertados}`)
  console.log(`   ✏️  Actualizados: ${actualizados}`)
  console.log(`   ❌ Errores:     ${errores}`)
  console.log(`   📦 Total Excel: ${PRODUCTOS_EXCEL.length}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
