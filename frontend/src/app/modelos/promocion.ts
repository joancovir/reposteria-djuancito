import { PromocionProducto } from './promocion-producto'; 

export interface Promocion {
  promocionId: number; 
  titulo: string;
  descripcion?: string;
  imagenUrl?: string;
  montoMinimo?: number;
  fechaInicio: string; 
  fechaFin: string; 
  descuento: number;
  estado: 'activo' | 'inactivo';
  temporadaId?: number;

 
  promocionProductos?: PromocionProducto[]; 
}

