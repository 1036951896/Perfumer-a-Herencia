import {
  ProductoRepository,
  MarcaRepository,
  PedidoRepository,
  CategoriaRepository,
} from '@/repositories'
import {
  FiltroProductos,
  CrearProductoDTO,
  ActualizarProductoDTO,
  CrearPedidoDTO,
  RespuestaAPI,
} from '@/types'
import { generarReferenciaPedido } from '@/lib/utils'

export class ProductoService {
  /**
   * Obtiene productos con filtros y paginación
   */
  static async obtenerConFiltros(filtros: FiltroProductos) {
    try {
      return await ProductoRepository.obtenerConFiltros(filtros)
    } catch (error) {
      throw new Error('Error al obtener productos')
    }
  }

  /**
   * Obtiene un producto por ID
   */
  static async obtenerPorId(id: string) {
    const producto = await ProductoRepository.obtenerPorId(id)
    if (!producto) {
      throw new Error('Producto no encontrado')
    }
    return producto
  }

  /**
   * Obtiene productos destacados
   */
  static async obtenerDestacados(limite: number = 8) {
    return ProductoRepository.obtenerDestacados(limite)
  }

  /**
   * Crea un nuevo producto (Solo admin)
   */
  static async crear(datos: CrearProductoDTO) {
    try {
      return await ProductoRepository.crear(datos)
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Ya existe un producto con este nombre')
      }
      throw new Error('Error al crear producto')
    }
  }

  /**
   * Actualiza un producto (Solo admin)
   */
  static async actualizar(id: string, datos: ActualizarProductoDTO) {
    try {
      const producto = await ProductoRepository.obtenerPorId(id)
      if (!producto) {
        throw new Error('Producto no encontrado')
      }

      return await ProductoRepository.actualizar(id, datos)
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Ya existe otro producto con este nombre')
      }
      throw error
    }
  }

  /**
   * Desactiva un producto
   */
  static async desactivar(id: string) {
    return ProductoRepository.desactivar(id)
  }

  /**
   * Obtiene los géneros disponibles
   */
  static async obtenerGeneros() {
    return ProductoRepository.obtenerGeneros()
  }
}

export class MarcaService {
  /**
   * Obtiene todas las marcas activas
   */
  static async obtenerActivas() {
    return MarcaRepository.obtenerActivas()
  }

  /**
   * Obtiene una marca por ID
   */
  static async obtenerPorId(id: string) {
    const marca = await MarcaRepository.obtenerPorId(id)
    if (!marca) {
      throw new Error('Marca no encontrada')
    }
    return marca
  }

  /**
   * Crea una nueva marca (Solo admin)
   */
  static async crear(nombre: string) {
    try {
      return await MarcaRepository.crear({ nombre })
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Ya existe una marca con este nombre')
      }
      throw new Error('Error al crear marca')
    }
  }

  /**
   * Actualiza una marca (Solo admin)
   */
  static async actualizar(id: string, nombre: string) {
    const marca = await MarcaRepository.obtenerPorId(id)
    if (!marca) {
      throw new Error('Marca no encontrada')
    }

    try {
      return await MarcaRepository.actualizar(id, { nombre })
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Ya existe otra marca con este nombre')
      }
      throw error
    }
  }

  /**
   * Desactiva una marca
   */
  static async desactivar(id: string) {
    return MarcaRepository.desactivar(id)
  }
}

export class PedidoService {
  /**
   * Crea un nuevo pedido
   */
  static async crear(datos: CrearPedidoDTO) {
    try {
      // Validar que los productos existan y obtener sus precios
      let total = 0
      const items: any[] = []

      for (const item of datos.items) {
        const producto = await ProductoRepository.obtenerPorId(item.productoId)
        if (!producto) {
          throw new Error(`Producto ${item.productoId} no encontrado`)
        }

        if (!producto.precio) {
          throw new Error(`Producto ${producto.nombre} no tiene precio`)
        }

        items.push({
          productoId: producto.id,
          cantidad: item.cantidad,
          precio: producto.precio,
        })

        total += producto.precio * item.cantidad
      }

      // Crear el pedido
      const referencia = generarReferenciaPedido()

      return await PedidoRepository.crear({
        referencia,
        total,
        items: {
          createMany: {
            data: items,
          },
        },
      })
    } catch (error: any) {
      throw error
    }
  }

  /**
   * Obtiene un pedido por ID
   */
  static async obtenerPorId(id: string) {
    const pedido = await PedidoRepository.obtenerPorId(id)
    if (!pedido) {
      throw new Error('Pedido no encontrado')
    }
    return pedido
  }

  /**
   * Obtiene un pedido por referencia
   */
  static async obtenerPorReferencia(referencia: string) {
    const pedido = await PedidoRepository.obtenerPorReferencia(referencia)
    if (!pedido) {
      throw new Error('Pedido no encontrado')
    }
    return pedido
  }

  /**
   * Obtiene todos los pedidos (Solo admin)
   */
  static async obtenerTodos(pagina: number = 1, limite: number = 20) {
    return PedidoRepository.obtenerTodos(pagina, limite)
  }

  /**
   * Actualiza el estado del pedido (Solo admin)
   */
  static async actualizarEstado(id: string, estado: string) {
    const estadosValidos = ['PENDIENTE', 'CONFIRMADO', 'ENTREGADO']
    if (!estadosValidos.includes(estado)) {
      throw new Error('Estado inválido')
    }

    const pedido = await PedidoRepository.obtenerPorId(id)
    if (!pedido) {
      throw new Error('Pedido no encontrado')
    }

    return PedidoRepository.actualizarEstado(id, estado)
  }
}

export class CategoriaService {
  /**
   * Obtiene todas las categorías activas
   */
  static async obtenerActivas() {
    return CategoriaRepository.obtenerActivas()
  }

  /**
   * Obtiene categorías por tipo
   */
  static async obtenerPorTipo(tipo: string) {
    const tiposValidos = ['TENDENCIA', 'COLECCION']
    if (!tiposValidos.includes(tipo)) {
      throw new Error('Tipo de categoría inválido')
    }

    return CategoriaRepository.obtenerPorTipo(tipo)
  }

  /**
   * Crea una nueva categoría (Solo admin)
   */
  static async crear(nombre: string, tipo: string) {
    const tiposValidos = ['TENDENCIA', 'COLECCION']
    if (!tiposValidos.includes(tipo)) {
      throw new Error('Tipo de categoría inválido')
    }

    try {
      return await CategoriaRepository.crear({ nombre, tipo })
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Ya existe una categoría con este nombre')
      }
      throw new Error('Error al crear categoría')
    }
  }
}
