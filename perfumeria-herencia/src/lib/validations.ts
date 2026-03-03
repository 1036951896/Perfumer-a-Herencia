import { z } from 'zod'
import { TipoProducto, Genero } from '@/types'

// Schemas para Marcas
export const CrearMarcaSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
})

// Schemas para Productos
export const CrearProductoSchema = z.object({
  nombre: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  descripcion: z
    .string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),
  segmento: z.enum(['ORIGINAL', 'REPLICA'] as const),
  genero: z.enum(['MASCULINO', 'FEMENINO', 'UNISEX'] as const),
  marcaId: z.string().uuid('ID de marca inválido'),
  precio: z
    .number()
    .positive('El precio debe ser un valor positivo')
    .optional(),
  imagenUrl: z.string().url('URL de imagen inválida'),
  destacado: z.boolean().default(false),
})

export const ActualizarProductoSchema = CrearProductoSchema.partial()

// Schemas para Pedidos
export const CrearPedidoSchema = z.object({
  items: z
    .array(
      z.object({
        productoId: z.string().uuid('ID de producto inválido'),
        cantidad: z
          .number()
          .int('La cantidad debe ser un número entero')
          .positive('La cantidad debe ser mayor a cero'),
      })
    )
    .min(1, 'El pedido debe contener al menos un producto'),
})

// Schemas para Admin
export const LoginAdminSchema = z.object({
  email: z
    .string()
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const CrearAdminUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener mayúsculas, minúsculas y números'
    ),
})

// Type exports
export type CrearMarcaInput = z.infer<typeof CrearMarcaSchema>
export type CrearProductoInput = z.infer<typeof CrearProductoSchema>
export type ActualizarProductoInput = z.infer<typeof ActualizarProductoSchema>
export type CrearPedidoInput = z.infer<typeof CrearPedidoSchema>
export type LoginAdminInput = z.infer<typeof LoginAdminSchema>
export type CrearAdminUserInput = z.infer<typeof CrearAdminUserSchema>
