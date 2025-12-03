import { Producto } from './producto';
import { Promocion } from './promocion'; 
import { Personalizacion } from './personalizacion'; 

export interface DetallePedido {
  detalleId: number;
  producto?: Producto;
  promocion?: Promocion;
  personalizacion?: Personalizacion; 
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  descuentoAplicado?: number;
}