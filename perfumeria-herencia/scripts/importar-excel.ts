/**
 * Script de importación — lee el Excel directamente
 * El archivo .xlsx debe estar en: C:\Users\Equipo\Desktop\Perfumeria_Herencia\
 *
 * Ejecutar:
 *   $env:TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}'
 *   npx ts-node scripts/importar-excel.ts
 */

import * as path from 'path'
import * as XLSX from 'xlsx'
import { PrismaClient, Segmento, Genero, Concentracion } from '@prisma/client'

const EXCEL_PATH = path.resolve(__dirname, '../../inventario-1772548206.xlsx')
const prisma = new PrismaClient()

// ─── Marcas ───────────────────────────────────────────────────────────────────
const MARCAS = [
  { nombre: 'Carolina Herrera',   descripcion: 'Casa de moda venezolana-americana',       paisOrigen: 'Venezuela'       },
  { nombre: 'Afnan',              descripcion: 'Casa de perfumería árabe de lujo',         paisOrigen: 'Emiratos Árabes' },
  { nombre: 'Giorgio Armani',     descripcion: 'Casa de moda italiana de lujo',            paisOrigen: 'Italia'          },
  { nombre: 'Lattafa',            descripcion: 'Casa de perfumería árabe contemporánea',   paisOrigen: 'Emiratos Árabes' },
  { nombre: 'Creed',              descripcion: 'Casa de perfumería francesa fundada 1760', paisOrigen: 'Francia'         },
  { nombre: 'Chanel',             descripcion: 'Icónica casa de moda francesa',            paisOrigen: 'Francia'         },
  { nombre: 'Ariana Grande',      descripcion: 'Fragancias de la cantante Ariana Grande',  paisOrigen: 'Estados Unidos'  },
  { nombre: 'Bharara',            descripcion: 'Casa de perfumería de lujo',               paisOrigen: 'Estados Unidos'  },
  { nombre: 'Ahli',               descripcion: 'Perfumería árabe de alta gama',            paisOrigen: 'Arabia Saudita'  },
  { nombre: 'Gilles Cantuel',     descripcion: 'Casa de perfumería francesa',              paisOrigen: 'Francia'         },
  { nombre: 'Le Labo',            descripcion: 'Perfumería artesanal de Nueva York',       paisOrigen: 'Estados Unidos'  },
  { nombre: 'Dior',               descripcion: 'Casa de alta costura francesa',            paisOrigen: 'Francia'         },
  { nombre: 'Versace',            descripcion: 'Casa de moda italiana de lujo',            paisOrigen: 'Italia'          },
  { nombre: 'Hugo Boss',          descripcion: 'Marca alemana de moda y fragancias',       paisOrigen: 'Alemania'        },
  { nombre: 'Paco Rabanne',       descripcion: 'Casa de moda española-francesa',           paisOrigen: 'Francia'         },
  { nombre: 'Jean Paul Gaultier', descripcion: 'Diseñador francés de moda',               paisOrigen: 'Francia'         },
  { nombre: 'Issey Miyake',       descripcion: 'Diseñador japonés de moda',               paisOrigen: 'Japón'           },
  { nombre: 'Nautica',            descripcion: 'Marca americana de estilo marino',         paisOrigen: 'Estados Unidos'  },
  { nombre: 'Lacoste',            descripcion: 'Marca francesa de moda deportiva',         paisOrigen: 'Francia'         },
  { nombre: 'Dolce & Gabbana',    descripcion: 'Casa de moda italiana de lujo',           paisOrigen: 'Italia'          },
  { nombre: 'Montale',            descripcion: 'Casa de perfumería de nicho francesa',     paisOrigen: 'Francia'         },
  { nombre: 'Moschino',           descripcion: 'Marca italiana de moda',                  paisOrigen: 'Italia'          },
  { nombre: 'Perry Ellis',        descripcion: 'Marca americana de moda',                 paisOrigen: 'Estados Unidos'  },
  { nombre: 'Valentino',          descripcion: 'Casa de alta costura italiana',            paisOrigen: 'Italia'          },
  { nombre: 'Juicy Couture',      descripcion: 'Marca americana de moda',                 paisOrigen: 'Estados Unidos'  },
  { nombre: 'Xerjoff',            descripcion: 'Casa de perfumería italiana de nicho',    paisOrigen: 'Italia'          },
  { nombre: 'Rasasi',             descripcion: 'Casa de perfumería árabe',                paisOrigen: 'Emiratos Árabes' },
  { nombre: 'Louis Vuitton',      descripcion: 'Casa de lujo francesa',                   paisOrigen: 'Francia'         },
  { nombre: 'Ryan Castro',        descripcion: 'Artista colombiano',                      paisOrigen: 'Colombia'        },
  { nombre: 'Sin Marca',          descripcion: 'Productos sin marca específica',          paisOrigen: 'Colombia'        },
]

