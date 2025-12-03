
export type CategoriaProducto = 'torta' | 'postre' | 'bocadito';
export type EstadoProducto = 'activo' | 'inactivo';

export interface Producto {
  productoId: number;
  nombre: string;
  categoria: CategoriaProducto | string; 
  descripcion?: string; 
  precioBase: number;
  imagenUrl: string;
  personalizable: boolean;
  personalizacion?: any; 
  estado?: EstadoProducto | string; 
}