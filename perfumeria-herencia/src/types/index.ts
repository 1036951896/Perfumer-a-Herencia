// Types para el modelo de base de datos
export type TipoProducto = 'ORIGINAL' | 'REPLICA'
export type Segmento = TipoProducto
export type Genero = 'MASCULINO' | 'FEMENINO' | 'UNISEX'
export type TipoCategoria = 'TENDENCIA' | 'COLECCION'
export type EstadoPedido = 'PENDIENTE' | 'CONFIRMADO' | 'ENTREGADO'

export interface Coleccion {
  id: string
  nombre: string
  slug: string
  descripcion?: string
  seoTitle?: string
  seoDescription?: string
  imagenUrl?: string
  bannerUrl?: string
  colorTexto?: string
  orden: number
  activo: boolean
  destacado: boolean
  segmento: TipoProducto
  createdAt: Date
  updatedAt: Date
  _count?: { productos: number }
}

export interface CrearColeccionDTO {
  nombre: string
  slug: string
  descripcion?: string
  seoTitle?: string
  seoDescription?: string
  imagenUrl?: string
  bannerUrl?: string
  colorTexto?: string
  orden?: number
  destacado?: boolean
  segmento: TipoProducto
}

export interface ActualizarColeccionDTO {
  nombre?: string
  slug?: string
  descripcion?: string
  seoTitle?: string
  seoDescription?: string
  imagenUrl?: string
  bannerUrl?: string
  colorTexto?: string
  orden?: number
  activo?: boolean
  destacado?: boolean
  productoIds?: string[]
}

export interface Marca {
  id: string
  nombre: string
  activo: boolean
  createdAt: Date
}

export interface Categoria {
  id: string
  nombre: string
  activa: boolean
  createdAt: Date
}

export interface Producto {
  id: string
  nombre: string
  descripcion?: string
  segmento: TipoProducto
  genero: Genero
  marcaId: string
  marca?: Marca
  precio?: number
  imagenUrl: string
  destacado: boolean
  activo: boolean
  createdAt: Date
}

export interface PedidoItem {
  id: string
  productoId: string
  producto?: Producto
  cantidad: number
  precio: number
}

export interface Pedido {
  id: string
  referencia: string
  total: number
  estado: EstadoPedido
  items: PedidoItem[]
  createdAt: Date
}

export interface AdminUser {
  id: string
  email: string
  activo: boolean
}

// Types para filtros
export interface FiltroProductos {
  segmento?: TipoProducto
  genero?: Genero
  marcaId?: string
  busqueda?: string
  destacado?: boolean
  coleccionSlug?: string
  pagina?: number
  limite?: number
}

// Types para requests/responses
export interface CrearProductoDTO {
  nombre: string
  descripcion?: string
  segmento: TipoProducto
  genero: Genero
  marcaId: string
  precio?: number
  imagenUrl: string
  destacado?: boolean
}

export interface ActualizarProductoDTO {
  nombre?: string
  descripcion?: string
  segmento?: TipoProducto
  genero?: Genero
  marcaId?: string
  precio?: number
  imagenUrl?: string
  destacado?: boolean
  activo?: boolean
}

export interface CrearMarcaDTO {
  nombre: string
}

export interface CrearPedidoDTO {
  items: Array<{
    productoId: string
    cantidad: number
  }>
}

export interface RespuestaPaginada<T> {
  datos: T[]
  total: number
  pagina: number
  limite: number
  totalPaginas: number
}

export interface RespuestaAPI<T> {
  exito: boolean
  datos?: T
  mensaje?: string
  errores?: Record<string, string[]>
}

// Segment type
export type Segment = 'original' | 'replicas'