// ─── Inferir marca por nombre ─────────────────────────────────────────────────
function inferirMarca(nombre: string): string {
  const n = nombre.toUpperCase()
  if (n.startsWith('212'))                                          return 'Carolina Herrera'
  if (n.includes('9 AM') || n.includes('9 PM') ||
      n.includes('CLUB DE NUIT') || n.includes('ODYSSEY') ||
      n.includes('SORBETTO'))                                       return 'Afnan'
  if (n.includes('ACQUA DI GIO'))                                   return 'Giorgio Armani'
  if (n.includes('ASAD') || n.includes('LATTAFA HAYA') ||
      n.includes('FAKHAR') || n.includes('YARA') ||
      n.includes('HAWAS') || n.includes('KHAMRAH') ||
      n.includes('NEBRAS') || n.includes('MARSHMALLOW') ||
      n.includes('MAYAR') || n.includes('MAYAN') ||
      n.includes('LIQUID BRUN') || n.includes('VULCAN') ||
      n.includes('ARTE DEL BARRIO'))                                return 'Lattafa'
  if (n.includes('AVENTUS') || n.includes('SILVER MOUNTAIN'))      return 'Creed'
  if (n.includes('BLEU DE CHANEL') || n.includes('COCO MADEMO'))   return 'Chanel'
  if (n.includes('SWEET LIKE CANDY') || n.includes('THANK U NEXT') || n.includes('CLOUD'))
                                                                    return 'Ariana Grande'
  if (n.includes('BHARARA') || n.includes('BLEECKER') || n.includes('AMATHY'))
                                                                    return 'Bharara'
  if (n.includes('AHLI'))                                           return 'Ahli'
  if (n.includes('ARSENAL'))                                        return 'Gilles Cantuel'
  if (n.includes('BERGAMOTE') || n.includes('SANTAL 33'))          return 'Le Labo'
  if (n.includes('SAUVAGE') || n.includes('MISS DIOR'))            return 'Dior'
  if (n.includes('DYLAN'))                                          return 'Versace'
  if (n.includes('HUGO BOSS'))                                      return 'Hugo Boss'
  if (n.includes('INVICTUS') || n.includes('OLYMPEA') ||
      n.includes('ONE MILLION') || n.includes('PHANTOM'))          return 'Paco Rabanne'
  if (n.includes('SCANDAL') || n.includes('ULTRA MALE') ||
      n.includes('LE MALE'))                                        return 'Jean Paul Gaultier'
  if (n.includes('ISSEY MIYAKE'))                                   return 'Issey Miyake'
  if (n.includes('VOYAGE') || n.includes('NAUTICA'))               return 'Nautica'
  if (n.includes('LACOSTE'))                                        return 'Lacoste'
  if (n.includes('LIGHT BLUE') || n.includes('GIARDINI'))          return 'Dolce & Gabbana'
  if (n.includes('MONTALE') || n.includes('MÓNTALE'))              return 'Montale'
  if (n.includes('MOSCHINO'))                                       return 'Moschino'
  if (n.includes('PERRY ELLIS'))                                    return 'Perry Ellis'
  if (n.includes('VALENTINO'))                                      return 'Valentino'
  if (n.includes('VIVA LA JUICY'))                                  return 'Juicy Couture'
  if (n.includes('ERBA PURA'))                                      return 'Xerjoff'
  if (n.includes('HAWAS'))                                          return 'Rasasi'
  if (n.includes('OMBRE NOMADE'))                                   return 'Louis Vuitton'
  return 'Sin Marca'
}

// ─── Leer Excel ───────────────────────────────────────────────────────────────
interface ExcelRow { nombre: string; excelCategoria: string; precio: number; stock: number }

function leerExcel(): ExcelRow[] {
  const wb   = XLSX.readFile(EXCEL_PATH)
  const ws   = wb.Sheets[wb.SheetNames[0]]
  const raw  = XLSX.utils.sheet_to_json(ws, { defval: '', header: 1 }) as any[][]
  return raw
    .slice(8)
    .filter(r => r[2] && String(r[2]).trim() !== '')
    .map(r => ({
      nombre:         String(r[2]).trim(),
      excelCategoria: String(r[3]).trim().replace(/\.$/, ''),
      stock:          Number(r[5]) || 0,
      precio:         Number(r[7]) || 0,
    }))
}

