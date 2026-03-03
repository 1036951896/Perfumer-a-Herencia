import { PrismaClient, TipoProducto, Genero } from '@prisma/client'
import { FiltroProductos, RespuestaPaginada, Producto } from '@/types'

const prisma = new PrismaClient()

export class ProductoRepository {
  /**
   * Obtiene productos con filtros y paginación
   */
  static async obtenerConFiltros(
    filtros: FiltroProductos
  ): Promise<RespuestaPaginada<Producto>> {
    const {
      tipo,
      genero,
      marcaId,
      busqueda,
      destacado,
      pagina = 1,
      limite = 12,
    } = filtros

    const skip = (pagina - 1) * limite

    const where: any = {
      activo: true,
    }

    if (tipo) where.tipo = tipo
    if (genero) where.genero = genero
    if (marcaId) where.marcaId = marcaId
    if (destacado !== undefined) where.destacado = destacado
    if (busqueda) {
      where.OR = [
        { nombre: { contains: busqueda, mode: 'insensitive' } },
        { descripcion: { contains: busqueda, mode: 'insensitive' } },
      ]
    }

    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        include: { marca: true },
        skip,
        take: limite,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.producto.count({ where }),
    ])

    return {
      datos: productos,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    }
  }

  /**
   * Obtiene un producto por ID
   */
  static async obtenerPorId(id: string): Promise<Producto | null> {
    return prisma.producto.findUnique({
      where: { id },
      include: { marca: true },
    })
  }

  /**
   * Obtiene productos destacados
   */
  static async obtenerDestacados(limite: number = 8): Promise<Producto[]> {
    return prisma.producto.findMany({
      where: {
        destacado: true,
        activo: true,
      },
      include: { marca: true },
      take: limite,
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Crea un nuevo producto
   */
  static async crear(datos: any): Promise<Producto> {
    return prisma.producto.create({
      data: {
        ...datos,
      },
      include: { marca: true },
    })
  }

  /**
   * Actualiza un producto
   */
  static async actualizar(id: string, datos: any): Promise<Producto> {
    return prisma.producto.update({
      where: { id },
      data: {
        ...datos,
      },
      include: { marca: true },
    })
  }

  /**
   * Desactiva un producto
   */
  static async desactivar(id: string): Promise<Producto> {
    return this.actualizar(id, { activo: false })
  }

  /**
   * Activa un producto
   */
  static async activar(id: string): Promise<Producto> {
    return this.actualizar(id, { activo: true })
  }

  /**
   * Obtiene todos los géneros disponibles
   */
  static async obtenerGeneros(): Promise<Genero[]> {
    const productos = await prisma.producto.findMany({
      where: { activo: true },
      distinct: ['genero'],
      select: { genero: true },
    })

    return productos.map((p) => p.genero)
  }
}

export class MarcaRepository {
  /**
   * Obtiene todas las marcas activas
   */
  static async obtenerActivas() {
    return prisma.marca.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    })
  }

  /**
   * Obtiene una marca por ID
   */
  static async obtenerPorId(id: string) {
    return prisma.marca.findUnique({
      where: { id },
    })
  }

  /**
   * Crea una nueva marca
   */
  static async crear(datos: any) {
    return prisma.marca.create({
      data: datos,
    })
  }

  /**
   * Actualiza una marca
   */
  static async actualizar(id: string, datos: any) {
    return prisma.marca.update({
      where: { id },
      data: datos,
    })
  }

  /**
   * Desactiva una marca
   */
  static async desactivar(id: string) {
    return this.actualizar(id, { activo: false })
  }
}

export class PedidoRepository {
  /**
   * Crea un nuevo pedido
   */
  static async crear(datos: any) {
    return prisma.pedido.create({
      data: {
        ...datos,
      },
      include: {
        items: {
          include: {
            producto: {
              include: {
                marca: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * Obtiene un pedido por ID
   */
  static async obtenerPorId(id: string) {
    return prisma.pedido.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            producto: {
              include: {
                marca: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * Obtiene un pedido por referencia
   */
  static async obtenerPorReferencia(referencia: string) {
    return prisma.pedido.findUnique({
      where: { referencia },
      include: {
        items: {
          include: {
            producto: {
              include: {
                marca: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * Obtiene todos los pedidos con paginación
   */
  static async obtenerTodos(pagina: number = 1, limite: number = 20) {
    const skip = (pagina - 1) * limite

    const [pedidos, total] = await Promise.all([
      prisma.pedido.findMany({
        skip,
        take: limite,
        include: {
          items: {
            include: {
              producto: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.pedido.count(),
    ])

    return {
      datos: pedidos,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    }
  }

  /**
   * Actualiza el estado de un pedido
   */
  static async actualizarEstado(id: string, estado: string) {
    return prisma.pedido.update({
      where: { id },
      data: { estado: estado as any },
      include: {
        items: {
          include: {
            producto: true,
          },
        },
      },
    })
  }
}

export class CategoriaRepository {
  /**
   * Obtiene todas las categorías activas
   */
  static async obtenerActivas() {
    return prisma.categoria.findMany({
      where: { activa: true },
      orderBy: { nombre: 'asc' },
    })
  }

  /**
   * Obtiene una categoría por ID
   */
  static async obtenerPorId(id: string) {
    return prisma.categoria.findUnique({
      where: { id },
    })
  }

  /**
   * Crea una nueva categoría
   */
  static async crear(datos: any) {
    return prisma.categoria.create({
      data: datos,
    })
  }

  /**
   * Obtiene todas las categorías por tipo
   */
  static async obtenerPorTipo(tipo: string) {
    return prisma.categoria.findMany({
      where: { tipo: tipo as any, activa: true },
      orderBy: { nombre: 'asc' },
    })
  }
}

export class AdminUserRepository {
  /**
   * Obtiene un admin por email
   */
  static async obtenerPorEmail(email: string) {
    return prisma.adminUser.findUnique({
      where: { email },
    })
  }

  /**
   * Crea un nuevo admin
   */
  static async crear(datos: any) {
    return prisma.adminUser.create({
      data: datos,
    })
  }

  /**
   * Obtiene todos los admins
   */
  static async obtenerTodos() {
    return prisma.adminUser.findMany({
      where: { activo: true },
    })
  }

  /**
   * Desactiva un admin
   */
  static async desactivar(id: string) {
    return prisma.adminUser.update({
      where: { id },
      data: { activo: false },
    })
  }
}
