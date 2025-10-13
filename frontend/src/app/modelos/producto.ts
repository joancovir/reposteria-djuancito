// Ruta: src/app/modelos/producto.ts
export interface Producto {
  productoId: number; 
  nombre: string;
  categoria: string;
  descripcion: string;
  precioBase: number;
  imagenUrl: string;
  personalizable: boolean;
  personalizacion?: any; 

}