// ─── Mapeo categoría → campos BD ─────────────────────────────────────────────
function mapearCampos(row: ExcelRow): { genero: Genero; segmento: Segmento; categoriaNombre: string } {
  const cat        = row.excelCategoria
  const esOriginal = /\(original\)/i.test(row.nombre)
  if (cat === 'Caballeros')           return { genero: 'MASCULINO', segmento: 'REPLICA',  categoriaNombre: 'Perfume' }
  if (cat === 'Damas')                return { genero: 'FEMENINO',  segmento: 'REPLICA',  categoriaNombre: 'Perfume' }
  if (cat === 'Unisex')               return { genero: 'UNISEX', segmento: esOriginal ? 'ORIGINAL' : 'REPLICA', categoriaNombre: 'Perfume' }
  if (cat === 'Originales Árabes')    return { genero: 'UNISEX',    segmento: 'ORIGINAL', categoriaNombre: 'Oriental' }
  if (cat === 'Mascotas y vehículos') return { genero: 'UNISEX',    segmento: 'REPLICA',  categoriaNombre: 'Mascotas y Vehiculos' }
  return                                     { genero: 'UNISEX',    segmento: 'REPLICA',  categoriaNombre: 'Perfume' }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('📦 Importación desde Excel')
  console.log(`   ${EXCEL_PATH}\n`)

  const productos = leerExcel()
  console.log(`   📋 ${productos.length} productos en el Excel\n`)

  // 1. Marcas
  console.log('🏷  Upsertando marcas...')
  for (const m of MARCAS) {
    await prisma.marca.upsert({ where: { nombre: m.nombre }, update: {}, create: m })
  }
  console.log(`   ✅ ${MARCAS.length} marcas listas\n`)

  // 2. Mapas ID
  const marcaMap = Object.fromEntries((await prisma.marca.findMany()).map(m => [m.nombre, m.id]))
  const catMap   = Object.fromEntries((await prisma.categoria.findMany()).map(c => [c.nombre, c.id]))

  for (const cat of ['Perfume', 'Oriental', 'Mascotas y Vehiculos', 'Amaderado', 'Frutal', 'Acuatico']) {
    if (!catMap[cat]) {
      const c = await prisma.categoria.create({ data: { nombre: cat } })
      catMap[cat] = c.id
    }
  }

  // 3. Productos
  console.log('🛍  Importando productos...')
  let insertados = 0, actualizados = 0, errores = 0

  for (const row of productos) {
    const { genero, segmento, categoriaNombre } = mapearCampos(row)
    const marcaNombre = inferirMarca(row.nombre)
    const marcaId     = marcaMap[marcaNombre]
    const categoriaId = catMap[categoriaNombre]

    if (!marcaId)     { console.error(`❌ Marca "${marcaNombre}" no encontrada → "${row.nombre}"`);    errores++; continue }
    if (!categoriaId) { console.error(`❌ Categoría "${categoriaNombre}" no encontrada → "${row.nombre}"`); errores++; continue }

    try {
      const existing = await prisma.producto.findFirst({ where: { nombre: row.nombre } })
      if (existing) {
        await prisma.producto.update({ where: { id: existing.id }, data: { precio: row.precio, stock: row.stock } })
        actualizados++
      } else {
        await prisma.producto.create({
          data: {
            nombre: row.nombre, segmento, genero,
            concentracion: 'EAU_DE_PARFUM' as Concentracion,
            volumen: '100ml', marcaId, categoriaId,
            precio: row.precio, stock: row.stock,
            imagenUrl: `https://placehold.co/600x600/1a1a2e/ffffff?text=${encodeURIComponent(row.nombre.substring(0, 20))}`,
            destacado: false,
          },
        })
        insertados++
      }
    } catch (e: any) {
      console.error(`❌ "${row.nombre}": ${e.message}`)
      errores++
    }
  }

  console.log(`\n✅ Importación completada:`)
  console.log(`   🆕 Insertados:  ${insertados}`)
  console.log(`   ✏️  Actualizados: ${actualizados}`)
  console.log(`   ❌ Errores:     ${errores}`)
  console.log(`   📦 Total:       ${productos.length}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
